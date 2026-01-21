export const site = {
  name: 'Taxi Airport Gdańsk',
  url: 'https://taxiairportgdansk.com',
  ogImage: 'https://taxiairportgdansk.com/og-image.png',
  sameAs: [],
};

export const locales = ['en', 'pl', 'de', 'fi', 'no', 'sv', 'da'];

export const routeSlugs = {
  en: {
    airportTaxi: 'gdansk-airport-taxi',
    airportSopot: 'gdansk-airport-to-sopot',
    airportGdynia: 'gdansk-airport-to-gdynia',
    orderAirportGdansk: 'book-gdansk-airport-transfer',
    orderAirportSopot: 'book-gdansk-airport-sopot',
    orderAirportGdynia: 'book-gdansk-airport-gdynia',
    orderCustom: 'book-custom-transfer',
    pricing: 'pricing',
    cookies: 'cookies',
    privacy: 'privacy',
  },
  pl: {
    airportTaxi: 'taxi-lotnisko-gdansk',
    airportSopot: 'lotnisko-gdansk-sopot',
    airportGdynia: 'lotnisko-gdansk-gdynia',
    orderAirportGdansk: 'rezerwacja-lotnisko-gdansk',
    orderAirportSopot: 'rezerwacja-lotnisko-gdansk-sopot',
    orderAirportGdynia: 'rezerwacja-lotnisko-gdansk-gdynia',
    orderCustom: 'rezerwacja-niestandardowa',
    pricing: 'cennik',
    cookies: 'polityka-cookies',
    privacy: 'polityka-prywatnosci',
  },
  de: {
    airportTaxi: 'gdansk-flughafen-taxi',
    airportSopot: 'gdansk-flughafen-sopot',
    airportGdynia: 'gdansk-flughafen-gdynia',
    orderAirportGdansk: 'buchung-gdansk-flughafen',
    orderAirportSopot: 'buchung-gdansk-flughafen-sopot',
    orderAirportGdynia: 'buchung-gdansk-flughafen-gdynia',
    orderCustom: 'buchung-individuell',
    pricing: 'preise',
    cookies: 'cookie-richtlinie',
    privacy: 'datenschutz',
  },
  fi: {
    airportTaxi: 'gdansk-lentokentta-taksi',
    airportSopot: 'gdansk-lentokentta-sopot',
    airportGdynia: 'gdansk-lentokentta-gdynia',
    orderAirportGdansk: 'varaus-gdansk-lentokentta',
    orderAirportSopot: 'varaus-gdansk-lentokentta-sopot',
    orderAirportGdynia: 'varaus-gdansk-lentokentta-gdynia',
    orderCustom: 'varaus-mukautettu',
    pricing: 'hinnasto',
    cookies: 'evasteet',
    privacy: 'tietosuoja',
  },
  no: {
    airportTaxi: 'gdansk-flyplass-taxi',
    airportSopot: 'gdansk-flyplass-sopot',
    airportGdynia: 'gdansk-flyplass-gdynia',
    orderAirportGdansk: 'bestilling-gdansk-flyplass',
    orderAirportSopot: 'bestilling-gdansk-flyplass-sopot',
    orderAirportGdynia: 'bestilling-gdansk-flyplass-gdynia',
    orderCustom: 'bestilling-tilpasset',
    pricing: 'priser',
    cookies: 'informasjonskapsler',
    privacy: 'personvern',
  },
  sv: {
    airportTaxi: 'gdansk-flygplats-taxi',
    airportSopot: 'gdansk-flygplats-sopot',
    airportGdynia: 'gdansk-flygplats-gdynia',
    orderAirportGdansk: 'bokning-gdansk-flygplats',
    orderAirportSopot: 'bokning-gdansk-flygplats-sopot',
    orderAirportGdynia: 'bokning-gdansk-flygplats-gdynia',
    orderCustom: 'bokning-anpassad',
    pricing: 'priser',
    cookies: 'kakor',
    privacy: 'integritetspolicy',
  },
  da: {
    airportTaxi: 'gdansk-lufthavn-taxa',
    airportSopot: 'gdansk-lufthavn-sopot',
    airportGdynia: 'gdansk-lufthavn-gdynia',
    orderAirportGdansk: 'booking-gdansk-lufthavn',
    orderAirportSopot: 'booking-gdansk-lufthavn-sopot',
    orderAirportGdynia: 'booking-gdansk-lufthavn-gdynia',
    orderCustom: 'booking-tilpasset',
    pricing: 'priser',
    cookies: 'cookiepolitik',
    privacy: 'privatlivspolitik',
  },
};

