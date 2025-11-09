import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Calendar, Users, BedDouble, Mail, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

const BookingConfirm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Mock booking data
  const booking = {
    hotel: "Hotel Edelweiss Obertauern",
    room: "Deluxe Zimmer mit Bergblick",
    checkIn: "17.12.2025",
    checkOut: "24.12.2025",
    guests: 2,
    nights: 7,
    pricePerNight: 180,
    total: 1260
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-12 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold mb-2">{t("booking.confirmed")}</h1>
            <p className="text-muted-foreground">{t("booking.confirmText")}</p>
          </div>

          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">{t("booking.details")}</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <BedDouble className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{booking.hotel}</p>
                  <p className="text-sm text-muted-foreground">{booking.room}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{t("booking.dates")}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.checkIn} - {booking.checkOut} ({booking.nights} {t("booking.nights")})
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{t("booking.guests")}</p>
                  <p className="text-sm text-muted-foreground">{booking.guests} {t("booking.adults")}</p>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">{booking.nights} {t("booking.nights")} × €{booking.pricePerNight}</span>
                  <span>€{booking.nights * booking.pricePerNight}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>{t("booking.total")}</span>
                  <span>€{booking.total}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h3 className="font-semibold mb-3">{t("booking.nextSteps")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{t("booking.emailSent")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{t("booking.hotelContact")}</span>
              </li>
            </ul>
          </Card>

          <div className="flex gap-4">
            <Button onClick={() => navigate("/hotel")} variant="outline" className="flex-1">
              {t("booking.backToHotel")}
            </Button>
            <Button onClick={() => navigate("/")} className="flex-1">
              {t("booking.newSearch")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirm;
