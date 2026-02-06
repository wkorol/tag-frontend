const sameAsFromEnv = (process.env.SEO_SAME_AS ?? '')
  .split(',')
  .map((item) => item.trim())
  .filter((item) => /^https?:\/\//.test(item));

const defaultLocale = 'pl';

export const site = {
  name: 'Taxi Airport Gdańsk',
  url: 'https://taxiairportgdansk.com',
  ogImage: 'https://taxiairportgdansk.com/og-image.png',
  logo: 'https://taxiairportgdansk.com/og-image.png',
  image: 'https://taxiairportgdansk.com/og-image.png',
  sameAs:
    sameAsFromEnv.length > 0
      ? sameAsFromEnv
      : [
          'https://wa.me/48694347548',
          'https://www.google.com/maps/search/?api=1&query=Taxi+Airport+Gda%C5%84sk',
        ],
};

export const locales = ['en', 'pl', 'de', 'fi', 'no', 'sv', 'da'];

const localeHreflangMap = {
  en: ['en', 'en-GB'],
  pl: ['pl', 'pl-PL'],
  de: ['de', 'de-DE'],
  fi: ['fi', 'fi-FI'],
  no: ['no', 'nb-NO'],
  sv: ['sv', 'sv-SE'],
  da: ['da', 'da-DK'],
};

export const routeSlugs = {
  en: {
    airportTaxi: 'gdansk-airport-taxi',
    airportSopot: 'gdansk-airport-to-sopot',
    airportGdynia: 'gdansk-airport-to-gdynia',
    countryLanding: 'gdansk-airport-transfer-uk',
    taxiGdanskCity: 'taxi-gdansk',
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
    countryLanding: 'transfer-lotnisko-gdansk',
    taxiGdanskCity: 'taxi-gdansk',
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
    countryLanding: 'gdansk-airport-transfer-deutschland',
    taxiGdanskCity: 'taxi-gdansk',
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
    countryLanding: 'gdansk-lentokenttakuljetus-suomi',
    taxiGdanskCity: 'taxi-gdansk',
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
    countryLanding: 'gdansk-flyplasstransport-norge',
    taxiGdanskCity: 'taxi-gdansk',
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
    countryLanding: 'gdansk-flygplatstransfer-sverige',
    taxiGdanskCity: 'taxi-gdansk',
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
    countryLanding: 'gdansk-lufthavn-transfer-danmark',
    taxiGdanskCity: 'taxi-gdansk',
    orderAirportGdansk: 'booking-gdansk-lufthavn',
    orderAirportSopot: 'booking-gdansk-lufthavn-sopot',
    orderAirportGdynia: 'booking-gdansk-lufthavn-gdynia',
    orderCustom: 'booking-tilpasset',
    pricing: 'priser',
    cookies: 'cookiepolitik',
    privacy: 'privatlivspolitik',
  },
};

const countryAirportRoutes = {
  en: [
    { slug: 'gdansk-airport-transfer-aberdeen', city: 'Aberdeen', airport: 'Aberdeen (ABZ)', country: 'United Kingdom' },
    { slug: 'gdansk-airport-transfer-belfast', city: 'Belfast', airport: 'Belfast (BFS)', country: 'United Kingdom' },
    { slug: 'gdansk-airport-transfer-bristol', city: 'Bristol', airport: 'Bristol (BRS)', country: 'United Kingdom' },
    { slug: 'gdansk-airport-transfer-birmingham', city: 'Birmingham', airport: 'Birmingham (BHX)', country: 'United Kingdom' },
    { slug: 'gdansk-airport-transfer-edinburgh', city: 'Edinburgh', airport: 'Edinburgh (EDI)', country: 'United Kingdom' },
    { slug: 'gdansk-airport-transfer-leeds-bradford', city: 'Leeds', airport: 'Leeds Bradford (LBA)', country: 'United Kingdom' },
    { slug: 'gdansk-airport-transfer-liverpool', city: 'Liverpool', airport: 'Liverpool (LPL)', country: 'United Kingdom' },
    { slug: 'gdansk-airport-transfer-london-luton', city: 'London', airport: 'London Luton (LTN)', country: 'United Kingdom' },
    { slug: 'gdansk-airport-transfer-london-stansted', city: 'London', airport: 'London Stansted (STN)', country: 'United Kingdom' },
    { slug: 'gdansk-airport-transfer-manchester', city: 'Manchester', airport: 'Manchester (MAN)', country: 'United Kingdom' },
  ],
  de: [
    { slug: 'gdansk-flughafentransfer-dortmund', city: 'Dortmund', airport: 'Dortmund (DTM)', country: 'Deutschland' },
    { slug: 'gdansk-flughafentransfer-frankfurt', city: 'Frankfurt', airport: 'Frankfurt (FRA)', country: 'Deutschland' },
    { slug: 'gdansk-flughafentransfer-hamburg', city: 'Hamburg', airport: 'Hamburg (HAM)', country: 'Deutschland' },
    { slug: 'gdansk-flughafentransfer-munchen', city: 'München', airport: 'München (MUC)', country: 'Deutschland' },
  ],
  no: [
    { slug: 'gdansk-flyplasstransport-alesund', city: 'Ålesund', airport: 'Ålesund (AES)', country: 'Norge' },
    { slug: 'gdansk-flyplasstransport-bergen', city: 'Bergen', airport: 'Bergen (BGO)', country: 'Norge' },
    { slug: 'gdansk-flyplasstransport-haugesund', city: 'Haugesund', airport: 'Haugesund (HAU)', country: 'Norge' },
    { slug: 'gdansk-flyplasstransport-oslo-gardermoen', city: 'Oslo', airport: 'Oslo Gardermoen (OSL)', country: 'Norge' },
    { slug: 'gdansk-flyplasstransport-oslo-torp', city: 'Oslo', airport: 'Oslo Torp (TRF)', country: 'Norge' },
    { slug: 'gdansk-flyplasstransport-stavanger', city: 'Stavanger', airport: 'Stavanger (SVG)', country: 'Norge' },
    { slug: 'gdansk-flyplasstransport-tromso', city: 'Tromsø', airport: 'Tromsø (TOS)', country: 'Norge' },
    { slug: 'gdansk-flyplasstransport-trondheim', city: 'Trondheim', airport: 'Trondheim (TRD)', country: 'Norge' },
  ],
  sv: [
    { slug: 'gdansk-flygplatstransfer-goteborg', city: 'Göteborg', airport: 'Göteborg (GOT)', country: 'Sverige' },
    { slug: 'gdansk-flygplatstransfer-malmo', city: 'Malmö', airport: 'Malmö (MMX)', country: 'Sverige' },
    { slug: 'gdansk-flygplatstransfer-skelleftea', city: 'Skellefteå', airport: 'Skellefteå (SFT)', country: 'Sverige' },
    { slug: 'gdansk-flygplatstransfer-stockholm-arlanda', city: 'Stockholm', airport: 'Stockholm Arlanda (ARN)', country: 'Sverige' },
  ],
  da: [
    { slug: 'gdansk-lufthavn-transfer-aarhus', city: 'Aarhus', airport: 'Aarhus (AAR)', country: 'Danmark' },
    { slug: 'gdansk-lufthavn-transfer-billund', city: 'Billund', airport: 'Billund (BLL)', country: 'Danmark' },
    { slug: 'gdansk-lufthavn-transfer-copenhagen', city: 'København', airport: 'København (CPH)', country: 'Danmark' },
  ],
  fi: [
    { slug: 'gdansk-lentokenttakuljetus-helsinki', city: 'Helsinki', airport: 'Helsinki (HEL)', country: 'Suomi' },
    { slug: 'gdansk-lentokenttakuljetus-turku', city: 'Turku', airport: 'Turku (TKU)', country: 'Suomi' },
  ],
};

export const countryAirportSlugsByLocale = Object.fromEntries(
  Object.entries(countryAirportRoutes).map(([locale, entries]) => [locale, entries.map((entry) => entry.slug)])
);

const cityRouteRoutes = {
  pl: [
    { slug: 'taxi-lotnisko-gdansk-slupsk', destination: 'Słupsk' },
    { slug: 'taxi-lotnisko-gdansk-malbork', destination: 'Malbork' },
    { slug: 'taxi-lotnisko-gdansk-olsztyn', destination: 'Olsztyn' },
    { slug: 'taxi-lotnisko-gdansk-starogard-gdanski', destination: 'Starogard Gdański' },
    { slug: 'taxi-lotnisko-gdansk-wladyslawowo', destination: 'Władysławowo' },
    { slug: 'taxi-lotnisko-gdansk-hel', destination: 'Hel' },
    { slug: 'taxi-lotnisko-gdansk-ostroda', destination: 'Ostróda' },
    { slug: 'taxi-lotnisko-gdansk-wejherowo', destination: 'Wejherowo' },
    { slug: 'taxi-lotnisko-gdansk-rumia', destination: 'Rumia' },
    { slug: 'taxi-lotnisko-gdansk-reda', destination: 'Reda' },
  ],
};

export const cityRouteSlugsByLocale = Object.fromEntries(
  Object.entries(cityRouteRoutes).map(([locale, entries]) => [locale, entries.map((entry) => entry.slug)])
);

const getCountryAirportRoute = (locale, slug) =>
  (countryAirportRoutes[locale] ?? []).find((entry) => entry.slug === slug) ?? null;

const getCityRoute = (locale, slug) =>
  (cityRouteRoutes[locale] ?? []).find((entry) => entry.slug === slug) ?? null;

const navLabels = {
  en: {
    home: 'Home',
    pricing: 'Pricing',
    airportTaxi: 'Gdansk Airport Taxi',
    airportSopot: 'Airport ↔ Sopot',
    airportGdynia: 'Airport ↔ Gdynia',
    countryLanding: 'Gdansk Airport Transfer for UK',
    taxiGdanskCity: 'Taxi Gdansk',
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
    countryLanding: 'Transfer lotniskowy Gdańsk',
    taxiGdanskCity: 'Taxi Gdańsk',
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
    countryLanding: 'Flughafentransfer Gdańsk (DE)',
    taxiGdanskCity: 'Taxi Gdańsk',
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
    countryLanding: 'Gdańsk lentokenttäkuljetus',
    taxiGdanskCity: 'Taxi Gdańsk',
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
    countryLanding: 'Flyplasstransport Gdańsk',
    taxiGdanskCity: 'Taxi Gdańsk',
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
    countryLanding: 'Flygplatstransfer Gdańsk',
    taxiGdanskCity: 'Taxi Gdańsk',
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
    countryLanding: 'Lufthavnstransfer Gdańsk',
    taxiGdanskCity: 'Taxi Gdańsk',
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
    taxiGdanskCity: {
      title: 'Taxi Gdańsk | Taxi Airport Gdańsk',
      description:
        'Taxi Gdańsk with fixed prices, 24/7 availability, and fast confirmation. Book airport and city transfers in Gdańsk.',
    },
    countryLanding: {
      title: 'Gdansk Airport Transfer for UK Travelers | Taxi Airport Gdańsk',
      description:
        'Private airport transfer in Gdansk for UK travelers. Fixed prices, 24/7 pickup, flight tracking, and fast confirmation.',
    },
    orderAirportGdansk: {
      title: 'Taxi Gdańsk Flughafen buchen | Taxi Airport Gdańsk',
      description:
        'Direkte Buchung für Transfers vom Flughafen Gdańsk ins Stadtzentrum. Festpreise, 24/7 Service und schnelle Bestätigung.',
    },
    orderAirportSopot: {
      title: 'Taxi Gdańsk Flughafen → Sopot buchen | Taxi Airport Gdańsk',
      description:
        'Buchen Sie Ihren Transfer vom Flughafen Gdańsk nach Sopot mit Festpreis und schneller Bestätigung.',
    },
    orderAirportGdynia: {
      title: 'Taxi Gdańsk Flughafen → Gdynia buchen | Taxi Airport Gdańsk',
      description:
        'Reservieren Sie ein Taxi vom Flughafen Gdańsk nach Gdynia. Festpreise, professionelle Fahrer, 24/7.',
    },
    orderCustom: {
      title: 'Individuellen Transfer buchen | Taxi Airport Gdańsk',
      description:
        'Fordern Sie ein individuelles Transferangebot für Gdańsk, Sopot oder Gdynia an. Schnelle Antwort und flexible Preise.',
    },
    pricing: {
      title: 'Preise Taxi Gdańsk Flughafen | Taxi Airport Gdańsk',
      description:
        'Sehen Sie Festpreise für Flughafentransfers nach Gdańsk, Sopot und Gdynia inkl. Tag/Nacht-Tarifen und individuellen Strecken.',
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
    taxiGdanskCity: {
      title: 'Taxi Gdańsk | Taxi Airport Gdańsk',
      description:
        'Taxi Gdańsk: stałe ceny, dostępność 24/7 i szybkie potwierdzenie. Transfery lotniskowe i miejskie w Gdańsku.',
    },
    countryLanding: {
      title: 'Transfer lotniskowy Gdańsk dla podróżnych z zagranicy | Taxi Airport Gdańsk',
      description:
        'Transfer z lotniska Gdańsk dla podróżnych z zagranicy. Stałe ceny, odbiór 24/7 i szybkie potwierdzenie.',
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
    taxiGdanskCity: {
      title: 'Taxi Danzig (Gdańsk) | Taxi Airport Gdańsk',
      description:
        'Taxi in Danzig (Gdańsk) mit Festpreisen, 24/7 Verfügbarkeit und schneller Bestätigung. Flughafen- und Stadttransfers.',
    },
    countryLanding: {
      title: 'Flughafentransfer Gdańsk für Deutschland | Taxi Airport Gdańsk',
      description:
        'Privater Flughafentransfer Gdańsk für Reisende aus Deutschland. Festpreise, 24/7 Abholung und schnelle Bestätigung.',
    },
    orderAirportGdansk: {
      title: 'Varaa Gdańskin lentokenttätaksi | Taxi Airport Gdańsk',
      description:
        'Suora varauslomake kuljetuksiin Gdańskin lentokentältä keskustaan. Kiinteät hinnat, 24/7 palvelu ja nopea vahvistus.',
    },
    orderAirportSopot: {
      title: 'Varaa taksi Gdańskin lentokenttä → Sopot | Taxi Airport Gdańsk',
      description:
        'Varaa lentokenttäkuljetus Gdańskista Sopotiin kiinteällä hinnalla ja nopealla vahvistuksella.',
    },
    orderAirportGdynia: {
      title: 'Varaa taksi Gdańskin lentokenttä → Gdynia | Taxi Airport Gdańsk',
      description:
        'Varaa taksi Gdańskin lentokentältä Gdyniaan. Kiinteät hinnat, ammattikuljettajat, 24/7.',
    },
    orderCustom: {
      title: 'Varaa räätälöity kuljetus | Taxi Airport Gdańsk',
      description:
        'Pyydä tarjous räätälöidystä kuljetuksesta Gdańskissa, Sopotissa tai Gdyniassa. Nopea vastaus ja joustava hinnoittelu.',
    },
    pricing: {
      title: 'Gdańskin lentokenttätaksin hinnat | Taxi Airport Gdańsk',
      description:
        'Katso kiinteät hinnat lentokenttäkuljetuksiin Gdańskiin, Sopotiin ja Gdyniaan, mukaan lukien päivä/yötariffit ja yksilöidyt reitit.',
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
    taxiGdanskCity: {
      title: 'Taxi Gdańskissa | Taxi Airport Gdańsk',
      description:
        'Taxi Gdańskissa kiinteillä hinnoilla, 24/7 saatavuudella ja nopealla vahvistuksella. Lentokenttä- ja kaupunkikuljetukset.',
    },
    countryLanding: {
      title: 'Gdańskin lentokenttäkuljetus Suomesta | Taxi Airport Gdańsk',
      description:
        'Yksityinen lentokenttäkuljetus Gdańskissa suomalaisille. Kiinteät hinnat, 24/7 nouto ja nopea vahvistus.',
    },
    orderAirportGdansk: {
      title: 'Bestill taxi Gdańsk flyplass | Taxi Airport Gdańsk',
      description:
        'Direkte bestillingsskjema for transfer fra Gdańsk flyplass til sentrum. Faste priser, 24/7 service og rask bekreftelse.',
    },
    orderAirportSopot: {
      title: 'Bestill taxi Gdańsk flyplass → Sopot | Taxi Airport Gdańsk',
      description:
        'Bestill flyplasstransport fra Gdańsk til Sopot med faste priser og rask bekreftelse.',
    },
    orderAirportGdynia: {
      title: 'Bestill taxi Gdańsk flyplass → Gdynia | Taxi Airport Gdańsk',
      description:
        'Reserver taxi fra Gdańsk flyplass til Gdynia. Faste priser, profesjonelle sjåfører, 24/7.',
    },
    orderCustom: {
      title: 'Bestill tilpasset transfer | Taxi Airport Gdańsk',
      description:
        'Be om tilbud på tilpasset transfer i Gdańsk, Sopot eller Gdynia. Rask respons og fleksibel prising.',
    },
    pricing: {
      title: 'Priser for taxi Gdańsk flyplass | Taxi Airport Gdańsk',
      description:
        'Se faste priser for flyplasstransport til Gdańsk, Sopot og Gdynia, inkludert dag-/nattetariff og tilpassede ruter.',
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
    taxiGdanskCity: {
      title: 'Taxi i Gdańsk | Taxi Airport Gdańsk',
      description:
        'Taxi i Gdańsk med faste priser, 24/7 tilgjengelighet og rask bekreftelse. Flyplass- og bytransport.',
    },
    countryLanding: {
      title: 'Flyplasstransport Gdańsk for Norge | Taxi Airport Gdańsk',
      description:
        'Privat flyplasstransport i Gdańsk for reisende fra Norge. Faste priser, døgnåpen henting og rask bekreftelse.',
    },
    orderAirportGdansk: {
      title: 'Boka taxi Gdańsk flygplats | Taxi Airport Gdańsk',
      description:
        'Direkt bokningsformulär för transfer från Gdańsk flygplats till centrum. Fasta priser, 24/7 service och snabb bekräftelse.',
    },
    orderAirportSopot: {
      title: 'Boka taxi Gdańsk flygplats → Sopot | Taxi Airport Gdańsk',
      description:
        'Boka flygplatstransfer från Gdańsk till Sopot med fasta priser och snabb bekräftelse.',
    },
    orderAirportGdynia: {
      title: 'Boka taxi Gdańsk flygplats → Gdynia | Taxi Airport Gdańsk',
      description:
        'Reservera taxi från Gdańsk flygplats till Gdynia. Fasta priser, professionella förare, 24/7.',
    },
    orderCustom: {
      title: 'Boka anpassad transfer | Taxi Airport Gdańsk',
      description:
        'Begär offert för anpassad transfer i Gdańsk, Sopot eller Gdynia. Snabb återkoppling och flexibel prissättning.',
    },
    pricing: {
      title: 'Priser för taxi Gdańsk flygplats | Taxi Airport Gdańsk',
      description:
        'Se fasta priser för flygplatstransfer till Gdańsk, Sopot och Gdynia, inklusive dag-/nattaxa och anpassade rutter.',
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
    taxiGdanskCity: {
      title: 'Taxi i Gdańsk | Taxi Airport Gdańsk',
      description:
        'Taxi i Gdańsk med fasta priser, tillgänglighet dygnet runt och snabb bekräftelse. Flygplats- och stadstransfer.',
    },
    countryLanding: {
      title: 'Flygplatstransfer Gdańsk för Sverige | Taxi Airport Gdańsk',
      description:
        'Privat flygplatstransfer i Gdańsk för resenärer från Sverige. Fasta priser, 24/7 upphämtning och snabb bekräftelse.',
    },
    orderAirportGdansk: {
      title: 'Book taxi Gdańsk lufthavn | Taxi Airport Gdańsk',
      description:
        'Direkte bookingformular for transfer fra Gdańsk lufthavn til centrum. Faste priser, 24/7 service og hurtig bekræftelse.',
    },
    orderAirportSopot: {
      title: 'Book taxi Gdańsk lufthavn → Sopot | Taxi Airport Gdańsk',
      description:
        'Book din lufthavnstransfer fra Gdańsk til Sopot med faste priser og hurtig bekræftelse.',
    },
    orderAirportGdynia: {
      title: 'Book taxi Gdańsk lufthavn → Gdynia | Taxi Airport Gdańsk',
      description:
        'Reserver taxa fra Gdańsk lufthavn til Gdynia. Faste priser, professionelle chauffører, 24/7.',
    },
    orderCustom: {
      title: 'Book tilpasset transfer | Taxi Airport Gdańsk',
      description:
        'Anmod om tilbud på tilpasset transfer i Gdańsk, Sopot eller Gdynia. Hurtigt svar og fleksibel prissætning.',
    },
    pricing: {
      title: 'Priser for taxi Gdańsk lufthavn | Taxi Airport Gdańsk',
      description:
        'Se faste priser for lufthavnstransfer til Gdańsk, Sopot og Gdynia inkl. dag-/nattakster og specialruter.',
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
    taxiGdanskCity: {
      title: 'Taxi i Gdańsk | Taxi Airport Gdańsk',
      description:
        'Taxi i Gdańsk med faste priser, 24/7 tilgængelighed og hurtig bekræftelse. Lufthavns- og bytransfer.',
    },
    countryLanding: {
      title: 'Lufthavnstransfer Gdańsk for Danmark | Taxi Airport Gdańsk',
      description:
        'Privat lufthavnstransfer i Gdańsk for rejsende fra Danmark. Faste priser, 24/7 afhentning og hurtig bekræftelse.',
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
      description: 'Information om cookies hos Taxi Airport Gdańsk på dansk.',
    },
    privacy: {
      title: 'Privatlivspolitik | Taxi Airport Gdańsk',
      description: 'Privatlivsoplysninger for Taxi Airport Gdańsk.',
    },
  },
};

const airportMetaByLocale = {
  en: ({ city, airport }) => ({
    title: `${city} → Gdansk Airport Transfer (${airport}) | Taxi Airport Gdańsk`,
    description: `Private transfer from ${airport} to Gdańsk, Sopot, and Gdynia. Fixed prices, 24/7 pickup, fast confirmation.`,
  }),
  de: ({ city, airport }) => ({
    title: `${city} → Gdańsk Flughafentransfer (${airport}) | Taxi Airport Gdańsk`,
    description: `Privater Transfer von ${airport} nach Gdańsk, Sopot und Gdynia. Festpreise, 24/7 Abholung, schnelle Bestätigung.`,
  }),
  fi: ({ city, airport }) => ({
    title: `${city} → Gdańskin lentokenttäkuljetus (${airport}) | Taxi Airport Gdańsk`,
    description: `Yksityinen kuljetus ${airport}-lentoasemalta Gdańskiin, Sopotiin ja Gdyniaan. Kiinteät hinnat, 24/7 nouto, nopea vahvistus.`,
  }),
  no: ({ city, airport }) => ({
    title: `${city} → Flyplasstransport Gdańsk (${airport}) | Taxi Airport Gdańsk`,
    description: `Privat transport fra ${airport} til Gdańsk, Sopot og Gdynia. Faste priser, døgnåpen henting, rask bekreftelse.`,
  }),
  sv: ({ city, airport }) => ({
    title: `${city} → Flygplatstransfer Gdańsk (${airport}) | Taxi Airport Gdańsk`,
    description: `Privat transfer från ${airport} till Gdańsk, Sopot och Gdynia. Fasta priser, 24/7 upphämtning, snabb bekräftelse.`,
  }),
  da: ({ city, airport }) => ({
    title: `${city} → Lufthavnstransfer Gdańsk (${airport}) | Taxi Airport Gdańsk`,
    description: `Privat transfer fra ${airport} til Gdańsk, Sopot og Gdynia. Faste priser, afhentning 24/7, hurtig bekræftelse.`,
  }),
  pl: ({ city, airport }) => ({
    title: `${city} → Transfer lotniskowy Gdańsk (${airport}) | Taxi Airport Gdańsk`,
    description: `Prywatny transfer z ${airport} do Gdańska, Sopotu i Gdyni. Stałe ceny, odbiór 24/7, szybkie potwierdzenie.`,
  }),
};

const cityRouteMetaByLocale = {
  pl: ({ destination }) => ({
    title: `Cena taxi z lotniska Gdańsk do ${destination} | Taxi Airport Gdańsk`,
    description: `Sprawdź cenę przejazdu z lotniska Gdańsk do ${destination}. Kalkulator pokaże aktualną cenę w kilka sekund.`,
  }),
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

const pricingFaqByLocale = {
  en: [
    {
      question: 'Are these prices fixed?',
      answer:
        'Yes. Airport routes have fixed prices in both directions. Custom routes are priced individually.',
    },
    {
      question: 'When does the night rate apply?',
      answer: 'From 22:00 to 6:00 and on Sundays & public holidays.',
    },
    {
      question: 'Do you monitor flight delays?',
      answer: 'Yes. We track arrivals and adjust pickup time automatically.',
    },
    {
      question: 'Can I pay by card?',
      answer: 'Card payments are available on request. Invoices are available for business clients.',
    },
  ],
  pl: [
    {
      question: 'Czy te ceny są stałe?',
      answer:
        'Tak. Trasy lotniskowe mają stałe ceny w obie strony. Trasy niestandardowe są wyceniane indywidualnie.',
    },
    {
      question: 'Kiedy obowiązuje taryfa nocna?',
      answer: 'Od 22:00 do 6:00 oraz w niedziele i święta.',
    },
    {
      question: 'Czy monitorujecie opóźnienia lotów?',
      answer: 'Tak, śledzimy przyloty i dostosowujemy czas odbioru.',
    },
    {
      question: 'Czy można zapłacić kartą?',
      answer: 'Tak, płatność kartą na życzenie. Faktury dla firm.',
    },
  ],
  de: [
    {
      question: 'Sind diese Preise fest?',
      answer:
        'Ja. Flughafenrouten haben feste Preise in beide Richtungen. Individuelle Strecken werden individuell bepreist.',
    },
    {
      question: 'Wann gilt der Nachttarif?',
      answer: 'Von 22:00 bis 6:00 sowie an Sonn- und Feiertagen.',
    },
    {
      question: 'Überwacht ihr Flugverspätungen?',
      answer: 'Ja, wir verfolgen Ankünfte und passen die Abholzeit automatisch an.',
    },
    {
      question: 'Kann ich mit Karte zahlen?',
      answer: 'Kartenzahlung auf Anfrage. Rechnungen für Geschäftskunden verfügbar.',
    },
  ],
  fi: [
    {
      question: 'Ovatko hinnat kiinteät?',
      answer:
        'Kyllä. Lentokenttäreiteillä on kiinteät hinnat molempiin suuntiin. Mukautetut reitit hinnoitellaan yksilöllisesti.',
    },
    {
      question: 'Milloin yötaksa on voimassa?',
      answer: '22:00–6:00 sekä sunnuntaisin ja pyhäpäivinä.',
    },
    {
      question: 'Seuraatteko lennon viivästyksiä?',
      answer: 'Kyllä, seuraamme saapumisia ja säädämme noutoajan.',
    },
    {
      question: 'Voinko maksaa kortilla?',
      answer: 'Korttimaksu pyynnöstä. Laskut yritysasiakkaille.',
    },
  ],
  no: [
    {
      question: 'Er disse prisene faste?',
      answer: 'Ja. Flyplasstrasene har fastpris begge veier. Tilpassede ruter prises individuelt.',
    },
    {
      question: 'Når gjelder nattpris?',
      answer: 'Fra 22:00 til 6:00 og på søndager og helligdager.',
    },
    {
      question: 'Overvåker dere flyforsinkelser?',
      answer: 'Ja, vi følger ankomster og justerer hentetiden.',
    },
    {
      question: 'Kan jeg betale med kort?',
      answer: 'Kortbetaling på forespørsel. Faktura tilgjengelig for bedrifter.',
    },
  ],
  sv: [
    {
      question: 'Är dessa priser fasta?',
      answer:
        'Ja. Flygplatsrutterna har fasta priser åt båda håll. Anpassade rutter prissätts individuellt.',
    },
    {
      question: 'När gäller nattaxa?',
      answer: '22:00–6:00 samt söndagar och helgdagar.',
    },
    {
      question: 'Följer ni flygförseningar?',
      answer: 'Ja, vi följer ankomster och justerar upphämtningstiden.',
    },
    {
      question: 'Kan jag betala med kort?',
      answer: 'Kortbetalning på begäran. Faktura finns för företagskunder.',
    },
  ],
  da: [
    {
      question: 'Er priserne faste?',
      answer: 'Ja. Lufthavnsruter har fast pris begge veje. Tilpassede ruter prissættes individuelt.',
    },
    {
      question: 'Hvornår gælder natpris?',
      answer: 'Fra 22:00 til 6:00 samt på søndage og helligdage.',
    },
    {
      question: 'Overvåger I flyforsinkelser?',
      answer: 'Ja, vi følger ankomster og justerer afhentningstiden.',
    },
    {
      question: 'Kan jeg betale med kort?',
      answer: 'Kortbetaling efter aftale. Faktura til erhvervskunder.',
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
  if (getCountryAirportRoute(locale, slug)) return true;
  if (getCityRoute(locale, slug)) return true;
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
    const countryAirport = slug ? getCountryAirportRoute(locale, slug) : null;
    const cityRoute = slug ? getCityRoute(locale, slug) : null;
    const airportMetaBuilder = airportMetaByLocale[locale] ?? airportMetaByLocale.en;
    const cityRouteMetaBuilder = cityRouteMetaByLocale[locale] ?? cityRouteMetaByLocale.pl;
    const meta = cityRoute
        ? cityRouteMetaBuilder(cityRoute)
        : countryAirport
            ? airportMetaBuilder(countryAirport)
            : metaByLocale[locale]?.[routeKey ?? 'home'] ?? metaByLocale.en.home;

    const isRootHome = !localeFromPath && !slug; // dokładnie "/"

    const canonical = isRootHome
        ? `${site.url}/`
        : cityRoute
            ? `${site.url}/${locale}/${cityRoute.slug}`
            : countryAirport
                ? `${site.url}/${locale}/${countryAirport.slug}`
                : buildLocalizedUrl(locale, routeKey);

    const alternates = cityRoute
        ? (localeHreflangMap[locale] ?? [locale])
            .map((hreflang) => `<link rel="alternate" hreflang="${hreflang}" href="${canonical}">`)
            .join('')
        : countryAirport
            ? (localeHreflangMap[locale] ?? [locale])
                .map((hreflang) => `<link rel="alternate" hreflang="${hreflang}" href="${canonical}">`)
                .join('')
            : locales
                .flatMap((lang) => {
                    const href = routeKey
                        ? buildLocalizedUrl(lang, routeKey)
                        : `${site.url}/${lang}/`;
                    const hreflangs = localeHreflangMap[lang] ?? [lang];
                    return hreflangs.map(
                        (hreflang) => `<link rel="alternate" hreflang="${hreflang}" href="${href}">`
                    );
                })
                .join('');

    const xDefault = `<link rel="alternate" hreflang="x-default" href="${site.url}/${defaultLocale}/">`;
    const robots = isIndexablePath(urlPath) ? 'index,follow' : 'noindex,nofollow';

  const ogLocale = (localeHreflangMap[locale] ?? [locale])[0] ?? locale;
  const ogLocaleValue = ogLocale.replace('-', '_');
  const ogAlternateValues = Array.from(
    new Set(
      locales
        .flatMap((lang) => localeHreflangMap[lang] ?? [lang])
        .map((lang) => lang.replace('-', '_'))
        .filter((value) => value !== ogLocaleValue)
    )
  );

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TaxiService'],
    '@id': `${site.url}/#localbusiness`,
    name: site.name,
    url: `${site.url}/`,
    logo: site.logo,
    image: site.image,
    areaServed: ['Gdańsk', 'Sopot', 'Gdynia'],
    email: 'booking@taxiairportgdansk.com',
    priceRange: '$$',
    telephone: '+48694347548',
    paymentAccepted: ['Cash', 'Card', 'Apple Pay', 'Google Pay', 'Revolut'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gdańsk',
      addressCountry: 'PL',
    },
    openingHours: 'Mo-Su 00:00-23:59',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '54.3520',
      longitude: '18.6466',
    },
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
  };

  const serviceLabels = navLabels[locale] ?? navLabels.en;
  const serviceName = routeKey ? serviceLabels[routeKey] ?? meta.title : serviceLabels.airportTaxi;
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonical}#service`,
    name: serviceName,
    serviceType: serviceName,
    provider: {
      '@id': `${site.url}/#localbusiness`,
    },
    areaServed: [
      { '@type': 'City', name: 'Gdańsk' },
      { '@type': 'City', name: 'Sopot' },
      { '@type': 'City', name: 'Gdynia' },
      { '@type': 'Country', name: 'Poland' },
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: canonical,
      availableLanguage: localeHreflangMap[locale] ?? [locale],
    },
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

  const pricingFaq = pricingFaqByLocale[locale] ?? pricingFaqByLocale.en;
  const pricingFaqSchema =
    routeKey === 'pricing'
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: pricingFaq.map((entry) => ({
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
    { key: 'countryLanding', url: buildLocalizedUrl(locale, 'countryLanding') },
    { key: 'taxiGdanskCity', url: buildLocalizedUrl(locale, 'taxiGdanskCity') },
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

  const shouldIncludeBreadcrumbs = isIndexablePath(urlPath) && (routeKey || cityRoute);
  const cityRouteLabel = cityRoute ? `Taxi Gdańsk → ${cityRoute.destination}` : null;
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
            name: routeKey ? labels[routeKey] ?? meta.title : cityRouteLabel ?? meta.title,
            item: canonical,
          },
        ],
      }
    : null;

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
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
    `<meta property="og:locale" content="${ogLocaleValue}">`,
    ...ogAlternateValues.map(
      (value) => `<meta property="og:locale:alternate" content="${value}">`
    ),
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
    `<script type="application/ld+json">${JSON.stringify(serviceSchema)}</script>`,
    `<script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>`,
    `<script type="application/ld+json">${JSON.stringify(navigationSchema)}</script>`,
    breadcrumbSchema ? `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>` : '',
    faqSchema ? `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>` : '',
    pricingFaqSchema ? `<script type="application/ld+json">${JSON.stringify(pricingFaqSchema)}</script>` : '',
  ].join('');
};

export const buildNoscript = (urlPath) => {
  const locale = getLocaleFromPath(urlPath) ?? 'en';
  return metaByLocale[locale]?.noscript ?? metaByLocale.en.noscript;
};