const navLabels = {
  en: {
    home: 'Home',
    pricing: 'Pricing',
    airportTaxi: 'Gdansk Airport Taxi',
    airportSopot: 'Airport ↔ Sopot',
    airportGdynia: 'Airport ↔ Gdynia',
    orderAirportGdansk: 'Book Airport Transfer',
    orderAirportSopot: 'Book Airport to Sopot',
    orderAirportGdynia: 'Book Airport to Gdynia',
    orderCustom: 'Book Custom Transfer',
  },
  pl: {
    home: 'Strona główna',
    pricing: 'Cennik',
    airportTaxi: 'Taxi Lotnisko Gdańsk',
    airportSopot: 'Lotnisko ↔ Sopot',
    airportGdynia: 'Lotnisko ↔ Gdynia',
    orderAirportGdansk: 'Rezerwacja lotnisko Gdańsk',
    orderAirportSopot: 'Rezerwacja lotnisko Gdańsk – Sopot',
    orderAirportGdynia: 'Rezerwacja lotnisko Gdańsk – Gdynia',
    orderCustom: 'Rezerwacja trasy niestandardowej',
  },
  de: {
    home: 'Startseite',
    pricing: 'Preise',
    airportTaxi: 'Gdańsk Flughafen Taxi',
    airportSopot: 'Flughafen ↔ Sopot',
    airportGdynia: 'Flughafen ↔ Gdynia',
    orderAirportGdansk: 'Buchung Flughafen Gdańsk',
    orderAirportSopot: 'Buchung Flughafen – Sopot',
    orderAirportGdynia: 'Buchung Flughafen – Gdynia',
    orderCustom: 'Buchung individuelle Route',
  },
  fi: {
    home: 'Etusivu',
    pricing: 'Hinnasto',
    airportTaxi: 'Gdańsk lentokenttä taksi',
    airportSopot: 'Lentokenttä ↔ Sopot',
    airportGdynia: 'Lentokenttä ↔ Gdynia',
    orderAirportGdansk: 'Varaus lentokenttä Gdańsk',
    orderAirportSopot: 'Varaus lentokenttä – Sopot',
    orderAirportGdynia: 'Varaus lentokenttä – Gdynia',
    orderCustom: 'Varaus mukautettu reitti',
  },
  no: {
    home: 'Hjem',
    pricing: 'Priser',
    airportTaxi: 'Gdańsk flyplass taxi',
    airportSopot: 'Flyplass ↔ Sopot',
    airportGdynia: 'Flyplass ↔ Gdynia',
    orderAirportGdansk: 'Bestilling flyplass Gdańsk',
    orderAirportSopot: 'Bestilling flyplass – Sopot',
    orderAirportGdynia: 'Bestilling flyplass – Gdynia',
    orderCustom: 'Bestilling tilpasset rute',
  },
  sv: {
    home: 'Hem',
    pricing: 'Priser',
    airportTaxi: 'Gdańsk flygplats taxi',
    airportSopot: 'Flygplats ↔ Sopot',
    airportGdynia: 'Flygplats ↔ Gdynia',
    orderAirportGdansk: 'Bokning flygplats Gdańsk',
    orderAirportSopot: 'Bokning flygplats – Sopot',
    orderAirportGdynia: 'Bokning flygplats – Gdynia',
    orderCustom: 'Bokning anpassad rutt',
  },
  da: {
    home: 'Hjem',
    pricing: 'Priser',
    airportTaxi: 'Gdańsk lufthavn taxa',
    airportSopot: 'Lufthavn ↔ Sopot',
    airportGdynia: 'Lufthavn ↔ Gdynia',
    orderAirportGdansk: 'Booking lufthavn Gdańsk',
    orderAirportSopot: 'Booking lufthavn – Sopot',
    orderAirportGdynia: 'Booking lufthavn – Gdynia',
    orderCustom: 'Booking tilpasset rute',
  },
};

