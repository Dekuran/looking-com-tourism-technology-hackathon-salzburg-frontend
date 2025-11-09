import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

const API_BASE_URL = "https://lookingcom-backend.vercel.app";

interface AnalyticsSummary {
  total_searches: number;
  total_reservations: number;
  conversion_rate: number;
  total_revenue: number;
  average_booking_value: number;
  popular_durations: Record<number, number>;
  searches: any[];
  reservations: any[];
}

const Admin = () => {
  const { t } = useTranslation();
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [timeRange, setTimeRange] = useState<string>("24");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    fetchAnalytics();
    
    // Auto-refresh every 15 minutes
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 15 * 60 * 1000); // 15 minutes in milliseconds
    
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // For "all time", use stats endpoint or a very large number
      const hoursParam = timeRange === "all" ? "999999" : timeRange;
      const url = `${API_BASE_URL}/api/v1/analytics/summary?hours=${hoursParam}`;
      console.log("Fetching analytics from:", url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Analytics data received:", data);
      setAnalyticsData(data);
      toast.success("Analytics-Daten aktualisiert");
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error(`Fehler: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts (will be replaced with real data when available)
  const revenueData = [
    { month: "Jan", revenue: 15200 },
    { month: "Feb", revenue: 17600 },
    { month: "Mär", revenue: 16100 },
    { month: "Apr", revenue: 12800 },
    { month: "Mai", revenue: 14200 },
    { month: "Jun", revenue: 18500 },
    { month: "Jul", revenue: 23000 },
    { month: "Aug", revenue: 24300 },
    { month: "Sep", revenue: 17200 },
    { month: "Okt", revenue: 15500 },
    { month: "Nov", revenue: 16500 },
    { month: "Dez", revenue: 19600 }
  ];

  const priceHeatmap = [
    { day: "Mo", jan: 180, feb: 190, mar: 140, apr: 120, mai: 110, jun: 130, jul: 160, aug: 170, sep: 130, okt: 140, nov: 150, dez: 200 },
    { day: "Di", jan: 175, feb: 185, mar: 135, apr: 115, mai: 105, jun: 125, jul: 155, aug: 165, sep: 125, okt: 135, nov: 145, dez: 195 },
    { day: "Mi", jan: 185, feb: 195, mar: 145, apr: 125, mai: 115, jun: 135, jul: 165, aug: 175, sep: 135, okt: 145, nov: 155, dez: 210 },
    { day: "Do", jan: 190, feb: 200, mar: 150, apr: 130, mai: 120, jun: 140, jul: 170, aug: 180, sep: 140, okt: 150, nov: 160, dez: 220 },
    { day: "Fr", jan: 210, feb: 220, mar: 160, apr: 140, mai: 130, jun: 150, jul: 180, aug: 190, sep: 150, okt: 160, nov: 170, dez: 250 },
    { day: "Sa", jan: 240, feb: 250, mar: 180, apr: 150, mai: 140, jun: 160, jul: 200, aug: 210, sep: 170, okt: 180, nov: 190, dez: 280 },
    { day: "So", jan: 230, feb: 240, mar: 170, apr: 145, mai: 135, jun: 155, jul: 190, aug: 200, sep: 160, okt: 170, nov: 180, dez: 270 },
  ];

  const monthlyBookingsData = [
    { month: "Jan", bookings: 45 },
    { month: "Feb", bookings: 52 },
    { month: "Mar", bookings: 38 },
    { month: "Apr", bookings: 25 },
    { month: "Mai", bookings: 18 },
    { month: "Jun", bookings: 30 },
    { month: "Jul", bookings: 48 },
    { month: "Aug", bookings: 55 },
    { month: "Sep", bookings: 32 },
    { month: "Okt", bookings: 40 },
    { month: "Nov", bookings: 47 },
    { month: "Dez", bookings: 68 }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      confirmed: "default",
      pending: "secondary",
      cancelled: "destructive"
    };
    return <Badge variant={variants[status]} className="rounded-lg">{t(`admin.${status}`)}</Badge>;
  };

  const getPriceColor = (price: number) => {
    // Peak season (high prices) = pink/magenta, low season = blue/purple
    if (price >= 200) return "hsl(328, 96%, 60%)"; // Secondary color for peak
    if (price >= 170) return "hsl(328, 86%, 70%)";
    if (price >= 150) return "hsl(262, 90%, 65%)";
    if (price >= 130) return "hsl(262, 85%, 75%)";
    return "hsl(262, 80%, 85%)"; // Primary color for low season
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navigation />
      
      <div className="pt-14">
        <header className="bg-background border-b border-border">
          <div className="container mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">{t("admin.title")}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {timeRange === "all" 
                    ? "Alle Daten seit Serverstart" 
                    : `Echtzeit-Daten der letzten ${timeRange === "168" ? "7 Tage" : timeRange + " Stunden"}`}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchAnalytics}
                  disabled={loading}
                  className="rounded-lg"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Aktualisieren
                </Button>
                
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Stunde</SelectItem>
                    <SelectItem value="6">6 Stunden</SelectItem>
                    <SelectItem value="12">12 Stunden</SelectItem>
                    <SelectItem value="24">24 Stunden</SelectItem>
                    <SelectItem value="168">7 Tage</SelectItem>
                    <SelectItem value="all">Gesamte Zeit</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={showAddRoom} onOpenChange={setShowAddRoom}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-lg">{t("admin.management.addRoom")}</Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-xl">
                    <DialogHeader>
                      <DialogTitle>{t("admin.management.addRoom")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label>Zimmertyp</Label>
                        <Input placeholder="z.B. Deluxe Suite" className="rounded-lg" />
                      </div>
                      <div>
                        <Label>Preis pro Nacht (€)</Label>
                        <Input type="number" placeholder="150" className="rounded-lg" />
                      </div>
                      <Button className="w-full rounded-lg">Zimmer hinzufügen</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showAddHotel} onOpenChange={setShowAddHotel}>
                  <DialogTrigger asChild>
                    <Button className="rounded-lg">{t("admin.management.addHotel")}</Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-xl">
                    <DialogHeader>
                      <DialogTitle>{t("admin.management.addHotel")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label>Hotelname</Label>
                        <Input placeholder="z.B. Hotel Edelweiss" className="rounded-lg" />
                      </div>
                      <div>
                        <Label>Standort</Label>
                        <Input placeholder="z.B. Obertauern" className="rounded-lg" />
                      </div>
                      <div>
                        <Label>Sterne</Label>
                        <Input type="number" placeholder="4" min="1" max="5" className="rounded-lg" />
                      </div>
                      <Button className="w-full rounded-lg">Hotel hinzufügen</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {/* KPI Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 hover:shadow-lg transition-shadow rounded-xl">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Anfragen gesamt
              </h3>
              <div className="text-3xl font-bold mb-1">
                {loading ? "..." : analyticsData?.total_searches || 0}
              </div>
              <p className="text-xs text-muted-foreground">Zimmersuchen</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow rounded-xl">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Buchungen
              </h3>
              <div className="text-3xl font-bold mb-1">
                {loading ? "..." : analyticsData?.total_reservations || 0}
              </div>
              <p className="text-xs text-muted-foreground">Erfolgreich abgeschlossen</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow rounded-xl">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Conversion Rate
              </h3>
              <div className="text-3xl font-bold mb-1">
                {loading ? "..." : `${(analyticsData?.conversion_rate || 0).toFixed(1)}%`}
              </div>
              <p className="text-xs text-muted-foreground">Von Anfrage zu Buchung</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow rounded-xl">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("admin.kpi.revenue")}
              </h3>
              <div className="text-3xl font-bold mb-1">
                {loading ? "..." : `€${(analyticsData?.total_revenue || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
              <p className="text-xs text-muted-foreground">
                Ø €{(analyticsData?.average_booking_value || 0).toFixed(0)} pro Buchung
              </p>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-lg mb-4">{t("admin.monthlyBookings")}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyBookingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Bar dataKey="bookings" radius={[8, 8, 0, 0]}>
                    {monthlyBookingsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-lg mb-2">{t("admin.priceHeatmap")}</h3>
              <p className="text-xs text-muted-foreground mb-4">Durchschnittspreis pro Nacht (€) - Peak Season: Dez-Feb</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-xs font-medium p-1"></th>
                      {["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"].map(m => (
                        <th key={m} className="text-xs font-medium p-1">{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {priceHeatmap.map((row, i) => (
                      <tr key={i}>
                        <td className="text-xs font-medium p-1">{row.day}</td>
                        {["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "dez"].map(month => {
                          const price = row[month as keyof typeof row] as number;
                          return (
                            <td 
                              key={month} 
                              className="p-1"
                            >
                              <div
                                className="text-xs font-semibold text-white rounded p-2 text-center shadow-sm"
                                style={{ backgroundColor: getPriceColor(price) }}
                                title={`€${price}`}
                              >
                                {price}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <Card className="p-6 mb-8 rounded-xl shadow-md">
            <h3 className="font-bold text-lg mb-4">{t("admin.revenueChart")}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent Reservations Table */}
          <Card className="p-6 rounded-xl shadow-md">
            <h3 className="font-bold text-lg mb-4">Aktuelle Buchungen</h3>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Lade Daten...</div>
            ) : !analyticsData?.reservations?.length ? (
              <div className="text-center py-8 text-muted-foreground">
                Keine Buchungen in den letzten {timeRange} Stunden
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Buchungs-ID</TableHead>
                      <TableHead>Gast</TableHead>
                      <TableHead>Anreise</TableHead>
                      <TableHead>Abreise</TableHead>
                      <TableHead>Zimmertyp</TableHead>
                      <TableHead className="text-right">Betrag</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.reservations.slice(0, 10).map((reservation: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{reservation.reservation_id}</TableCell>
                        <TableCell>{reservation.guest?.given_name} {reservation.guest?.surname}</TableCell>
                        <TableCell>{new Date(reservation.arrival).toLocaleDateString('de-DE')}</TableCell>
                        <TableCell>{new Date(reservation.departure).toLocaleDateString('de-DE')}</TableCell>
                        <TableCell>{reservation.room_type_code}</TableCell>
                        <TableCell className="text-right font-semibold">
                          €{reservation.total_amount?.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>

          {/* Recent Searches */}
          <Card className="p-6 rounded-xl shadow-md mt-6">
            <h3 className="font-bold text-lg mb-4">Letzte Suchanfragen</h3>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Lade Daten...</div>
            ) : !analyticsData?.searches?.length ? (
              <div className="text-center py-8 text-muted-foreground">
                Keine Suchanfragen in den letzten {timeRange} Stunden
              </div>
            ) : (
              <div className="space-y-3">
                {analyticsData.searches.slice(0, 10).map((search: any, idx: number) => (
                  <div key={idx} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        {search.data?.adults} Erwachsene
                        {search.data?.children?.length > 0 && `, ${search.data.children.length} Kinder`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(search.data?.timespan?.from_date).toLocaleDateString('de-DE')} - {new Date(search.data?.timespan?.to_date).toLocaleDateString('de-DE')}
                        {" • "}{search.data?.duration} Nächte
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {search.results_count || 0} Ergebnisse
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Admin;
