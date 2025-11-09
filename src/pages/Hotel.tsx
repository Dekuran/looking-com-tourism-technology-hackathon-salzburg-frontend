import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MessageSquare, Send, Wifi, Snowflake, Coffee, Car, Mail, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Hotel = () => {
  const { t } = useTranslation();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLookingPreview, setShowLookingPreview] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: "assistant", content: t("hotel.chatWelcome") }
  ]);

  useEffect(() => {
    // Show preview when typing any prefix of "/looking"
    const lookingCommand = "/looking";
    const shouldShow = chatInput.length > 0 && 
                       chatInput.startsWith("/") && 
                       lookingCommand.startsWith(chatInput.toLowerCase()) &&
                       chatInput.toLowerCase() !== lookingCommand;
    setShowLookingPreview(shouldShow);
  }, [chatInput]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    const newMessage = { role: "user" as const, content: chatInput };
    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    setChatInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages: updatedMessages, type: 'hotel' }
      });

      if (error) throw error;

      setChatMessages([...updatedMessages, { 
        role: "assistant" as const, 
        content: data.message 
      }]);
    } catch (error) {
      console.error('Hotel chat error:', error);
      setChatMessages([...updatedMessages, { 
        role: "assistant" as const, 
        content: t("hotel.chatWelcome")
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-14">
        {/* Hero Section with Video Background */}
        <div className="relative h-screen overflow-hidden">
          <div className="absolute inset-0 z-0">
            <iframe
              src="https://www.youtube.com/embed/4nQqFV2rjPU?autoplay=1&mute=1&loop=1&playlist=4nQqFV2rjPU&controls=0&showinfo=0&modestbranding=1"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-[1.3]"
              allow="autoplay; encrypted-media"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Top Bar - Over Video */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm py-3">
            <div className="container mx-auto px-6 flex items-center justify-end gap-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-lg">
                {t("hotel.vouchers")}
              </Button>
              <div className="flex items-center gap-2 text-sm text-white">
                <Phone className="h-4 w-4 text-white" />
                <span>{t("hotel.contactPhone")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white">
                <Mail className="h-4 w-4 text-white" />
                <span>{t("hotel.contactEmail")}</span>
              </div>
              <Button 
                size="sm"
                className="bg-secondary hover:bg-secondary/90 text-white rounded-lg px-6 shadow-sm"
              >
                {t("hotel.book")}
              </Button>
            </div>
          </div>

          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl text-white">
                <h1 className="text-6xl font-bold mb-6 leading-tight tracking-tight">
                  <span className="text-secondary">4 STERNE</span><br />
                  <span className="text-secondary">SUPERIOR</span><br />
                  <span className="text-secondary">SPORTHOTEL</span>
                </h1>
                <p className="text-4xl mb-4 font-medium">
                  {t("hotel.heroLocation")}
                </p>
                
                {/* Hotel Details */}
                <div className="mb-8 space-y-3 text-xl text-white/90">
                  <p className="flex items-center gap-3">
                    <span className="text-secondary">✓</span>
                    {t("hotel.heroDetail1")}
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-secondary">✓</span>
                    {t("hotel.heroDetail2")}
                  </p>
                </div>

                <Button 
                  size="lg" 
                  className="bg-secondary hover:bg-secondary/90 text-white text-lg px-8 py-6 rounded-lg shadow-lg"
                >
                  {t("hotel.heroCta")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold mb-12 text-center">{t("hotel.featuresTitle")}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Wifi, title: t("hotel.featuresWifi"), desc: t("hotel.featuresWifiDesc") },
              { icon: Snowflake, title: t("hotel.featuresSki"), desc: t("hotel.featuresSkiDesc") },
              { icon: Coffee, title: t("hotel.featuresRestaurant"), desc: t("hotel.featuresRestaurantDesc") },
              { icon: Car, title: t("hotel.featuresParking"), desc: t("hotel.featuresParkingDesc") }
            ].map((feature, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow rounded-xl">
                <feature.icon className="h-10 w-10 text-secondary mb-4" />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="bg-muted/30 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">{t("hotel.aboutTitle")}</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("hotel.aboutText")}
              </p>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="container mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold mb-6">{t("hotel.roomsTitle")}</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl">
            {t("hotel.roomsText")}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow rounded-xl">
                <div className="h-64 bg-muted" />
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{t("hotel.roomDeluxe")}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("hotel.roomDeluxeDesc")}
                  </p>
                  <Button variant="outline" className="w-full rounded-lg">{t("hotel.roomDetails")}</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-muted/30 py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">{t("hotel.contactTitle")}</h2>
            <div className="flex flex-col gap-4 items-center">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-secondary" />
                <span className="text-lg">{t("hotel.contactPhone")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-secondary" />
                <span className="text-lg">{t("hotel.contactEmail")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      {!chatOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setChatOpen(true)}
            size="icon"
            className="relative h-20 w-20 rounded-full shadow-2xl bg-secondary hover:bg-secondary/90"
          >
            <MessageSquare className="h-9 w-9" />
            <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse shadow-lg">
              1
            </span>
          </Button>
        </div>
      )}

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0 rounded-xl">
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-secondary/10 to-secondary/5">
            <h3 className="font-semibold text-secondary">{t("hotel.chatTitle")}</h3>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-secondary/5 to-background">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl p-3 max-w-[80%] shadow-sm ${
                    msg.role === "user"
                      ? "bg-secondary/90 text-white"
                      : "bg-background border border-border"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground/70 text-center py-2 px-4 bg-secondary/10 rounded-lg mx-auto max-w-fit border border-secondary/20">
              💡 {t("hotel.chatNote")}
            </div>
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary/20 rounded-2xl px-4 py-3 border border-secondary/30">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-secondary/20 bg-gradient-to-r from-secondary/5 to-background">
            <div className="relative">
              {showLookingPreview && (
                <button
                  onClick={() => setChatInput("/looking ")}
                  className="absolute bottom-full mb-3 left-0 right-0 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-xl p-3 border border-secondary/20 shadow-md hover:from-secondary/15 hover:to-secondary/10 transition-all cursor-pointer text-left w-full"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="text-sm font-medium text-secondary">
                      /looking
                    </span>
                    <span className="text-sm text-muted-foreground/60 opacity-70">
                      {t("chat.lookingPreview")}
                    </span>
                  </div>
                </button>
              )}
              {!chatInput && (
                <button
                  onClick={() => setChatInput("/looking ")}
                  className="absolute bottom-full mb-3 left-0 right-0 bg-gradient-to-r from-secondary/5 to-background rounded-xl p-3 border border-secondary/10 hover:from-secondary/10 hover:to-secondary/5 transition-all cursor-pointer text-left w-full"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary/50" />
                    <span className="text-sm font-medium text-secondary/70">
                      /looking
                    </span>
                    <span className="text-sm text-muted-foreground/50 opacity-70">
                      {i18n.language === 'de' 
                        ? 'für ein Hotelzimmer in Obertauern für 2 Erwachsene zwischen dem 17.12.2025 und 24.12.2025...'
                        : 'for a hotel room in Obertauern for 2 adults from 17.12.2025 to 24.12.2025...'}
                    </span>
                  </div>
                </button>
              )}
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={t("hotel.chatPlaceholder")}
                  className="flex-1 rounded-lg border-secondary/30 focus-visible:ring-secondary/50"
                  disabled={isLoading}
                />
                <Button size="icon" onClick={handleSendMessage} className="rounded-lg shadow-sm bg-secondary hover:bg-secondary/90" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Hotel;