const metaByLocale = {
  en: {
    noscript:
      'Taxi Airport Gdańsk provides 24/7 airport transfers across Gdańsk, Sopot, and Gdynia. Fixed pricing, professional drivers, and fast confirmation. Contact: booking@taxiairportgdansk.com.',
    home: {
      title: 'Taxi Gdansk Airport | Taxi Airport Gdańsk Transfers 24/7',
      description:
        'Book taxi Gdansk airport transfers with fixed prices. Taxi Airport Gdańsk offers 24/7 pickups, flight tracking, and fast confirmation. Taxi transfers airport Gdansk.',
    },
    airportTaxi: {
      title: 'Gdansk Airport Taxi | Taxi Airport Gdańsk',
      description:
        'Taxi Gdansk airport to city center and back. Fixed prices, meet & greet, and quick confirmation for airport transfers.',
    },
    airportSopot: {
      title: 'Gdansk Airport to Sopot Taxi | Taxi Airport Gdańsk',
      description:
        'Book taxi transfer from Gdansk airport to Sopot with fixed prices, flight tracking, and 24/7 service.',
    },
    airportGdynia: {
      title: 'Gdansk Airport to Gdynia Taxi | Taxi Airport Gdańsk',
      description:
        'Reliable taxi transfers from Gdansk airport to Gdynia. Fixed price, professional drivers, and fast booking.',
    },
    orderAirportGdansk: {
      title: 'Book Gdansk Airport Taxi | Taxi Airport Gdańsk',
      description:
        'Direct booking form for Gdansk Airport to city center transfers. Fixed prices, 24/7 service, fast confirmation.',
    },
    orderAirportSopot: {
      title: 'Book Gdansk Airport to Sopot Taxi | Taxi Airport Gdańsk',
      description:
        'Book your airport transfer from Gdansk to Sopot with fixed prices and quick confirmation.',
    },
    orderAirportGdynia: {
      title: 'Book Gdansk Airport to Gdynia Taxi | Taxi Airport Gdańsk',
      description:
        'Reserve a taxi from Gdansk Airport to Gdynia. Fixed prices, professional drivers, 24/7.',
    },
    orderCustom: {
      title: 'Book Custom Transfer | Taxi Airport Gdańsk',
      description:
        'Request a custom transfer quote in Gdansk, Sopot, or Gdynia. Fast response and flexible pricing.',
    },
    pricing: {
      title: 'Gdansk Airport Taxi Prices | Taxi Airport Gdańsk',
      description:
        'See fixed prices for airport transfers to Gdansk, Sopot, and Gdynia, including day/night tariffs and custom route rates.',
    },
    cookies: {
      title: 'Cookie Policy | Taxi Airport Gdańsk',
      description: 'Read how Taxi Airport Gdańsk uses cookies to keep bookings secure and improve the service.',
    },
    privacy: {
      title: 'Privacy Policy | Taxi Airport Gdańsk',
      description: 'Learn how Taxi Airport Gdańsk processes and protects your personal data.',
    },
  },
  pl: {
    noscript:
      'Taxi Airport Gdańsk zapewnia całodobowe transfery lotniskowe w Gdańsku, Sopocie i Gdyni. Stałe ceny, profesjonalni kierowcy i szybkie potwierdzenie. Kontakt: booking@taxiairportgdansk.com.',
    home: {
      title: 'Taxi Gdańsk Lotnisko | Taxi Airport Gdańsk Transfery 24/7',
      description:
        'Taxi Gdańsk / taxi gdansk: transfery lotniskowe, stałe ceny i szybkie potwierdzenie. Taxi lotnisko Gdańsk (taxi lotnisko gdansk) 24/7.',
    },
    airportTaxi: {
      title: 'Taxi Lotnisko Gdańsk | Taxi Airport Gdańsk',
      description:
        'Taxi lotnisko Gdańsk do centrum i z centrum na lotnisko. Stałe ceny, szybkie potwierdzenie, 24/7.',
    },
    airportSopot: {
      title: 'Taxi Lotnisko Gdańsk – Sopot | Transfer 24/7',
      description:
        'Transfer taxi z lotniska Gdańsk do Sopotu. Stała cena, śledzenie lotu i szybka rezerwacja.',
    },
    airportGdynia: {
      title: 'Taxi Lotnisko Gdańsk – Gdynia | Transfer 24/7',
      description:
        'Transfer taxi z lotniska Gdańsk do Gdyni. Stała cena, profesjonalni kierowcy, 24/7.',
    },
    orderAirportGdansk: {
      title: 'Rezerwacja Taxi Lotnisko Gdańsk | Taxi Airport Gdańsk',
      description:
        'Zarezerwuj transfer z lotniska Gdańsk do centrum. Stałe ceny, 24/7 i szybkie potwierdzenie.',
    },
    orderAirportSopot: {
      title: 'Rezerwacja Taxi Lotnisko Gdańsk – Sopot',
      description:
        'Szybka rezerwacja transferu z lotniska Gdańsk do Sopotu. Stała cena i potwierdzenie w 5–10 min.',
    },
    orderAirportGdynia: {
      title: 'Rezerwacja Taxi Lotnisko Gdańsk – Gdynia',
      description:
        'Zarezerwuj taxi z lotniska Gdańsk do Gdyni. Stałe ceny i profesjonalni kierowcy.',
    },
    orderCustom: {
      title: 'Rezerwacja Trasy Niestandardowej | Taxi Airport Gdańsk',
      description:
        'Poproś o wycenę niestandardowej trasy w Trójmieście. Odpowiedź w 5–10 minut.',
    },
    pricing: {
      title: 'Cennik Taxi Lotnisko Gdańsk | Taxi Airport Gdańsk',
      description:
        'Sprawdź stałe ceny transferów lotniskowych do Gdańska, Sopotu i Gdyni, wraz z taryfami dziennymi i nocnymi.',
    },
    cookies: {
      title: 'Polityka Cookies | Taxi Airport Gdańsk',
      description: 'Dowiedz się, jak Taxi Airport Gdańsk używa cookies, by chronić rezerwacje.',
    },
    privacy: {
      title: 'Polityka Prywatności | Taxi Airport Gdańsk',
      description: 'Sprawdź, jak Taxi Airport Gdańsk przetwarza i chroni dane osobowe.',
    },
  },
  de: {
    noscript:
      'Taxi Airport Gdańsk bietet 24/7 Flughafentransfers in Gdańsk, Sopot und Gdynia. Festpreise, professionelle Fahrer und schnelle Bestätigung. Kontakt: booking@taxiairportgdansk.com.',
    home: {
      title: 'Gdańsk Flughafen Taxi | Taxi Airport Gdańsk Transfers 24/7',
      description:
        'Gdansk airport taxi mit Festpreisen. Taxi Airport Gdańsk bietet 24/7 Transfers, Flugtracking und schnelle Bestätigung.',
    },
    airportTaxi: {
      title: 'Gdańsk Flughafen Taxi | Taxi Airport Gdańsk',
      description:
        'Taxi vom Flughafen Gdańsk in die Stadt. Festpreise, Meet & Greet und schnelle Buchung.',
    },
    airportSopot: {
      title: 'Gdańsk Flughafen nach Sopot Taxi | Taxi Airport Gdańsk',
      description:
        'Transfer vom Flughafen Gdańsk nach Sopot mit Festpreisen, Flugtracking und 24/7 Service.',
    },
    airportGdynia: {
      title: 'Gdańsk Flughafen nach Gdynia Taxi | Taxi Airport Gdańsk',
      description:
        'Zuverlässiger Taxi-Transfer vom Flughafen Gdańsk nach Gdynia mit Festpreis.',
    },
    orderAirportGdansk: {
      title: 'Book Gdansk Airport Taxi | Taxi Airport Gdańsk',
      description:
        'Direct booking form for Gdansk Airport to city center transfers. Fixed prices, 24/7 service, fast confirmation.',
    },
    orderAirportSopot: {
      title: 'Book Gdansk Airport to Sopot Taxi | Taxi Airport Gdańsk',
      description:
        'Book your airport transfer from Gdansk to Sopot with fixed prices and quick confirmation.',
    },
    orderAirportGdynia: {
      title: 'Book Gdansk Airport to Gdynia Taxi | Taxi Airport Gdańsk',
      description:
        'Reserve a taxi from Gdansk Airport to Gdynia. Fixed prices, professional drivers, 24/7.',
    },
    orderCustom: {
      title: 'Book Custom Transfer | Taxi Airport Gdańsk',
      description:
        'Request a custom transfer quote in Gdansk, Sopot, or Gdynia. Fast response and flexible pricing.',
    },
    pricing: {
      title: 'Gdansk Airport Taxi Prices | Taxi Airport Gdańsk',
      description:
        'See fixed prices for airport transfers to Gdansk, Sopot, and Gdynia, including day/night tariffs and custom route rates.',
    },
    cookies: {
      title: 'Cookie-Richtlinie | Taxi Airport Gdańsk',
      description: 'Informationen zu Cookies bei Taxi Airport Gdańsk.',
    },
    privacy: {
      title: 'Datenschutz | Taxi Airport Gdańsk',
      description: 'Details zum Datenschutz bei Taxi Airport Gdańsk.',
    },
  },
  fi: {
    noscript:
      'Taxi Airport Gdańsk tarjoaa 24/7 lentokenttäkuljetuksia Gdańskiin, Sopotiin ja Gdyniaan. Kiinteät hinnat, ammattikuljettajat ja nopea vahvistus. Yhteys: booking@taxiairportgdansk.com.',
    home: {
      title: 'Gdańsk lentokenttä taksi | Taxi Airport Gdańsk 24/7',
      description:
        'Gdansk airport taxi ja kiinteät hinnat. Taxi Airport Gdańsk tarjoaa 24/7 kuljetuksia ja nopean vahvistuksen.',
    },
    airportTaxi: {
      title: 'Gdańsk lentokenttä taksi | Taxi Airport Gdańsk',
      description:
        'Taksi Gdańskin lentokentältä keskustaan. Kiinteä hinta, ammattilaiskuljettajat ja nopea varaus.',
    },
    airportSopot: {
      title: 'Gdańsk lentokenttä – Sopot taksi | Taxi Airport Gdańsk',
      description:
        'Kuljetus Gdańskin lentokentältä Sopotiin kiinteällä hinnalla ja 24/7 palvelulla.',
    },
    airportGdynia: {
      title: 'Gdańsk lentokenttä – Gdynia taksi | Taxi Airport Gdańsk',
      description:
        'Kuljetus Gdańskin lentokentältä Gdyniaan kiinteällä hinnalla ja nopealla varauksella.',
    },
    orderAirportGdansk: {
      title: 'Book Gdansk Airport Taxi | Taxi Airport Gdańsk',
      description:
        'Direct booking form for Gdansk Airport to city center transfers. Fixed prices, 24/7 service, fast confirmation.',
    },
    orderAirportSopot: {
      title: 'Book Gdansk Airport to Sopot Taxi | Taxi Airport Gdańsk',
      description:
        'Book your airport transfer from Gdansk to Sopot with fixed prices and quick confirmation.',
    },
    orderAirportGdynia: {
      title: 'Book Gdansk Airport to Gdynia Taxi | Taxi Airport Gdańsk',
      description:
        'Reserve a taxi from Gdansk Airport to Gdynia. Fixed prices, professional drivers, 24/7.',
    },
    orderCustom: {
      title: 'Book Custom Transfer | Taxi Airport Gdańsk',
      description:
        'Request a custom transfer quote in Gdansk, Sopot, or Gdynia. Fast response and flexible pricing.',
    },
    pricing: {
      title: 'Gdansk Airport Taxi Prices | Taxi Airport Gdańsk',
      description:
        'See fixed prices for airport transfers to Gdansk, Sopot, and Gdynia, including day/night tariffs and custom route rates.',
    },
    cookies: {
      title: 'Evästekäytäntö | Taxi Airport Gdańsk',
      description: 'Tietoa evästeiden käytöstä Taxi Airport Gdańsk -palvelussa.',
    },
    privacy: {
      title: 'Tietosuoja | Taxi Airport Gdańsk',
      description: 'Tietosuojatiedot Taxi Airport Gdańsk -palvelusta.',
    },
  },
  no: {
    noscript:
      'Taxi Airport Gdańsk tilbyr 24/7 flyplasstransport i Gdańsk, Sopot og Gdynia. Faste priser, profesjonelle sjåfører og rask bekreftelse. Kontakt: booking@taxiairportgdansk.com.',
    home: {
      title: 'Gdańsk flyplass taxi | Taxi Airport Gdańsk 24/7',
      description:
        'Gdansk airport taxi med faste priser. Taxi Airport Gdańsk tilbyr 24/7 transfer og rask bekreftelse.',
    },
    airportTaxi: {
      title: 'Gdańsk flyplass taxi | Taxi Airport Gdańsk',
      description:
        'Taxi fra Gdańsk flyplass til sentrum med fast pris og profesjonelle sjåfører.',
    },
    airportSopot: {
      title: 'Gdańsk flyplass til Sopot taxi | Taxi Airport Gdańsk',
      description:
        'Transfer fra Gdańsk flyplass til Sopot med faste priser og 24/7 service.',
    },
    airportGdynia: {
      title: 'Gdańsk flyplass til Gdynia taxi | Taxi Airport Gdańsk',
      description:
        'Transfer fra Gdańsk flyplass til Gdynia med fast pris og rask bestilling.',
    },
    orderAirportGdansk: {
      title: 'Book Gdansk Airport Taxi | Taxi Airport Gdańsk',
      description:
        'Direct booking form for Gdansk Airport to city center transfers. Fixed prices, 24/7 service, fast confirmation.',
    },
    orderAirportSopot: {
      title: 'Book Gdansk Airport to Sopot Taxi | Taxi Airport Gdańsk',
      description:
        'Book your airport transfer from Gdansk to Sopot with fixed prices and quick confirmation.',
    },
    orderAirportGdynia: {
      title: 'Book Gdansk Airport to Gdynia Taxi | Taxi Airport Gdańsk',
      description:
        'Reserve a taxi from Gdansk Airport to Gdynia. Fixed prices, professional drivers, 24/7.',
    },
    orderCustom: {
      title: 'Book Custom Transfer | Taxi Airport Gdańsk',
      description:
        'Request a custom transfer quote in Gdansk, Sopot, or Gdynia. Fast response and flexible pricing.',
    },
    pricing: {
      title: 'Gdansk Airport Taxi Prices | Taxi Airport Gdańsk',
      description:
        'See fixed prices for airport transfers to Gdansk, Sopot, and Gdynia, including day/night tariffs and custom route rates.',
    },
    cookies: {
      title: 'Informasjonskapsler | Taxi Airport Gdańsk',
      description: 'Slik bruker Taxi Airport Gdańsk informasjonskapsler.',
    },
    privacy: {
      title: 'Personvern | Taxi Airport Gdańsk',
      description: 'Personverninformasjon for Taxi Airport Gdańsk.',
    },
  },
  sv: {
    noscript:
      'Taxi Airport Gdańsk erbjuder flygplatstransfer 24/7 i Gdańsk, Sopot och Gdynia. Fasta priser, professionella förare och snabb bekräftelse. Kontakt: booking@taxiairportgdansk.com.',
    home: {
      title: 'Gdańsk flygplats taxi | Taxi Airport Gdańsk 24/7',
      description:
        'Gdansk airport taxi med fasta priser. Taxi Airport Gdańsk erbjuder transfer 24/7 och snabb bekräftelse.',
    },
    airportTaxi: {
      title: 'Gdańsk flygplats taxi | Taxi Airport Gdańsk',
      description:
        'Taxi från Gdańsk flygplats till centrum med fast pris och professionella förare.',
    },
    airportSopot: {
      title: 'Gdańsk flygplats till Sopot taxi | Taxi Airport Gdańsk',
      description:
        'Transfer från Gdańsk flygplats till Sopot med fasta priser och 24/7 service.',
    },
    airportGdynia: {
      title: 'Gdańsk flygplats till Gdynia taxi | Taxi Airport Gdańsk',
      description:
        'Transfer från Gdańsk flygplats till Gdynia med fast pris och snabb bokning.',
    },
    orderAirportGdansk: {
      title: 'Book Gdansk Airport Taxi | Taxi Airport Gdańsk',
      description:
        'Direct booking form for Gdansk Airport to city center transfers. Fixed prices, 24/7 service, fast confirmation.',
    },
    orderAirportSopot: {
      title: 'Book Gdansk Airport to Sopot Taxi | Taxi Airport Gdańsk',
      description:
        'Book your airport transfer from Gdansk to Sopot with fixed prices and quick confirmation.',
    },
    orderAirportGdynia: {
      title: 'Book Gdansk Airport to Gdynia Taxi | Taxi Airport Gdańsk',
      description:
        'Reserve a taxi from Gdansk Airport to Gdynia. Fixed prices, professional drivers, 24/7.',
    },
    orderCustom: {
      title: 'Book Custom Transfer | Taxi Airport Gdańsk',
      description:
        'Request a custom transfer quote in Gdansk, Sopot, or Gdynia. Fast response and flexible pricing.',
    },
    pricing: {
      title: 'Gdansk Airport Taxi Prices | Taxi Airport Gdańsk',
      description:
        'See fixed prices for airport transfers to Gdansk, Sopot, and Gdynia, including day/night tariffs and custom route rates.',
    },
    cookies: {
      title: 'Cookiepolicy | Taxi Airport Gdańsk',
      description: 'Information om cookies hos Taxi Airport Gdańsk.',
    },
    privacy: {
      title: 'Integritetspolicy | Taxi Airport Gdańsk',
      description: 'Integritetsinformation för Taxi Airport Gdańsk.',
    },
  },
  da: {
    noscript:
      'Taxi Airport Gdańsk tilbyder lufthavnstransfer 24/7 i Gdańsk, Sopot og Gdynia. Faste priser, professionelle chauffører og hurtig bekræftelse. Kontakt: booking@taxiairportgdansk.com.',
    home: {
      title: 'Gdańsk lufthavn taxa | Taxi Airport Gdańsk 24/7',
      description:
        'Gdansk airport taxi med faste priser. Taxi Airport Gdańsk tilbyder transfer 24/7 og hurtig bekræftelse.',
    },
    airportTaxi: {
      title: 'Gdańsk lufthavn taxa | Taxi Airport Gdańsk',
      description:
        'Taxa fra Gdańsk lufthavn til centrum med fast pris og professionelle chauffører.',
    },
    airportSopot: {
      title: 'Gdańsk lufthavn til Sopot taxa | Taxi Airport Gdańsk',
      description:
        'Transfer fra Gdańsk lufthavn til Sopot med faste priser og 24/7 service.',
    },
    airportGdynia: {
      title: 'Gdańsk lufthavn til Gdynia taxa | Taxi Airport Gdańsk',
      description:
        'Transfer fra Gdańsk lufthavn til Gdynia med fast pris og hurtig booking.',
    },
    orderAirportGdansk: {
      title: 'Book Gdansk Airport Taxi | Taxi Airport Gdańsk',
      description:
        'Direct booking form for Gdansk Airport to city center transfers. Fixed prices, 24/7 service, fast confirmation.',
    },
    orderAirportSopot: {
      title: 'Book Gdansk Airport to Sopot Taxi | Taxi Airport Gdańsk',
      description:
        'Book your airport transfer from Gdansk to Sopot with fixed prices and quick confirmation.',
    },
    orderAirportGdynia: {
      title: 'Book Gdansk Airport to Gdynia Taxi | Taxi Airport Gdańsk',
      description:
        'Reserve a taxi from Gdansk Airport to Gdynia. Fixed prices, professional drivers, 24/7.',
    },
    orderCustom: {
      title: 'Book Custom Transfer | Taxi Airport Gdańsk',
      description:
        'Request a custom transfer quote in Gdansk, Sopot, or Gdynia. Fast response and flexible pricing.',
    },
    pricing: {
      title: 'Gdansk Airport Taxi Prices | Taxi Airport Gdańsk',
      description:
        'See fixed prices for airport transfers to Gdansk, Sopot, and Gdynia, including day/night tariffs and custom route rates.',
    },
    cookies: {
      title: 'Cookiepolitik | Taxi Airport Gdańsk',
      description: 'Information om cookies hos Taxi Airport Gdańsk.',
    },
    privacy: {
      title: 'Privatlivspolitik | Taxi Airport Gdańsk',
      description: 'Privatlivsoplysninger for Taxi Airport Gdańsk.',
    },
  },
};

