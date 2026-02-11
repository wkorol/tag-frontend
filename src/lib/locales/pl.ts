const pl = {
  "common": {
    "whatsapp": "WhatsApp",
    "bookViaWhatsapp": "Zamów przez WhatsApp",
    "progress": "Postęp",
    "stepCounter": (current: number, total: number) => `Krok ${current}/${total}`,
    "remainingFields": (count: number) => {
      if (count === 1) return "Pozostało jeszcze 1 pole do wypełnienia";
      const mod10 = count % 10;
      const mod100 = count % 100;
      const isFew = mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14);
      return `Pozostało jeszcze ${count} ${isFew ? "pola" : "pól"} do wypełnienia`;
    },
    "orderOnlineNow": "Złóż zamówienie online",
    "orderNow": "Rezerwuj",
    "continue": "Dalej",
    "back": "Wstecz",
    "optional": "opcjonalnie",
    "close": "Zamknij",
    "noPrepayment": "Bez przedpłaty",
    "backToHome": "← Wróć na stronę główną",
    "notFoundTitle": "Nie znaleziono strony",
    "notFoundBody": "Szukana strona nie istnieje lub została przeniesiona.",
    "notFoundCta": "Przejdź na stronę główną",
    "notFoundSupport": "Jeśli to błąd, skontaktuj się z nami:",
    "notFoundRequested": "Żądany adres URL",
    "notFoundPopular": "Popularne strony",
    "actualBadge": "AKTUALNY",
    "priceFrom": "od",
    "perNight": "nocą",
    "perDay": "do centrum (dzień)",
    "whatsappMessage": "Dzień dobry Taxi Airport Gdańsk, chcę zarezerwować transfer."
  },
  "navbar": {
    "home": "Start",
    "fleet": "Nasza flota",
    "airportTaxi": "Taxi Lotnisko Gdańsk",
    "airportSopot": "Lotnisko ↔ Sopot",
    "airportGdynia": "Lotnisko ↔ Gdynia",
    "prices": "Cennik",
    "orderNow": "REZERWUJ",
    "language": "Język"
  },
  "hero": {
    "promo": {
      "dayPrice": "TYLKO 100 PLN",
      "dayLabel": "do centrum (dzień)",
      "nightPrice": "120 PLN",
      "nightLabel": "nocą"
    },
    "logoAlt": "Taxi Airport Gdańsk - Transfer lotniskowy i limuzyny",
    "orderViaEmail": "Zamów przez e-mail",
    "headline": "Taxi Gdańsk Lotnisko – transfery dla Gdańska, Sopotu i Gdyni",
    "subheadline": "Taxi Gdańsk / taxi gdansk: stałe ceny, 24/7 i szybkie potwierdzenie.",
    "whyChoose": "Dlaczego Taxi Airport Gdańsk",
    "benefits": "Korzyści",
    "benefitsList": {
      "flightTrackingTitle": "Śledzenie lotu",
      "flightTrackingBody": "Monitorujemy przyloty i automatycznie dostosowujemy czas odbioru.",
      "meetGreetTitle": "Powitanie na lotnisku",
      "meetGreetBody": "Profesjonalni kierowcy, jasna komunikacja i pomoc z bagażem.",
      "fastConfirmationTitle": "Szybkie potwierdzenie",
      "fastConfirmationBody": "Większość rezerwacji potwierdzamy w 5–10 minut.",
      "flexiblePaymentsTitle": "Elastyczne płatności",
      "flexiblePaymentsBody": "Karta, Apple Pay, Google Pay, Revolut lub gotówka.",
      "freePrebookingTitle": "Darmowa rezerwacja z wyprzedzeniem",
      "freePrebookingBody": "Anuluj w dowolnym momencie bez opłat. W pełni automatycznie.",
      "fixedPriceTitle": "Gwarancja stałej ceny",
      "fixedPriceBody": "Stała cena w obie strony. Cena z rezerwacji to cena zapłaty.",
      "localExpertiseTitle": "Lokalne doświadczenie",
      "localExpertiseBody": "Doświadczeni kierowcy z Trójmiasta znający najszybsze trasy.",
      "assistanceTitle": "Wsparcie 24/7",
      "assistanceBody": "Dostępni przed, w trakcie i po przejeździe."
    },
    "fleetTitle": "Nasza flota",
    "fleetLabel": "Pojazdy",
    "standardCarsTitle": "Samochody standard",
    "standardCarsBody": "1–4 pasażerów | Komfortowe sedany i SUV-y",
    "busTitle": "Usługa BUS",
    "busBody": "5–8 pasażerów | Idealne dla większych grup"
  },
  "vehicle": {
    "title": "Wybierz pojazd",
    "subtitle": "Wybierz pojazd najlepiej dopasowany do liczby osób",
    "standardTitle": "Samochód standard",
    "standardPassengers": "1–4 pasażerów",
    "standardDescription": "Idealny dla singli, par i małych rodzin",
    "busTitle": "Usługa BUS",
    "busPassengers": "5–8 pasażerów",
    "busDescription": "Idealny dla większych grup i rodzin z większym bagażem",
    "selfManageBadge": "Edytuj i anuluj zamówienie samodzielnie",
    "examplePrices": "Przykładowe ceny:",
    "airportGdansk": "Lotnisko ↔ Gdańsk",
    "airportSopot": "Lotnisko ↔ Sopot",
    "airportGdynia": "Lotnisko ↔ Gdynia",
    "selectStandard": "Wybierz standard",
    "selectBus": "Wybierz BUS"
  },
  "pricing": {
    "back": "Wróć do wyboru pojazdu",
    "titleStandard": "Samochód standard (1–4 pasażerów)",
    "titleBus": "BUS (5–8 pasażerów)",
    "description": "Stałe ceny w obie strony (na i z lotniska). Bez ukrytych opłat. Taryfa nocna obowiązuje od 22:00 do 6:00 oraz w niedziele i święta.",
    "directionFromAirport": "Z lotniska",
    "directionToAirport": "Na lotnisko",
    "dayRate": "Taryfa dzienna",
    "nightRate": "Taryfa nocna",
    "sundayNote": "(niedziele i święta)",
    "customRouteTitle": "Trasa niestandardowa",
    "customRouteBody": "Inny cel podróży?",
    "customRoutePrice": "Ceny ustalone",
    "customRoutePriceBody": "Elastyczna wycena na podstawie Twojej trasy",
    "customRouteAutoNote": "Kalkulator automatycznie wyliczy stawkę po podaniu adresu.",
    "requestQuote": "Rezerwuj",
    "pricesNote": "Ceny zawierają VAT. Dodatkowe destynacje dostępne na zapytanie.",
    "tableTitle": "Tabela cen",
    "tableRoute": "Trasa",
    "tableStandardDay": "Standard dzienna",
    "tableStandardNight": "Standard nocna",
    "tableBusDay": "Bus dzienna",
    "tableBusNight": "Bus nocna",
    "tariffsTitle": "Wycena tras niestandardowych",
    "tariffsName": "Taryfa",
    "tariffsRate": "Stawka",
    "bookingTitle": "Zarezerwuj przejazd",
    "bookingSubtitle": "Wybierz typ pojazdu i zarezerwuj przejazd od razu.",
    "routes": {
      "airport": "Lotnisko",
      "gdansk": "Centrum Gdańska",
      "gdynia": "Centrum Gdyni"
    }
  },
  "pricingLanding": {
    "title": "Cennik Taxi Lotnisko Gdańsk",
    "subtitle": "Stałe ceny transferów lotniskowych oraz przejrzysta wycena tras niestandardowych.",
    "description": "Porównaj ceny standard i bus, a potem zarezerwuj od razu lub poproś o wycenę.",
    "cta": "Zarezerwuj przejazd",
    "calculatorCta": "Kalkulator",
    "highlights": [
      {
        "title": "Stałe ceny w obie strony",
        "body": "Podane trasy lotniskowe mają z góry ustaloną cenę bez ukrytych opłat."
      },
      {
        "title": "Dostępność 24/7",
        "body": "Pracujemy codziennie, szybkie potwierdzenie i wsparcie."
      },
      {
        "title": "Busy dla grup",
        "body": "Pojazdy 5–8 miejsc dla rodzin i większych ekip."
      }
    ],
    "faqTitle": "FAQ cennika",
    "faq": [
      {
        "question": "Czy te ceny są stałe?",
        "answer": "Tak. Trasy lotniskowe mają stałe ceny w obie strony. Trasy niestandardowe są wyceniane indywidualnie."
      },
      {
        "question": "Kiedy obowiązuje taryfa nocna?",
        "answer": "Od 22:00 do 6:00 oraz w niedziele i święta."
      },
      {
        "question": "Czy monitorujecie opóźnienia lotów?",
        "answer": "Tak, śledzimy przyloty i dostosowujemy czas odbioru."
      },
      {
        "question": "Czy można zapłacić kartą?",
        "answer": "Tak, płatność kartą na życzenie. Faktury dla firm."
      }
    ]
  },
  "pricingCalculator": {
    "title": "Kalkulator ceny",
    "subtitle": "Podaj miejsce odbioru i cel, aby zobaczyć szacunkową cenę.",
    "airportLabel": "Lotnisko Gdańsk",
    "airportAddress": "Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk",
    "pickupCustomLabel": "Odbiór z adresu",
    "destinationCustomLabel": "Adres docelowy",
    "pickupLabel": "Miejsce odbioru",
    "pickupPlaceholder": "np. Gdańsk Airport, Słowackiego 200",
    "destinationLabel": "Miejsce docelowe",
    "destinationPlaceholder": "np. Sopot, Monte Cassino 1",
    "distanceLabel": "Dystans",
    "resultsTitle": "Szacunkowa cena",
    "fixedAllDay": "Taryfa całodobowa",
    "dayRate": "Taryfa dzienna",
    "nightRate": "Taryfa nocna",
    "dayRateLabel": "Stawka dzienna",
    "allDayRateLabel": "Całodobowa stawka",
    "guaranteedPriceLabel": "Gwarantowana cena",
    "standard": "Standard",
    "bus": "Bus",
    "loading": "Obliczamy trasę...",
    "noResult": "Nie udało się wycenić trasy. Spróbuj dokładniejszego adresu.",
    "longRouteTitle": "Wycena długiej trasy",
    "taximeterLabel": "Taksometr",
    "proposedLabel": "Sugerowana cena",
    "savingsLabel": "Oszczędzasz",
    "orderNow": "Zamów teraz",
    "note": "Ceny są stałe, możesz zaproponować inną cenę w formularzu do zamawiania innej trasy."
  },
  "trust": {
    "companyTitle": "Dane firmy",
    "paymentTitle": "Płatność i faktury",
    "comfortTitle": "Komfort i bezpieczeństwo",
    "paymentBody": "Płatność gotówką lub kartą. Faktury VAT dla firm.",
    "comfortBody": "Foteliki dziecięce na życzenie. Profesjonalni, licencjonowani kierowcy i pomoc door-to-door."
  },
  "trustBar": {
    "ariaLabel": "Informacje zaufania",
    "instantConfirmation": "Szybkie potwierdzenie",
    "meetGreetOptional": "Powitanie na lotnisku opcjonalnie",
    "noPrepayment": "Bez przedpłaty",
    "supportWhatsappEmail": "Wsparcie: WhatsApp i e-mail",
    "vatInvoice": "Faktura VAT"
  },
  "footer": {
    "description": "Profesjonalny transfer lotniskowy w Trójmieście. Dostępny 24/7.",
    "contactTitle": "Kontakt",
    "location": "Gdańsk, Polska",
    "bookingNote": "Rezerwacja online, przez WhatsApp lub e-mail",
    "hoursTitle": "Godziny pracy",
    "hoursBody": "24/7 - Dostępne każdego dnia",
    "hoursSub": "Odbiory z lotniska, transfery miejskie i trasy niestandardowe",
    "routesTitle": "Popularne trasy",
    "rights": "Wszelkie prawa zastrzeżone.",
    "cookiePolicy": "Polityka cookies",
    "privacyPolicy": "Polityka prywatności"
  },
  "cookieBanner": {
    "title": "Ustawienia cookies",
    "body": "Używamy niezbędnych cookies, aby zapewnić bezpieczny i niezawodny proces rezerwacji. Za Twoją zgodą używamy także cookies marketingowych do mierzenia konwersji reklam i poprawy komunikacji ofert. W każdej chwili możesz zmienić wybór, czyszcząc dane przeglądarki.",
    "readPolicy": "Przeczytaj politykę",
    "decline": "Odrzuć",
    "accept": "Akceptuj cookies"
  },
  "cookiePolicy": {
    "title": "Polityka cookies",
    "updated": "Ostatnia aktualizacja: 2 stycznia 2026",
    "intro": "Ta strona używa cookies, aby działała niezawodnie i aby Twoja rezerwacja była bezpieczna. Za Twoją zgodą używamy także cookies marketingowych do mierzenia konwersji reklam.",
    "sectionCookies": "Jakich cookies używamy",
    "cookiesList": [
      "Niezbędne cookies do zapewnienia bezpieczeństwa i zapobiegania nadużyciom.",
      "Cookies preferencji do zapamiętania podstawowych wyborów w trakcie sesji.",
      "Cookies marketingowe do mierzenia konwersji z reklam (Google Ads)."
    ],
    "sectionManage": "Jak możesz zarządzać cookies",
    "manageBody1": "Możesz usunąć cookies w każdej chwili w ustawieniach przeglądarki. Zablokowanie niezbędnych cookies może uniemożliwić działanie formularza rezerwacji i panelu zamówień.",
    "manageBody2": "Możesz też zmienić zgodę marketingową, czyszcząc dane przeglądarki i ponownie odwiedzając stronę.",
    "contact": "Kontakt",
    "contactBody": "Jeśli masz pytania dotyczące tej polityki, napisz do nas na"
  },
  "privacyPolicy": {
    "title": "Polityka prywatności",
    "updated": "Ostatnia aktualizacja: 2 stycznia 2026",
    "intro": "Niniejsza Polityka prywatności wyjaśnia, jak Taxi Airport Gdańsk zbiera i przetwarza dane osobowe podczas korzystania z naszych usług i strony.",
    "controllerTitle": "Administrator danych",
    "controllerBody": "Taxi Airport Gdańsk\nGdańsk, Polska\nEmail:",
    "dataTitle": "Jakie dane zbieramy",
    "dataList": [
      "Dane kontaktowe, takie jak imię, adres e-mail i numer telefonu.",
      "Dane rezerwacji, takie jak miejsce odbioru, data, godzina, numer lotu i uwagi.",
      "Dane techniczne, takie jak adres IP i podstawowe informacje o przeglądarce w celach bezpieczeństwa."
    ],
    "whyTitle": "Dlaczego przetwarzamy Twoje dane",
    "whyList": [
      "Aby odpowiedzieć na zapytanie i zrealizować usługę.",
      "Aby komunikować się w sprawie rezerwacji, zmian lub anulowania.",
      "Aby wypełnić obowiązki prawne i zapobiegać nadużyciom."
    ],
    "legalTitle": "Podstawa prawna",
    "legalList": [
      "Wykonanie umowy (art. 6 ust. 1 lit. b RODO).",
      "Obowiązek prawny (art. 6 ust. 1 lit. c RODO).",
      "Uzasadniony interes (art. 6 ust. 1 lit. f RODO), np. bezpieczeństwo i zapobieganie nadużyciom."
    ],
    "storageTitle": "Jak długo przechowujemy dane",
    "storageBody": "Przechowujemy dane rezerwacji tak długo, jak jest to konieczne do realizacji usługi oraz spełnienia wymogów prawnych lub księgowych.",
    "shareTitle": "Komu udostępniamy dane",
    "shareBody": "Udostępniamy dane tylko podmiotom niezbędnym do realizacji usługi (np. dostawcom e-mail). Nie sprzedajemy danych osobowych.",
    "rightsTitle": "Twoje prawa",
    "rightsList": [
      "Dostęp, sprostowanie lub usunięcie danych osobowych.",
      "Ograniczenie przetwarzania lub sprzeciw.",
      "Przenoszenie danych, jeśli ma zastosowanie.",
      "Prawo do złożenia skargi do organu nadzorczego."
    ],
    "contactTitle": "Kontakt",
    "contactBody": "W sprawach prywatności skontaktuj się z nami pod adresem"
  },
  "routeLanding": {
    "orderNow": "Rezerwuj online teraz",
    "quickLinks": "Szybkie linki",
    "pricingLink": "Zobacz cennik",
    "orderLinks": {
      "airportGdansk": "Rezerwacja lotnisko → Gdańsk",
      "airportSopot": "Rezerwacja lotnisko → Sopot",
      "airportGdynia": "Rezerwacja lotnisko → Gdynia",
      "custom": "Trasa niestandardowa"
    },
    "pricingTitle": "Przykładowe ceny",
    "vehicleLabel": "Samochód standard",
    "dayLabel": "Taryfa dzienna",
    "nightLabel": "Taryfa nocna",
    "currency": "PLN",
    "pricingNote": "Ceny zawierają VAT. Taryfa nocna obowiązuje od 22:00 do 6:00 oraz w niedziele i święta.",
    "includedTitle": "Co obejmuje usługa",
    "includedList": [
      "Powitanie na lotnisku i jasne instrukcje odbioru.",
      "Śledzenie lotu i elastyczny czas odbioru.",
      "Stałe ceny w obie strony bez ukrytych opłat.",
      "Profesjonalni kierowcy mówiący po angielsku."
    ],
    "destinationsTitle": "Popularne kierunki",
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Jak szybko dostanę potwierdzenie?",
        "answer": "Większość rezerwacji potwierdzamy e-mailem w 5–10 minut."
      },
      {
        "question": "Czy śledzicie loty?",
        "answer": "Tak, monitorujemy przyloty i dostosowujemy czas odbioru."
      },
      {
        "question": "Czy mogę anulować?",
        "answer": "Możesz anulować korzystając z linku w e-mailu potwierdzającym."
      },
      {
        "question": "Czy oferujecie foteliki dziecięce?",
        "answer": "Tak, foteliki dziecięce są dostępne na życzenie podczas rezerwacji."
      },
      {
        "question": "Jak mogę zapłacić?",
        "answer": "Możesz zapłacić kartą, Apple Pay, Google Pay, Revolut lub gotówką na życzenie."
      },
      {
        "question": "Gdzie spotkam kierowcę?",
        "answer": "Otrzymasz jasne instrukcje odbioru i kontakt do kierowcy w e-mailu potwierdzającym."
      }
    ]
  },
  "countryLanding": {
    "title": "Transfer lotniskowy Gdańsk dla podróżnych z zagranicy",
    "description": "Prywatny transfer z lotniska Gdańsk ze stałymi cenami, odbiór 24/7 i szybkie potwierdzenie.",
    "intro": "Idealne rozwiązanie dla osób przylatujących do Gdańska (GDN). Rezerwuj online w kilka minut.",
    "ctaPrimary": "Zarezerwuj transfer",
    "ctaSecondary": "Zobacz ceny",
    "highlightsTitle": "Dlaczego warto z nami",
    "highlights": [
      "Stałe ceny bez ukrytych opłat.",
      "Meet & greet i jasne instrukcje odbioru.",
      "Śledzenie lotów i elastyczny czas odbioru.",
      "Płatność kartą, Apple Pay, Google Pay, Revolut lub gotówką na życzenie."
    ],
    "airportsTitle": "Popularne lotniska w Europie",
    "airports": [
      "Londyn Stansted (STN)",
      "Frankfurt (FRA)",
      "Oslo Gardermoen (OSL)",
      "Sztokholm Arlanda (ARN)",
      "Kopenhaga (CPH)",
      "Helsinki (HEL)"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "W jakiej walucie płacę?",
        "answer": "Ceny są w PLN. Płatność kartą zostanie automatycznie przeliczona przez bank."
      },
      {
        "question": "Czy wystawiacie paragon lub fakturę?",
        "answer": "Tak, wpisz to w uwagach do rezerwacji — wyślemy dokument e-mailem."
      },
      {
        "question": "Czy śledzicie loty?",
        "answer": "Tak, monitorujemy przyloty i dostosowujemy czas odbioru."
      },
      {
        "question": "Jak szybko dostanę potwierdzenie?",
        "answer": "Zwykle w 5–10 minut e-mailem."
      }
    ]
  },
  "airportLanding": {
    "ctaPrimary": "Zarezerwuj transfer",
    "ctaSecondary": "Zobacz ceny",
    "highlightsTitle": "Dlaczego warto zarezerwować wcześniej",
    "highlights": [
      "Meet & greet i jasne instrukcje odbioru.",
      "Śledzenie lotów i elastyczny czas odbioru.",
      "Stałe ceny bez ukrytych opłat.",
      "Płatność kartą, Apple Pay, Google Pay, Revolut lub gotówką na życzenie."
    ],
    "destinationsTitle": "Popularne kierunki w Trójmieście",
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Czy są loty bezpośrednie z {city} do Gdańska?",
        "answer": "Loty bezpośrednie są sezonowe. Sprawdź aktualny rozkład przed podróżą."
      },
      {
        "question": "Jak spotkam kierowcę?",
        "answer": "Otrzymasz instrukcje odbioru i kontakt do kierowcy w e-mailu potwierdzającym."
      },
      {
        "question": "Czy śledzicie loty?",
        "answer": "Tak, monitorujemy przyloty i dostosowujemy czas odbioru."
      },
      {
        "question": "Czy mogę zapłacić kartą?",
        "answer": "Tak, płatność kartą jest akceptowana. Gotówka na życzenie."
      }
    ]
  },
  "cityTaxi": {
    "title": "Taxi Gdańsk",
    "subtitle": "Stałe ceny i dostępność 24/7.",
    "intro": "Taxi Gdańsk na transfery lotniskowe i przejazdy miejskie. Profesjonalni kierowcy, szybkie potwierdzenie i przejrzyste ceny.",
    "ctaPrimary": "Zarezerwuj taxi",
    "ctaSecondary": "Zobacz ceny",
    "highlightsTitle": "Dlaczego warto jechać z nami",
    "highlights": [
      "Stałe ceny bez ukrytych opłat.",
      "Dostępność 24/7 na lotnisko i miasto.",
      "Śledzenie lotów i elastyczny czas odbioru.",
      "Płatność kartą, Apple Pay, Google Pay, Revolut lub gotówką na życzenie."
    ],
    "serviceAreaTitle": "Obsługiwane obszary",
    "serviceArea": [
      "Gdańsk Stare Miasto i Centrum",
      "Gdańsk Wrzeszcz i Oliwa",
      "Lotnisko Gdańsk (GDN)",
      "Sopot i Gdynia"
    ],
    "routesTitle": "Popularne trasy taxi",
    "routes": [
      "Lotnisko Gdańsk → Stare Miasto",
      "Lotnisko Gdańsk → Sopot",
      "Lotnisko Gdańsk → Gdynia",
      "Stare Miasto → Lotnisko Gdańsk"
    ],
    "cityRoutesTitle": "Ceny taxi z lotniska Gdańsk",
    "cityRoutesDescription": "Sprawdź cenę przejazdu z lotniska Gdańsk do wybranych miast.",
    "cityRoutesItem": (destination: string) => `Lotnisko Gdańsk → ${destination}`,
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Jak szybko dostanę potwierdzenie?",
        "answer": "Większość rezerwacji potwierdzamy w 5–10 minut e-mailem."
      },
      {
        "question": "Czy ceny są stałe?",
        "answer": "Tak, trasy lotniskowe mają stałe ceny w obie strony."
      },
      {
        "question": "Czy mogę zapłacić kartą?",
        "answer": "Tak, płatność kartą jest akceptowana. Gotówka na życzenie."
      },
      {
        "question": "Czy śledzicie loty?",
        "answer": "Tak, monitorujemy przyloty i dostosowujemy czas odbioru."
      }
    ]
  },
  "orderForm": {
    "validation": {
      "phoneLetters": "Wpisz poprawny numer telefonu (tylko cyfry).",
      "phoneLength": "Wpisz poprawny numer telefonu (7–15 cyfr, opcjonalnie +).",
      "emailRequired": "Podaj adres e-mail.",
      "email": "Wpisz poprawny adres e-mail.",
      "datePast": "Wybierz dzisiejszą lub przyszłą datę.",
      "timePast": "Wybierz obecną lub przyszłą godzinę.",
      "timeSoon": "Wybierz godzinę co najmniej 40 minut od teraz."
    },
    "rate": {
      "day": "Taryfa dzienna",
      "night": "Taryfa nocna",
      "reasonDay": "standardowa taryfa dzienna",
      "reasonLate": "odbiór po 21:30 lub przed 5:30",
      "reasonHoliday": "niedziela/święto",
      "banner": (label: string, price: number, reason: string) => `${label}: ${price} PLN (${reason})`
    },
    "submitError": "Nie udało się wysłać zamówienia. Spróbuj ponownie.",
    "submitNetworkError": "Błąd sieci podczas wysyłania zamówienia. Spróbuj ponownie.",
    "submittedTitle": "Zamówienie przyjęte",
    "submittedBody": "Dziękujemy! Twoje zgłoszenie jest w kolejce. Zaczekaj na akceptację – zwykle trwa to 5–10 minut. Wkrótce otrzymasz e-mail z potwierdzeniem.",
    "awaiting": "Oczekiwanie na potwierdzenie...",
    "totalPrice": "Cena całkowita:",
    "orderNumber": "Nr zamówienia:",
    "orderId": "ID zamówienia:",
    "manageLink": "Zarządzaj lub edytuj zamówienie",
    "title": "Zamów transfer",
    "date": "Data",
    "pickupTime": "Godzina odbioru",
    "pickupType": "Miejsce odbioru",
    "pickupTypeHint": "Wybierz typ odbioru, aby kontynuować.",
    "airportPickup": "Odbiór z lotniska",
    "addressPickup": "Odbiór z adresu",
    "signServiceTitle": "Odbiór na lotnisku",
    "signServiceSign": "Odbiór z kartką",
    "signServiceFee": "+20 PLN doliczone do ceny końcowej",
    "signServiceSelf": "Znajdę kierowcę samodzielnie na parkingu",
    "signServiceSelfNote": "Kierowca skontaktuje się z Tobą na WhatsAppie lub telefonicznie i znajdziecie się.",
    "signText": "Tekst na tabliczce",
    "signPlaceholder": "Tekst na tabliczce powitalnej",
    "signHelp": "Kierowca będzie czekał z tabliczką z tym tekstem do momentu wyjścia z hali przylotów",
    "signPreview": "Podgląd tabliczki:",
    "signEmpty": "Tutaj pojawi się Twoje imię",
    "flightNumber": "Numer lotu",
    "flightPlaceholder": "np. LO123",
    "flightUnknown": "Nie znam jeszcze numeru lotu",
    "pickupAddress": "Adres odbioru",
    "pickupPlaceholder": "Wpisz pełny adres odbioru",
    "passengers": "Liczba pasażerów",
    "passengersBus": [
      "5 osób",
      "6 osób",
      "7 osób",
      "8 osób"
    ],
    "passengersStandard": [
      "1 osoba",
      "2 osoby",
      "3 osoby",
      "4 osoby"
    ],
    "largeLuggage": "Duży bagaż",
    "luggageNo": "Nie",
    "luggageYes": "Tak",
    "contactTitle": "Dane kontaktowe",
    "fullName": "Imię i nazwisko",
    "namePlaceholder": "Twoje imię i nazwisko",
    "phoneNumber": "Numer telefonu",
    "email": "Adres e-mail",
    "emailPlaceholder": "twoj@email.com",
    "emailHelp": "Otrzymasz e-mail z potwierdzeniem i linkiem do edycji lub anulowania",
    "notesTitle": "Dodatkowe informacje (opcjonalnie)",
    "notesPlaceholder": "Dodatkowe życzenia lub informacje...",
    "notesHelp": "Np. fotelik dziecięcy, czas oczekiwania, specjalne instrukcje",
    "submitting": "Wysyłanie...",
    "formIncomplete": "Uzupełnij formularz, aby kontynuować",
    "confirmOrder": (price: number) => `Potwierdź zamówienie (${price} PLN)`,
    "reassurance": "Bez przedpłaty. Darmowa anulacja. Potwierdzenie w 5–10 min."
  },
  "quoteForm": {
    "validation": {
      "phoneLetters": "Wpisz poprawny numer telefonu (tylko cyfry).",
      "phoneLength": "Wpisz poprawny numer telefonu (7–15 cyfr, opcjonalnie +).",
      "email": "Wpisz poprawny adres e-mail.",
      "datePast": "Wybierz dzisiejszą lub przyszłą datę.",
      "timePast": "Wybierz obecną lub przyszłą godzinę.",
      "timeSoon": "Wybierz godzinę co najmniej 40 minut od teraz."
    },
    "submitError": "Nie udało się wysłać zapytania o wycenę. Spróbuj ponownie.",
    "submitNetworkError": "Błąd sieci podczas wysyłania zapytania o wycenę. Spróbuj ponownie.",
    "submittedTitle": "Zapytanie o wycenę przyjęte!",
    "submittedBody": "Dziękujemy za zgłoszenie. W ciągu 5–10 minut otrzymasz e-mail z informacją o akceptacji lub odrzuceniu oferty.",
    "manageLink": "Zarządzaj zamówieniem",
    "title": "Poproś o indywidualną wycenę",
    "subtitle": "Zaproponuj cenę i otrzymaj odpowiedź w 5–10 minut",
    "requestButton": "Zarezerwuj przejazd",
    "requestAnother": "Zarezerwuj kolejny przejazd",
    "toggleDescription": "Podaj szczegóły przejazdu i zaproponuj cenę. W ciągu 5–10 minut otrzymasz e-mail z informacją o akceptacji lub odrzuceniu oferty.",
    "pickupType": "Miejsce odbioru",
    "airportPickup": "Odbiór z lotniska",
    "addressPickup": "Odbiór z adresu",
    "lockMessage": "Wybierz miejsce odbioru, aby odblokować resztę formularza.",
    "pickupAddress": "Adres odbioru",
    "pickupPlaceholder": "Wpisz pełny adres odbioru (np. Lotnisko Gdańsk, ul. Słowackiego 200)",
    "pickupAutoNote": "Adres odbioru z lotniska ustawiany jest automatycznie",
    "destinationAddress": "Adres docelowy",
    "destinationPlaceholder": "Wpisz adres docelowy (np. Gdańsk Centrum, ul. Długa 1)",
    "price": "Cena",
    "proposedPriceLabel": "Twoja proponowana cena (PLN)",
    "taximeterTitle": "Wpisz adres i poznasz cenę, jeśli Ci nie pasuje - zaproponuj swoją.",
    "tariff1": "Taryfa 1 (miasto, 6–22): 3,90 PLN/km.",
    "tariff2": "Taryfa 2 (miasto, 22–6): 5,85 PLN/km.",
    "tariff3": "Taryfa 3 (poza miastem, 6–22): 7,80 PLN/km.",
    "tariff4": "Taryfa 4 (poza miastem, 22–6): 11,70 PLN/km.",
    "autoPriceNote": "Kalkulator automatycznie wyliczy stawkę po podaniu adresu.",
    "fixedPriceHint": "Jeśli chcesz zaproponować stałą cenę, kliknij tutaj i wpisz kwotę.",
    "pricePlaceholder": "Wpisz swoją ofertę w PLN (np. 150)",
    "priceHelp": "Zaproponuj cenę za przejazd. Odpowiemy w 5–10 minut.",
    "fixedRouteChecking": "Sprawdzamy, czy ta trasa ma stałą cenę...",
    "fixedRouteTitle": "Stała cena dostępna",
    "fixedRouteDistance": (distance: number) => `Dystans: ${distance} km`,
    "fixedRouteComputed": (price: number) => `${price} PLN`,
    "fixedRouteCta": "Zarezerwuj stałą cenę",
    "fixedRouteHint": "Skorzystaj z rezerwacji stałej ceny, aby uzyskać najszybsze potwierdzenie.",
    "fixedRouteAllDay": "Stawka całodobowa",
    "fixedRouteDay": "Obowiązuje taryfa dzienna",
    "fixedRouteNight": "Obowiązuje taryfa nocna",
    "fixedRouteLocked": "Ta trasa ma stałą cenę. Zarezerwuj ją przez formularz stałej ceny.",
    "longRouteTitle": "Długi dystans - orientacyjna wycena",
    "longRouteDistance": (distance: number) => `Dystans: ${distance} km`,
    "longRouteTaximeter": (price: number, rate: number) => `Taksometr: ${price} PLN (${rate} PLN/km)`,
    "longRouteProposed": (price: number) => `Proponowana cena: ${price} PLN`,
    "longRouteSavings": (percent: number) => `Oszczędność: ${percent}%`,
    "longRouteNote": "Możesz nadal zaproponować własną cenę poniżej.",
    "date": "Data",
    "pickupTime": "Godzina odbioru",
    "signServiceTitle": "Odbiór na lotnisku",
    "signServiceSign": "Odbiór z kartką",
    "signServiceFee": "+20 PLN doliczone do ceny końcowej",
    "signServiceSelf": "Znajdę kierowcę samodzielnie na parkingu",
    "signServiceSelfNote": "Kierowca skontaktuje się z Tobą na WhatsAppie lub telefonicznie i znajdziecie się.",
    "signText": "Tekst na tabliczce",
    "signPlaceholder": "Tekst na tabliczce powitalnej",
    "signHelp": "Kierowca będzie czekał z tabliczką z tym tekstem do momentu wyjścia z hali przylotów",
    "signPreview": "Podgląd tabliczki:",
    "signEmpty": "Tutaj pojawi się Twoje imię",
    "flightNumber": "Numer lotu",
    "flightPlaceholder": "np. LO123",
    "passengers": "Liczba pasażerów",
    "passengersOptions": [
      "1 osoba",
      "2 osoby",
      "3 osoby",
      "4 osoby",
      "5+ osób"
    ],
    "largeLuggage": "Duży bagaż",
    "luggageNo": "Nie",
    "luggageYes": "Tak",
    "contactTitle": "Dane kontaktowe",
    "fullName": "Imię i nazwisko",
    "namePlaceholder": "Twoje imię i nazwisko",
    "phoneNumber": "Numer telefonu",
    "email": "Adres e-mail",
    "emailPlaceholder": "twoj@email.com",
    "emailHelp": "Otrzymasz odpowiedź w 5–10 minut",
    "notesTitle": "Dodatkowe informacje (opcjonalnie)",
    "notesPlaceholder": "Dodatkowe życzenia lub informacje...",
    "notesHelp": "Np. fotelik dziecięcy, czas oczekiwania, specjalne instrukcje",
    "submitting": "Wysyłanie...",
    "formIncomplete": "Uzupełnij formularz, aby kontynuować",
    "submit": "Zarezerwuj przejazd"
  },
  "manageOrder": {
    "errors": {
      "load": "Nie udało się wczytać zamówienia.",
      "loadNetwork": "Błąd sieci podczas wczytywania zamówienia.",
      "save": "Nie udało się zapisać zmian.",
      "saveNetwork": "Błąd sieci podczas zapisywania zmian.",
      "cancel": "Nie udało się anulować zamówienia.",
      "cancelNetwork": "Błąd sieci podczas anulowania zamówienia.",
      "copySuccess": "Skopiowano do schowka",
      "copyFail": "Nie udało się skopiować do schowka",
      "emailRequired": "Podaj adres e-mail."
    },
    "loading": "Ładowanie zamówienia...",
    "accessTitle": "Dostęp do rezerwacji",
    "accessBody": "Podaj adres e-mail użyty podczas rezerwacji, aby zobaczyć szczegóły zamówienia.",
    "accessPlaceholder": "you@example.com",
    "accessAction": "Kontynuuj",
    "accessChecking": "Sprawdzanie...",
    "cancelledTitle": "Zamówienie anulowane",
    "cancelledBody": "Twoje zamówienie zostało anulowane. Jeśli to pomyłka, utwórz nową rezerwację.",
    "manageTitle": "Zarządzaj transferem",
    "copyAction": "Kopiuj",
    "orderLabel": "Nr zamówienia",
    "orderIdLabel": "ID zamówienia",
    "detailsUpdatedTitle": "Dane zaktualizowane",
    "updateSubmittedTitle": "Aktualizacja wysłana",
    "updateSubmittedBody": "Twoja prośba o aktualizację została wysłana. Wkrótce odpowiemy.",
    "awaiting": "Oczekiwanie na potwierdzenie...",
    "transferRoute": "Trasa przejazdu",
    "priceLabel": "Cena:",
    "pricePending": "Cena ustalana indywidualnie",
    "taximeterTitle": "Kwota liczona wg taksometru",
    "taximeterRates": "Stawki taksometru",
    "tariff1": "Taryfa 1 (miasto, 6–22): 3,90 PLN/km.",
    "tariff2": "Taryfa 2 (miasto, 22–6): 5,85 PLN/km.",
    "tariff3": "Taryfa 3 (poza miastem, 6–22): 7,80 PLN/km.",
    "tariff4": "Taryfa 4 (poza miastem, 22–6): 11,70 PLN/km.",
    "statusConfirmed": "Potwierdzone",
    "statusCompleted": "Zrealizowane",
    "statusFailed": "Nie zrealizowane",
    "statusRejected": "Odrzucone",
    "statusPriceProposed": "Zaproponowana cena",
    "statusPending": "Oczekujące",
    "bookingDetails": "Szczegóły rezerwacji",
    "editDetails": "Edytuj dane",
    "updateRequested": "Zaktualizuj wskazane pola",
    "confirmedEditNote": "Edycja potwierdzonego zamówienia wyśle je do ponownej akceptacji. Otrzymasz nowe potwierdzenie e-mailem.",
    "updateFieldsNote": "Zaktualizuj podświetlone pola i zapisz zmiany.",
    "confirmedNote": "To zamówienie zostało potwierdzone.",
    "completedNote": "To zamówienie zostało oznaczone jako zrealizowane.",
    "failedNote": "To zamówienie zostało oznaczone jako niezrealizowane.",
    "priceProposedNote": "Zaproponowano nową cenę. Sprawdź e-mail, aby ją zaakceptować lub odrzucić.",
    "rejectedNote": "To zamówienie zostało odrzucone. Edycja jest wyłączona, ale możesz anulować rezerwację.",
    "rejectionReasonLabel": "Powód:",
    "date": "Data",
    "pickupTime": "Godzina odbioru",
    "signServiceTitle": "Odbiór na lotnisku",
    "signServiceSign": "Odbiór z kartką",
    "signServiceFee": "+20 PLN doliczone do ceny końcowej",
    "signServiceSelf": "Znajdę kierowcę samodzielnie na parkingu",
    "signServiceSelfNote": "Kierowca skontaktuje się z Tobą na WhatsAppie lub telefonicznie i znajdziecie się.",
    "signText": "Tekst na tabliczce",
    "flightNumber": "Numer lotu",
    "pickupAddress": "Adres odbioru",
    "passengers": "Liczba pasażerów",
    "passengersBus": [
      "5 osób",
      "6 osób",
      "7 osób",
      "8 osób"
    ],
    "passengersStandard": [
      "1 osoba",
      "2 osoby",
      "3 osoby",
      "4 osoby"
    ],
    "largeLuggage": "Duży bagaż",
    "luggageNo": "Nie",
    "luggageYes": "Tak",
    "contactTitle": "Dane kontaktowe",
    "fullName": "Imię i nazwisko",
    "phoneNumber": "Numer telefonu",
    "email": "Adres e-mail",
    "notesTitle": "Dodatkowe informacje (opcjonalnie)",
    "saveChanges": "Zapisz zmiany",
    "cancelEdit": "Anuluj",
    "editBooking": "Edytuj rezerwację",
    "cancelBooking": "Anuluj rezerwację",
    "changesNotice": "Zmiany w rezerwacji potwierdzimy e-mailem. W pilnych sprawach skontaktuj się z nami pod adresem booking@taxiairportgdansk.com",
    "updateRequestNote": "Twoja rezerwacja została zaktualizowana. Sprawdź i potwierdź zmiany.",
    "rejectNote": "Rezerwacja została odrzucona. Skontaktuj się z obsługą, jeśli masz pytania.",
    "cancelPromptTitle": "Anulować rezerwację?",
    "cancelPromptBody": "Czy na pewno chcesz anulować tę rezerwację? Tej operacji nie można cofnąć.",
    "confirmCancel": "Tak, anuluj",
    "keepBooking": "Zachowaj rezerwację",
    "copyOrderLabel": "Nr zamówienia",
    "copyOrderIdLabel": "ID zamówienia"
  },
  "adminOrders": {
    "title": "Zamówienia (admin)",
    "subtitle": "Wszystkie ostatnie zamówienia i statusy.",
    "loading": "Ładowanie zamówień...",
    "missingToken": "Brak tokenu admina.",
    "errorLoad": "Nie udało się wczytać zamówień.",
    "filters": {
      "all": "Wszystkie",
      "active": "W toku",
      "completed": "Zrealizowane",
      "failed": "Niezrealizowane",
      "rejected": "Odrzucone"
    },
    "statuses": {
      "pending": "Oczekujące",
      "confirmed": "Potwierdzone",
      "price_proposed": "Zaproponowana cena",
      "completed": "Zrealizowane",
      "failed": "Niezrealizowane",
      "rejected": "Odrzucone"
    },
    "columns": {
      "order": "Zamówienie",
      "pickup": "Odbiór",
      "customer": "Klient",
      "price": "Cena",
      "status": "Status",
      "open": "Otwórz"
    },
    "empty": "Brak zamówień.",
    "view": "Podgląd"
  },
  "adminOrder": {
    "title": "Szczegóły zamówienia (admin)",
    "subtitle": "Zarządzaj, potwierdź lub odrzuć zamówienie.",
    "back": "Wróć do listy zamówień",
    "loading": "Ładowanie zamówienia...",
    "missingToken": "Brak tokenu admina.",
    "errorLoad": "Nie udało się wczytać zamówienia.",
    "updated": "Zamówienie zaktualizowane.",
    "updateError": "Nie udało się zaktualizować zamówienia.",
    "statusUpdated": "Status zamówienia zaktualizowany.",
    "updateRequestSent": "Wysłano prośbę o aktualizację do klienta.",
    "updateRequestError": "Nie udało się wysłać prośby o aktualizację.",
    "updateRequestSelect": "Wybierz co najmniej jedno pole do aktualizacji.",
    "orderLabel": "Zamówienie",
    "idLabel": "ID",
    "customerLabel": "Klient",
    "pickupLabel": "Odbiór",
    "priceLabel": "Cena",
    "additionalInfo": "Dodatkowe informacje",
    "passengers": "Pasażerowie:",
    "largeLuggage": "Duży bagaż:",
    "pickupType": "Miejsce odbioru:",
    "signService": "Opcja odbioru:",
    "signServiceSign": "Odbiór z kartką",
    "signServiceSelf": "Samodzielne znalezienie kierowcy",
    "signFee": "Dopłata za kartkę:",
    "flightNumber": "Numer lotu:",
    "signText": "Tekst na tabliczce:",
    "route": "Trasa:",
    "notes": "Uwagi:",
    "adminActions": "Akcje admina",
    "confirmOrder": "Potwierdź zamówienie",
    "rejectOrder": "Odrzuć zamówienie",
    "proposePrice": "Zaproponuj nową cenę (PLN)",
    "sendPrice": "Wyślij propozycję ceny",
    "rejectionReason": "Powód odrzucenia (opcjonalnie)",
    "requestUpdate": "Poproś o aktualizację danych",
    "requestUpdateBody": "Wybierz pola do aktualizacji. Klient otrzyma e-mail z linkiem do edycji.",
    "fieldPhone": "Numer telefonu",
    "fieldEmail": "Adres e-mail",
    "fieldFlight": "Numer lotu",
    "requestUpdateAction": "Wyślij prośbę",
    "cancelConfirmedTitle": "Anulowanie potwierdzonego zamówienia",
    "cancelConfirmedBody": "Wyślij klientowi e-mail o anulowaniu z powodu braku dostępności taksówek w wybranym czasie.",
    "cancelConfirmedAction": "Anuluj potwierdzone zamówienie",
    "cancelConfirmedConfirm": "Czy na pewno anulować to potwierdzone zamówienie i powiadomić klienta?",
    "cancelConfirmedSuccess": "Zamówienie anulowane.",
    "deleteRejectedTitle": "Usuń odrzucone zamówienie",
    "deleteRejectedBody": "Usuń to odrzucone zamówienie na stałe.",
    "deleteRejectedAction": "Usuń odrzucone zamówienie",
    "deleteRejectedConfirm": "Czy na pewno usunąć to odrzucone zamówienie?",
    "deleteRejectedSuccess": "Zamówienie usunięte.",
    "completionTitle": "Status realizacji",
    "markCompleted": "Zrealizowane",
    "markCompletedConfirm": "Oznaczyć to zamówienie jako zrealizowane?",
    "markFailed": "Niezrealizowane",
    "markFailedConfirm": "Oznaczyć to zamówienie jako niezrealizowane?"
  },
  "pages": {
    "gdanskTaxi": {
      "title": "Taxi z lotniska Gdańsk",
      "description": "Zarezerwuj szybki i niezawodny transfer z Lotniska Gdańsk. Stałe ceny w obie strony, profesjonalni kierowcy i szybkie potwierdzenie.",
      "route": "Lotnisko Gdańsk",
      "examples": [
        "Gdańsk Stare Miasto",
        "Gdańsk Oliwa",
        "Dworzec Główny",
        "Plaża w Brzeźnie"
      ],
      "priceDay": 100,
      "priceNight": 120
    },
    "gdanskSopot": {
      "title": "Transfer Lotnisko Gdańsk – Sopot",
      "description": "Prywatny transfer między Lotniskiem Gdańsk a Sopotem ze stałą ceną w obie strony i śledzeniem lotu.",
      "route": "Lotnisko Gdańsk ↔ Sopot",
      "examples": [
        "Molo w Sopocie",
        "Centrum Sopotu",
        "Hotele w Sopocie",
        "Dworzec Sopot"
      ],
      "priceDay": 120,
      "priceNight": 150
    },
    "gdanskGdynia": {
      "title": "Transfer Lotnisko Gdańsk – Gdynia",
      "description": "Komfortowy transfer między Lotniskiem Gdańsk a Gdynią ze stałą ceną w obie strony.",
      "route": "Lotnisko Gdańsk ↔ Gdynia",
      "examples": [
        "Centrum Gdyni",
        "Port Gdynia",
        "Hotele w Gdyni",
        "Gdynia Orłowo"
      ],
      "priceDay": 150,
      "priceNight": 200
    }
  }
} as const;

export default pl;
