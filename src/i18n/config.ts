import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  de: {
    translation: {
      nav: {
        chat: "Chat",
        hotel: "Hotel",
        admin: "Admin"
      },
      chat: {
        title: "looking.com",
        newChat: "Neuer Chat",
        searchChats: "Chats suchen",
        placeholder: "Nachricht eingeben...",
        lookingPreview: "Ich suche nach einem Hotelzimmer für 2 Personen in Obertauern vom 03.12.2025 bis zum 11.12.2025",
        bookingAssistant: "Buchungsassistent",
        modelSelection: "Modell auswählen",
        library: "Bibliothek",
        codex: "Codex",
        atlas: "Atlas",
        userProfile: "Profil",
        lookingNote: "Verwenden Sie den /looking Befehl für Hotelsuchen",
        example1: {
          title: "Hotelsuche in Obertauern starten",
          user: "Wie funktioniert die Hotelsuche mit /looking?",
          assistant: "Mit dem /looking Befehl können Sie ganz einfach Hotels in Obertauern finden!\n\nSo geht's:\n1. Tippen Sie /looking\n2. Geben Sie Ihre Wünsche ein\n\nBeispiel:\n/looking für ein Hotelzimmer in Obertauern für 2 Erwachsene vom 17.12.2025 bis 24.12.2025\n\nDer Assistent durchsucht automatisch alle verfügbaren Hotels und zeigt Ihnen die besten Optionen!"
        },
        example2: {
          title: "Beste Preise finden",
          user: "Wie finde ich die günstigsten Hotels in Obertauern?",
          assistant: "Mit /looking erhalten Sie automatisch einen Preisvergleich!\n\nDas System:\n• Vergleicht alle verfügbaren Hotels in Obertauern\n• Zeigt Ihnen Preise pro Nacht\n• Berücksichtigt Ihre Reisedaten\n• Findet die besten Angebote\n\nTipp: Probieren Sie verschiedene Daten aus, um noch bessere Preise zu finden!"
        },
        example3: {
          title: "Verfügbarkeit prüfen & buchen",
          user: "Wie buche ich ein Hotel in Obertauern?",
          assistant: "So buchen Sie ganz einfach:\n\n1. Suche starten:\n/looking Hotelzimmer in Obertauern für 2 Personen vom 17.12. bis 24.12.2025\n\n2. Angebote prüfen:\nDas System zeigt verfügbare Hotels mit Preisen\n\n3. Hotel auswählen:\nKlicken Sie auf Ihr Wunschhotel\n\n4. Buchung bestätigen:\nFüllen Sie Ihre Daten aus und schließen Sie die Buchung ab\n\nPerfekt für Ihren Skiurlaub in Obertauern!"
        }
      },
      booking: {
        confirmed: "Buchung bestätigt!",
        confirmText: "Ihre Buchung wurde erfolgreich abgeschlossen.",
        details: "Buchungsdetails",
        dates: "Reisedaten",
        guests: "Gäste",
        adults: "Erwachsene",
        nights: "Nächte",
        total: "Gesamtpreis",
        nextSteps: "Nächste Schritte",
        emailSent: "Bestätigungs-E-Mail wurde an Ihre E-Mail-Adresse gesendet",
        hotelContact: "Das Hotel wird Sie in Kürze kontaktieren",
        backToHotel: "Zurück zum Hotel",
        newSearch: "Neue Suche starten"
      },
      hotel: {
        name: "Hotel Edelweiss Obertauern",
        subtitle: "4 STERNE SUPERIOR SPORTHOTEL AUF 1750m",
        heroTitle: "4 STERNE SUPERIOR SPORTHOTEL",
        heroLocation: "in Obertauern",
        heroDetail1: "Direkt an der Skipiste • Ski-in/Ski-out",
        heroDetail2: "Wellness & Spa Bereich • 1.200m²",
        heroCta: "MEHR ERFAHREN",
        book: "JETZT BUCHEN",
        vouchers: "GUTSCHEINE",
        contactPhone: "+43 6456 7245",
        contactEmail: "HOTEL-EDELWEISS@LUERZER.AT",
        lang: "DE",
        chatTitle: "Buchungsassistent",
        chatWelcome: "Hallo! Wie kann ich Ihnen bei Ihrer Buchung helfen?",
        chatPlaceholder: "Nachricht eingeben...",
        chatNote: "Verwenden Sie /looking für Hotelsuchen",
        featuresTitle: "Unsere Leistungen",
        featuresWifi: "Kostenloses WLAN",
        featuresWifiDesc: "Highspeed-Internet",
        featuresSki: "Ski-in/Ski-out",
        featuresSkiDesc: "Direkter Pistenzugang",
        featuresRestaurant: "Restaurant",
        featuresRestaurantDesc: "Gehobene Küche",
        featuresParking: "Kostenlose Parkplätze",
        featuresParkingDesc: "Sichere Garage",
        aboutTitle: "Über uns",
        aboutText: "Das Hotel Edelweiss ist ein familiengeführtes 4-Sterne Superior Sporthotel auf 1750m Seehöhe, direkt an der Piste in Obertauern. Genießen Sie erstklassigen Service, moderne Zimmer und alpine Gastfreundschaft.",
        roomsTitle: "Zimmer & Suiten",
        roomsText: "Unsere komfortablen Zimmer bieten atemberaubende Bergblicke und moderne Ausstattung für einen unvergesslichen Aufenthalt.",
        roomDeluxe: "Deluxe Zimmer",
        roomDeluxeDesc: "Geräumiges Zimmer mit Bergblick und moderner Ausstattung",
        roomDetails: "Details ansehen",
        contactTitle: "Kontakt"
      },
      admin: {
        title: "Admin Dashboard",
        kpi: {
          roomsBooked: "Gebuchte Zimmer",
          revenue: "Umsatz",
          margin: "Marge",
          requests: "Anfragen (Voll)",
          roomsFull: "waren voll"
        },
        management: {
          addRoom: "Zimmer hinzufügen",
          addHotel: "Hotel hinzufügen"
        },
        monthlyBookings: "Monatliche Buchungen",
        bookingHistory: "Buchungsverlauf",
        bookingDate: "Buchungsdatum",
        guest: "Gast",
        roomType: "Zimmertyp",
        status: "Status",
        amount: "Betrag",
        confirmed: "Bestätigt",
        pending: "Ausstehend",
        cancelled: "Storniert",
        revenueChart: "Monatlicher Umsatzverlauf",
        priceHeatmap: "Preis-Heatmap"
      }
    }
  },
  en: {
    translation: {
      nav: {
        chat: "Chat",
        hotel: "Hotel",
        admin: "Admin"
      },
      chat: {
        title: "looking.com",
        newChat: "New Chat",
        searchChats: "Search chats",
        placeholder: "Type a message...",
        lookingPreview: "I am looking for a hotel room for 2 people in Obertauern from 03.12.2025 to 11.12.2025",
        bookingAssistant: "Booking Assistant",
        modelSelection: "Select model",
        library: "Library",
        codex: "Codex",
        atlas: "Atlas",
        userProfile: "Profile",
        lookingNote: "Use the /looking command for hotel searches",
        example1: {
          title: "Start Hotel Search in Obertauern",
          user: "How does hotel search with /looking work?",
          assistant: "With the /looking command you can easily find hotels in Obertauern!\n\nHere's how:\n1. Type /looking\n2. Enter your preferences\n\nExample:\n/looking for a hotel room in Obertauern for 2 adults from 17.12.2025 to 24.12.2025\n\nThe assistant automatically searches all available hotels and shows you the best options!"
        },
        example2: {
          title: "Find Best Prices",
          user: "How do I find the cheapest hotels in Obertauern?",
          assistant: "With /looking you automatically get a price comparison!\n\nThe system:\n• Compares all available hotels in Obertauern\n• Shows you prices per night\n• Considers your travel dates\n• Finds the best deals\n\nTip: Try different dates to find even better prices!"
        },
        example3: {
          title: "Check Availability & Book",
          user: "How do I book a hotel in Obertauern?",
          assistant: "Book easily:\n\n1. Start search:\n/looking hotel room in Obertauern for 2 people from Dec 17 to Dec 24, 2025\n\n2. Check offers:\nSystem shows available hotels with prices\n\n3. Select hotel:\nClick on your preferred hotel\n\n4. Confirm booking:\nFill in your details and complete the booking\n\nPerfect for your ski vacation in Obertauern!"
        }
      },
      booking: {
        confirmed: "Booking Confirmed!",
        confirmText: "Your booking has been successfully completed.",
        details: "Booking Details",
        dates: "Travel Dates",
        guests: "Guests",
        adults: "Adults",
        nights: "Nights",
        total: "Total Price",
        nextSteps: "Next Steps",
        emailSent: "Confirmation email has been sent to your email address",
        hotelContact: "The hotel will contact you shortly",
        backToHotel: "Back to Hotel",
        newSearch: "Start New Search"
      },
      hotel: {
        name: "Hotel Edelweiss Obertauern",
        subtitle: "4 STAR SUPERIOR SPORT HOTEL AT 1750m",
        heroTitle: "4 STAR SUPERIOR SPORT HOTEL",
        heroLocation: "in Obertauern",
        heroDetail1: "Directly on the ski slope • Ski-in/Ski-out",
        heroDetail2: "Wellness & Spa Area • 1,200m²",
        heroCta: "LEARN MORE",
        book: "BOOK NOW",
        vouchers: "VOUCHERS",
        contactPhone: "+43 6456 7245",
        contactEmail: "HOTEL-EDELWEISS@LUERZER.AT",
        lang: "EN",
        chatTitle: "Booking Assistant",
        chatWelcome: "Hello! How can I help you with your booking today?",
        chatPlaceholder: "Type a message...",
        chatNote: "Use /looking for hotel searches",
        featuresTitle: "Our Services",
        featuresWifi: "Free WiFi",
        featuresWifiDesc: "High-speed internet",
        featuresSki: "Ski-in/Ski-out",
        featuresSkiDesc: "Direct slope access",
        featuresRestaurant: "Restaurant",
        featuresRestaurantDesc: "Fine dining",
        featuresParking: "Free Parking",
        featuresParkingDesc: "Secure garage",
        aboutTitle: "About Us",
        aboutText: "Hotel Edelweiss is a family-run 4-star superior sport hotel at 1750m altitude, directly on the slopes in Obertauern. Enjoy first-class service, modern rooms, and alpine hospitality.",
        roomsTitle: "Rooms & Suites",
        roomsText: "Our comfortable rooms offer breathtaking mountain views and modern amenities for an unforgettable stay.",
        roomDeluxe: "Deluxe Room",
        roomDeluxeDesc: "Spacious room with mountain view and modern amenities",
        roomDetails: "View Details",
        contactTitle: "Contact"
      },
      admin: {
        title: "Admin Dashboard",
        kpi: {
          roomsBooked: "Rooms Booked",
          revenue: "Revenue",
          margin: "Margin",
          requests: "Requests (Full)",
          roomsFull: "were full"
        },
        management: {
          addRoom: "Add Room",
          addHotel: "Add Hotel"
        },
        monthlyBookings: "Monthly Bookings",
        bookingHistory: "Booking History",
        bookingDate: "Booking Date",
        guest: "Guest",
        roomType: "Room Type",
        status: "Status",
        amount: "Amount",
        confirmed: "Confirmed",
        pending: "Pending",
        cancelled: "Cancelled",
        revenueChart: "Monthly Revenue Overview",
        priceHeatmap: "Price Heatmap"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