const faqByLocale = {
  en: [
    {
      question: 'How fast is confirmation?',
      answer: 'Most bookings are confirmed within 5–10 minutes by email.',
    },
    {
      question: 'Do you track flights?',
      answer: 'Yes, we monitor arrivals and adjust pickup time accordingly.',
    },
    {
      question: 'Can I cancel?',
      answer: 'You can cancel using the link sent in your confirmation email.',
    },
    {
      question: 'Do you offer child seats?',
      answer: 'Yes, child seats are available on request during booking.',
    },
    {
      question: 'How do I pay?',
      answer: 'You can pay by card, Apple Pay, Google Pay, Revolut, or cash on request.',
    },
    {
      question: 'Where do I meet the driver?',
      answer: 'You will receive clear pickup instructions and contact details in the confirmation email.',
    },
  ],
  pl: [
    {
      question: 'Jak szybko dostanę potwierdzenie?',
      answer: 'Większość rezerwacji potwierdzamy e-mailem w 5–10 minut.',
    },
    {
      question: 'Czy śledzicie loty?',
      answer: 'Tak, monitorujemy przyloty i dostosowujemy czas odbioru.',
    },
    {
      question: 'Czy mogę anulować?',
      answer: 'Możesz anulować korzystając z linku w e-mailu potwierdzającym.',
    },
    {
      question: 'Czy oferujecie foteliki dziecięce?',
      answer: 'Tak, foteliki dziecięce są dostępne na życzenie podczas rezerwacji.',
    },
    {
      question: 'Jak mogę zapłacić?',
      answer: 'Możesz zapłacić kartą, Apple Pay, Google Pay, Revolut lub gotówką na życzenie.',
    },
    {
      question: 'Gdzie spotkam kierowcę?',
      answer: 'Otrzymasz jasne instrukcje odbioru i kontakt do kierowcy w e-mailu potwierdzającym.',
    },
  ],
  de: [
    {
      question: 'Wie schnell kommt die Bestätigung?',
      answer: 'Die meisten Buchungen werden innerhalb von 5–10 Minuten per E-Mail bestätigt.',
    },
    {
      question: 'Verfolgen Sie Flüge?',
      answer: 'Ja, wir verfolgen Ankünfte und passen die Abholzeit entsprechend an.',
    },
    {
      question: 'Kann ich stornieren?',
      answer: 'Sie können über den Link in der Bestätigungs-E-Mail stornieren.',
    },
    {
      question: 'Bieten Sie Kindersitze an?',
      answer: 'Ja, Kindersitze sind auf Anfrage bei der Buchung verfügbar.',
    },
    {
      question: 'Wie kann ich bezahlen?',
      answer: 'Zahlung per Karte, Apple Pay, Google Pay, Revolut oder bar auf Anfrage.',
    },
    {
      question: 'Wo treffe ich den Fahrer?',
      answer: 'Sie erhalten klare Abholhinweise und Kontaktdaten in der Bestätigungs-E-Mail.',
    },
  ],
  fi: [
    {
      question: 'Kuinka nopeasti vahvistus tulee?',
      answer: 'Useimmat varaukset vahvistetaan sähköpostitse 5–10 minuutissa.',
    },
    {
      question: 'Seuraatteko lentoja?',
      answer: 'Kyllä, seuraamme saapumisia ja säädämme noutoajan sen mukaan.',
    },
    {
      question: 'Voinko perua?',
      answer: 'Voit perua vahvistusviestin linkin kautta.',
    },
    {
      question: 'Tarjoatteko lastenistuimia?',
      answer: 'Kyllä, lastenistuimia on saatavilla pyynnöstä varauksen yhteydessä.',
    },
    {
      question: 'Miten voin maksaa?',
      answer: 'Voit maksaa kortilla, Apple Paylla, Google Paylla, Revolutilla tai käteisellä pyynnöstä.',
    },
    {
      question: 'Missä tapaan kuljettajan?',
      answer: 'Saat selkeät nouto-ohjeet ja yhteystiedot vahvistusviestissä.',
    },
  ],
  no: [
    {
      question: 'Hvor raskt får jeg bekreftelse?',
      answer: 'De fleste bestillinger bekreftes innen 5–10 minutter på e-post.',
    },
    {
      question: 'Sporer dere fly?',
      answer: 'Ja, vi følger ankomster og justerer hentetid ved behov.',
    },
    {
      question: 'Kan jeg avbestille?',
      answer: 'Du kan avbestille via lenken i bekreftelses-e-posten.',
    },
    {
      question: 'Tilbyr dere barneseter?',
      answer: 'Ja, barneseter er tilgjengelig på forespørsel ved bestilling.',
    },
    {
      question: 'Hvordan kan jeg betale?',
      answer: 'Du kan betale med kort, Apple Pay, Google Pay, Revolut eller kontant på forespørsel.',
    },
    {
      question: 'Hvor møter jeg sjåføren?',
      answer: 'Du får tydelige hentebeskrivelser og kontaktinfo i bekreftelses-e-posten.',
    },
  ],
  sv: [
    {
      question: 'Hur snabbt får jag bekräftelse?',
      answer: 'De flesta bokningar bekräftas via e-post inom 5–10 minuter.',
    },
    {
      question: 'Spårar ni flyg?',
      answer: 'Ja, vi följer ankomster och anpassar hämtningstiden.',
    },
    {
      question: 'Kan jag avboka?',
      answer: 'Du kan avboka via länken i bekräftelsemejlet.',
    },
    {
      question: 'Erbjuder ni bilbarnstolar?',
      answer: 'Ja, bilbarnstolar finns på begäran vid bokning.',
    },
    {
      question: 'Hur kan jag betala?',
      answer: 'Du kan betala med kort, Apple Pay, Google Pay, Revolut eller kontant på begäran.',
    },
    {
      question: 'Var möter jag chauffören?',
      answer: 'Du får tydliga upphämtningsinstruktioner och kontaktinfo i bekräftelsemejlet.',
    },
  ],
  da: [
    {
      question: 'Hvor hurtigt får jeg bekræftelse?',
      answer: 'De fleste bookinger bekræftes inden for 5–10 minutter via e-mail.',
    },
    {
      question: 'Spore I fly?',
      answer: 'Ja, vi overvåger ankomster og tilpasser afhentningstid.',
    },
    {
      question: 'Kan jeg afbestille?',
      answer: 'Du kan afbestille via linket i bekræftelses-e-mailen.',
    },
    {
      question: 'Tilbyder I autostole til børn?',
      answer: 'Ja, autostole til børn er tilgængelige efter anmodning ved booking.',
    },
    {
      question: 'Hvordan kan jeg betale?',
      answer: 'Du kan betale med kort, Apple Pay, Google Pay, Revolut eller kontant efter aftale.',
    },
    {
      question: 'Hvor møder jeg chaufføren?',
      answer: 'Du får klare afhentningsinstruktioner og kontaktinfo i bekræftelses-e-mailen.',
    },
  ],
};

export const getLocaleFromPath = (urlPath) => {
  const [, first] = urlPath.split('/');
  return locales.includes(first) ? first : null;
};

export const getRouteKeyFromSlug = (locale, slug) => {
  const entries = Object.entries(routeSlugs[locale] || {});
  const match = entries.find(([, value]) => value === slug);
  return match ? match[0] : null;
};

export const buildLocalizedUrl = (locale, routeKey) => {
  const base = `${site.url}/${locale}`;
  if (!routeKey) {
    return `${base}/`;
  }
  return `${base}/${routeSlugs[locale][routeKey]}`;
};

export const buildRootUrl = (routeKey) => {
    if (!routeKey) return `${site.url}/`;
    // dla stron typu /gdansk-airport-taxi bez języka nie masz routingu,
    // więc root obsługuje tylko home:
    return `${site.url}/`;
};

const isIndexablePath = (urlPath) => {
  if (urlPath.includes('/admin')) return false;
  const pathParts = urlPath.replace(/\/$/, '').split('/').filter(Boolean);
  const localeFromPath = getLocaleFromPath(urlPath);
  const locale = localeFromPath ?? 'en';
  const slug = localeFromPath ? (pathParts[1] ?? '') : (pathParts[0] ?? '');
  if (!slug) return true;
  if (!localeFromPath) return false;
  return Boolean(getRouteKeyFromSlug(locale, slug));
};

export const getHtmlLang = (urlPath) => getLocaleFromPath(urlPath) ?? 'en';

export const buildSeoTags = (urlPath) => {
    const localeFromPath = getLocaleFromPath(urlPath);
    const locale = localeFromPath ?? 'en';

    const pathParts = urlPath.replace(/\/$/, '').split('/').filter(Boolean);

    // jeśli URL nie ma locale (czyli "/"), slug jest pierwszy element
    // jeśli ma locale ("/en/..."), slug jest drugim elementem
    const slug = localeFromPath ? (pathParts[1] ?? '') : (pathParts[0] ?? '');

    const routeKey = slug ? getRouteKeyFromSlug(locale, slug) : null;
    const meta = metaByLocale[locale]?.[routeKey ?? 'home'] ?? metaByLocale.en.home;

    const isRootHome = !localeFromPath && !slug; // dokładnie "/"

    const canonical = isRootHome ? `${site.url}/` : buildLocalizedUrl(locale, routeKey);

    const alternates = locales
        .map((lang) => {
            // dla home (routeKey null) daj /<lang>/, a nie /
            const href = routeKey
                ? buildLocalizedUrl(lang, routeKey)
                : `${site.url}/${lang}/`;
            return `<link rel="alternate" hreflang="${lang}" href="${href}">`;
        })
        .join('');

    const xDefault = `<link rel="alternate" hreflang="x-default" href="${site.url}/">`;
    const robots = isIndexablePath(urlPath) ? 'index,follow' : 'noindex,nofollow';

    const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TaxiService'],
    name: site.name,
    url: `${site.url}/`,
    areaServed: ['Gdańsk', 'Sopot', 'Gdynia'],
    email: 'booking@taxiairportgdansk.com',
    priceRange: '$$',
    telephone: '+48694347548',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gdańsk',
      addressCountry: 'PL',
    },
    openingHours: 'Mo-Su 00:00-23:59',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '54.3520',
      longitude: '18.6466',
    },
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
  };

  const faq = faqByLocale[locale] ?? faqByLocale.en;
  const faqSchema =
    routeKey && ['airportTaxi', 'airportSopot', 'airportGdynia'].includes(routeKey)
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((entry) => ({
            '@type': 'Question',
            name: entry.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: entry.answer,
            },
          })),
        }
      : null;

  const labels = navLabels[locale] ?? navLabels.en;
  const homeUrl = isRootHome ? `${site.url}/` : buildLocalizedUrl(locale, null);
  const navigationItems = [
    { key: 'home', url: homeUrl },
    { key: 'pricing', url: buildLocalizedUrl(locale, 'pricing') },
    { key: 'airportTaxi', url: buildLocalizedUrl(locale, 'airportTaxi') },
    { key: 'airportSopot', url: buildLocalizedUrl(locale, 'airportSopot') },
    { key: 'airportGdynia', url: buildLocalizedUrl(locale, 'airportGdynia') },
    { key: 'orderAirportGdansk', url: buildLocalizedUrl(locale, 'orderAirportGdansk') },
    { key: 'orderCustom', url: buildLocalizedUrl(locale, 'orderCustom') },
  ];

  const navigationSchema = {
    '@context': 'https://schema.org',
    '@graph': navigationItems.map((item) => ({
      '@type': 'SiteNavigationElement',
      name: labels[item.key] ?? labels.home,
      url: item.url,
    })),
  };

  const shouldIncludeBreadcrumbs = isIndexablePath(urlPath) && routeKey;
  const breadcrumbSchema = shouldIncludeBreadcrumbs
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: labels.home,
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: labels[routeKey] ?? meta.title,
            item: canonical,
          },
        ],
      }
    : null;

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: homeUrl,
    inLanguage: locale,
  };

  return [
    `<title>${meta.title}</title>`,
    `<meta name="description" content="${meta.description}">`,
    `<meta name="robots" content="${robots}">`,
    `<meta property="og:title" content="${meta.title}">`,
    `<meta property="og:description" content="${meta.description}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:image" content="${site.ogImage}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:site_name" content="${site.name}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${meta.title}">`,
    `<meta name="twitter:description" content="${meta.description}">`,
    `<meta name="twitter:image" content="${site.ogImage}">`,
    `<link rel="canonical" href="${canonical}">`,
    alternates,
    xDefault,
    `<script type="application/ld+json">${JSON.stringify(localBusinessSchema)}</script>`,
    `<script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>`,
    `<script type="application/ld+json">${JSON.stringify(navigationSchema)}</script>`,
    breadcrumbSchema ? `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>` : '',
    faqSchema ? `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>` : '',
  ].join('');
};

export const buildNoscript = (urlPath) => {
  const locale = getLocaleFromPath(urlPath) ?? 'en';
  return metaByLocale[locale]?.noscript ?? metaByLocale.en.noscript;
};
