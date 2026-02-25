const sameAsFromEnv = (process.env.SEO_SAME_AS ?? '')
  .split(',')
  .map((item) => item.trim())
  .filter((item) => /^https?:\/\//.test(item));

const defaultLocale = 'en';

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
    blog: 'blog',
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
    blog: 'blog',
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
    blog: 'blog',
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
    blog: 'blog',
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
    blog: 'blog',
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
    blog: 'blog',
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
    blog: 'blog',
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
  pl: [
    { slug: 'transfer-lotnisko-gdansk-londyn-stansted', city: 'Londyn', airport: 'London Stansted (STN)', country: 'Wielka Brytania' },
    { slug: 'transfer-lotnisko-gdansk-londyn-luton', city: 'Londyn', airport: 'London Luton (LTN)', country: 'Wielka Brytania' },
    { slug: 'transfer-lotnisko-gdansk-manchester', city: 'Manchester', airport: 'Manchester (MAN)', country: 'Wielka Brytania' },
    { slug: 'transfer-lotnisko-gdansk-edynburg', city: 'Edynburg', airport: 'Edinburgh (EDI)', country: 'Wielka Brytania' },
    { slug: 'transfer-lotnisko-gdansk-dortmund', city: 'Dortmund', airport: 'Dortmund (DTM)', country: 'Niemcy' },
    { slug: 'transfer-lotnisko-gdansk-hamburg', city: 'Hamburg', airport: 'Hamburg (HAM)', country: 'Niemcy' },
    { slug: 'transfer-lotnisko-gdansk-oslo', city: 'Oslo', airport: 'Oslo Gardermoen (OSL)', country: 'Norwegia' },
    { slug: 'transfer-lotnisko-gdansk-sztokholm', city: 'Sztokholm', airport: 'Stockholm Arlanda (ARN)', country: 'Szwecja' },
    { slug: 'transfer-lotnisko-gdansk-kopenhaga', city: 'Kopenhaga', airport: 'København (CPH)', country: 'Dania' },
    { slug: 'transfer-lotnisko-gdansk-helsinki', city: 'Helsinki', airport: 'Helsinki (HEL)', country: 'Finlandia' },
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
  en: [
    { slug: 'gdansk-airport-taxi-malbork', destination: 'Malbork' },
    { slug: 'gdansk-airport-taxi-hel', destination: 'Hel' },
    { slug: 'gdansk-airport-taxi-wladyslawowo', destination: 'Władysławowo' },
    { slug: 'gdansk-airport-taxi-slupsk', destination: 'Słupsk' },
    { slug: 'gdansk-airport-taxi-olsztyn', destination: 'Olsztyn' },
    { slug: 'gdansk-airport-taxi-starogard', destination: 'Starogard Gdański' },
    { slug: 'gdansk-airport-taxi-ostroda', destination: 'Ostróda' },
    { slug: 'gdansk-airport-taxi-wejherowo', destination: 'Wejherowo' },
    { slug: 'gdansk-airport-taxi-rumia', destination: 'Rumia' },
    { slug: 'gdansk-airport-taxi-reda', destination: 'Reda' },
  ],
  de: [
    { slug: 'gdansk-flughafen-taxi-malbork', destination: 'Malbork' },
    { slug: 'gdansk-flughafen-taxi-hel', destination: 'Hel' },
    { slug: 'gdansk-flughafen-taxi-wladyslawowo', destination: 'Władysławowo' },
    { slug: 'gdansk-flughafen-taxi-slupsk', destination: 'Słupsk' },
    { slug: 'gdansk-flughafen-taxi-olsztyn', destination: 'Olsztyn' },
    { slug: 'gdansk-flughafen-taxi-starogard', destination: 'Starogard Gdański' },
    { slug: 'gdansk-flughafen-taxi-ostroda', destination: 'Ostróda' },
    { slug: 'gdansk-flughafen-taxi-wejherowo', destination: 'Wejherowo' },
    { slug: 'gdansk-flughafen-taxi-rumia', destination: 'Rumia' },
    { slug: 'gdansk-flughafen-taxi-reda', destination: 'Reda' },
  ],
  no: [
    { slug: 'gdansk-flyplass-taxi-malbork', destination: 'Malbork' },
    { slug: 'gdansk-flyplass-taxi-hel', destination: 'Hel' },
    { slug: 'gdansk-flyplass-taxi-wladyslawowo', destination: 'Władysławowo' },
    { slug: 'gdansk-flyplass-taxi-slupsk', destination: 'Słupsk' },
    { slug: 'gdansk-flyplass-taxi-olsztyn', destination: 'Olsztyn' },
    { slug: 'gdansk-flyplass-taxi-starogard', destination: 'Starogard Gdański' },
    { slug: 'gdansk-flyplass-taxi-ostroda', destination: 'Ostróda' },
    { slug: 'gdansk-flyplass-taxi-wejherowo', destination: 'Wejherowo' },
    { slug: 'gdansk-flyplass-taxi-rumia', destination: 'Rumia' },
    { slug: 'gdansk-flyplass-taxi-reda', destination: 'Reda' },
  ],
  sv: [
    { slug: 'gdansk-flygplats-taxi-malbork', destination: 'Malbork' },
    { slug: 'gdansk-flygplats-taxi-hel', destination: 'Hel' },
    { slug: 'gdansk-flygplats-taxi-wladyslawowo', destination: 'Władysławowo' },
    { slug: 'gdansk-flygplats-taxi-slupsk', destination: 'Słupsk' },
    { slug: 'gdansk-flygplats-taxi-olsztyn', destination: 'Olsztyn' },
    { slug: 'gdansk-flygplats-taxi-starogard', destination: 'Starogard Gdański' },
    { slug: 'gdansk-flygplats-taxi-ostroda', destination: 'Ostróda' },
    { slug: 'gdansk-flygplats-taxi-wejherowo', destination: 'Wejherowo' },
    { slug: 'gdansk-flygplats-taxi-rumia', destination: 'Rumia' },
    { slug: 'gdansk-flygplats-taxi-reda', destination: 'Reda' },
  ],
  da: [
    { slug: 'gdansk-lufthavn-taxi-malbork', destination: 'Malbork' },
    { slug: 'gdansk-lufthavn-taxi-hel', destination: 'Hel' },
    { slug: 'gdansk-lufthavn-taxi-wladyslawowo', destination: 'Władysławowo' },
    { slug: 'gdansk-lufthavn-taxi-slupsk', destination: 'Słupsk' },
    { slug: 'gdansk-lufthavn-taxi-olsztyn', destination: 'Olsztyn' },
    { slug: 'gdansk-lufthavn-taxi-starogard', destination: 'Starogard Gdański' },
    { slug: 'gdansk-lufthavn-taxi-ostroda', destination: 'Ostróda' },
    { slug: 'gdansk-lufthavn-taxi-wejherowo', destination: 'Wejherowo' },
    { slug: 'gdansk-lufthavn-taxi-rumia', destination: 'Rumia' },
    { slug: 'gdansk-lufthavn-taxi-reda', destination: 'Reda' },
  ],
  fi: [
    { slug: 'gdansk-lentokentta-taksi-malbork', destination: 'Malbork' },
    { slug: 'gdansk-lentokentta-taksi-hel', destination: 'Hel' },
    { slug: 'gdansk-lentokentta-taksi-wladyslawowo', destination: 'Władysławowo' },
    { slug: 'gdansk-lentokentta-taksi-slupsk', destination: 'Słupsk' },
    { slug: 'gdansk-lentokentta-taksi-olsztyn', destination: 'Olsztyn' },
    { slug: 'gdansk-lentokentta-taksi-starogard', destination: 'Starogard Gdański' },
    { slug: 'gdansk-lentokentta-taksi-ostroda', destination: 'Ostróda' },
    { slug: 'gdansk-lentokentta-taksi-wejherowo', destination: 'Wejherowo' },
    { slug: 'gdansk-lentokentta-taksi-rumia', destination: 'Rumia' },
    { slug: 'gdansk-lentokentta-taksi-reda', destination: 'Reda' },
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
    blog: 'Blog',
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
    blog: 'Blog',
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
    blog: 'Blog',
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
    blog: 'Blogi',
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
    blog: 'Blogg',
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
    blog: 'Blogg',
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
    blog: 'Blog',
  },
};

const metaByLocale = {
  en: {
    noscript:
      'Taxi Airport Gdańsk provides 24/7 airport transfers across Gdańsk, Sopot, and Gdynia. Fixed pricing, professional drivers, and fast confirmation. Contact: booking@taxiairportgdansk.com.',
    home: {
      title: 'Taxi Gdansk Airport | GDN Airport Transfer Service 24/7',
      description:
        'Book taxi from Gdansk airport to city center with fixed prices. GDN airport transfer service with 24/7 pickups, flight tracking, and fast confirmation. Taxi Airport Gdańsk.',
    },
    airportTaxi: {
      title: 'Gdansk Airport Taxi to City Center | Fixed Price Transfer',
      description:
        'Taxi from Gdansk airport (GDN) to city center and back. Fixed prices, meet & greet at arrivals, and quick confirmation. Book your Gdansk airport transfer now.',
    },
    airportSopot: {
      title: 'Gdansk Airport to Sopot Taxi | Fixed Price Transfer',
      description:
        'Taxi transfer from Gdansk airport to Sopot – fixed prices, flight tracking, and 24/7 service. Book GDN to Sopot transfer online.',
    },
    airportGdynia: {
      title: 'Gdansk Airport to Gdynia Taxi | Fixed Price Transfer',
      description:
        'Reliable taxi transfer from Gdansk airport to Gdynia. Fixed price, professional drivers, 24/7. Book GDN to Gdynia transfer.',
    },
    taxiGdanskCity: {
      title: 'Taxi Gdańsk | City & Airport Transfers | Taxi Airport Gdańsk',
      description:
        'Taxi Gdańsk with fixed prices, 24/7 availability, and fast confirmation. Airport transfers, city rides, and trips across the Tri-City area.',
    },
    countryLanding: {
      title: 'Gdansk Airport Transfer for UK Travelers | Taxi Airport Gdańsk',
      description:
        'Private airport transfer in Gdansk for UK travelers. Fixed prices, 24/7 pickup, flight tracking, and fast confirmation.',
    },
    orderAirportGdansk: {
      title: 'Book Gdansk Airport Taxi | Taxi Airport Gdańsk',
      description:
        'Book a transfer from Gdansk Airport to the city center. Fixed prices, 24/7 service, and fast confirmation.',
    },
    orderAirportSopot: {
      title: 'Book Gdansk Airport → Sopot Taxi | Taxi Airport Gdańsk',
      description:
        'Book your transfer from Gdansk Airport to Sopot with fixed pricing and fast confirmation.',
    },
    orderAirportGdynia: {
      title: 'Book Gdansk Airport → Gdynia Taxi | Taxi Airport Gdańsk',
      description:
        'Reserve a taxi from Gdansk Airport to Gdynia. Fixed prices, professional drivers, 24/7.',
    },
    orderCustom: {
      title: 'Book Custom Transfer | Taxi Airport Gdańsk',
      description:
        'Request a custom transfer quote for Gdansk, Sopot, or Gdynia. Fast response and flexible pricing.',
    },
    pricing: {
      title: 'Gdansk Airport Taxi Prices & Rates | Taxi Airport Gdańsk',
      description:
        'Fixed prices for GDN airport transfers to Gdansk, Sopot, and Gdynia. Day/night rates, pricing calculator, and custom route quotes.',
    },
    cookies: {
      title: 'Cookie Policy | Taxi Airport Gdańsk',
      description: 'Read how Taxi Airport Gdańsk uses cookies to keep bookings secure and improve the service.',
    },
    privacy: {
      title: 'Privacy Policy | Taxi Airport Gdańsk',
      description: 'Learn how Taxi Airport Gdańsk processes and protects your personal data.',
    },
    blog: {
      title: 'Blog | Taxi Airport Gdańsk',
      description: 'Tips, guides, and practical advice for traveling from Gdansk Airport. How to get to the city center, Sopot, Gdynia and more.',
    },
  },
  pl: {
    noscript:
      'Taxi Airport Gdańsk zapewnia całodobowe transfery lotniskowe w Gdańsku, Sopocie i Gdyni. Stałe ceny, profesjonalni kierowcy i szybkie potwierdzenie. Kontakt: booking@taxiairportgdansk.com.',
    home: {
      title: 'Taxi Lotnisko Gdańsk | Transfer z Lotniska Gdańsk 24/7',
      description:
        'Taxi lotnisko Gdańsk – transfer z lotniska Gdańsk i na lotnisko. Taxi na lotnisko Gdańsk ze stałą ceną, śledzenie lotu, szybkie potwierdzenie. Przewóz z lotniska Gdańsk 24/7.',
    },
    airportTaxi: {
      title: 'Taxi Lotnisko Gdańsk do Centrum | Stała Cena | Taxi Airport Gdańsk',
      description:
        'Taxi z lotniska Gdańsk do centrum i z centrum na lotnisko. Transfer lotnisko Gdańsk ze stałą ceną, powitanie na lotnisku, 24/7.',
    },
    airportSopot: {
      title: 'Transfer Lotnisko Gdańsk – Sopot | Taxi Stała Cena 24/7',
      description:
        'Taxi z lotniska Gdańsk do Sopotu – stała cena, śledzenie lotu i rezerwacja online. Transfer lotnisko Gdańsk Sopot.',
    },
    airportGdynia: {
      title: 'Transfer Lotnisko Gdańsk – Gdynia | Taxi Stała Cena 24/7',
      description:
        'Taxi z lotniska Gdańsk do Gdyni – stała cena, profesjonalni kierowcy, 24/7. Transfer lotnisko Gdańsk Gdynia.',
    },
    taxiGdanskCity: {
      title: 'Taxi Gdańsk | Przejazdy Miejskie i Lotniskowe | Taxi Airport Gdańsk',
      description:
        'Taxi Gdańsk: stałe ceny, dostępność 24/7 i szybkie potwierdzenie. Transfery lotniskowe, przejazdy po Trójmieście i taxi na lotnisko Gdańsk.',
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
      title: 'Cennik Taxi Lotnisko Gdańsk | Ceny Transferów | Taxi Airport Gdańsk',
      description:
        'Stałe ceny taxi z lotniska Gdańsk do centrum, Sopotu i Gdyni. Kalkulator cen, taryfy dzienne i nocne. Ile kosztuje taxi z lotniska Gdańsk?',
    },
    cookies: {
      title: 'Polityka Cookies | Taxi Airport Gdańsk',
      description: 'Dowiedz się, jak Taxi Airport Gdańsk używa cookies, by chronić rezerwacje.',
    },
    privacy: {
      title: 'Polityka Prywatności | Taxi Airport Gdańsk',
      description: 'Sprawdź, jak Taxi Airport Gdańsk przetwarza i chroni dane osobowe.',
    },
    blog: {
      title: 'Blog | Taxi Airport Gdańsk',
      description: 'Porady, przewodniki i praktyczne informacje o podróżowaniu z lotniska Gdańsk. Jak dojechać do centrum, Sopotu, Gdyni i więcej.',
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
      title: 'Taxi Gdańsk Flughafen buchen | Taxi Airport Gdańsk',
      description:
        'Direktes Buchungsformular für Transfers vom Flughafen Gdańsk ins Zentrum. Festpreise, 24/7 Service und schnelle Bestätigung.',
    },
    orderAirportSopot: {
      title: 'Taxi Gdańsk Flughafen → Sopot buchen | Taxi Airport Gdańsk',
      description:
        'Buchen Sie Ihren Flughafentransfer von Gdańsk nach Sopot mit Festpreis und schneller Bestätigung.',
    },
    orderAirportGdynia: {
      title: 'Taxi Gdańsk Flughafen → Gdynia buchen | Taxi Airport Gdańsk',
      description:
        'Reservieren Sie ein Taxi vom Flughafen Gdańsk nach Gdynia. Festpreise, professionelle Fahrer, 24/7.',
    },
    orderCustom: {
      title: 'Individuellen Transfer buchen | Taxi Airport Gdańsk',
      description:
        'Fordern Sie ein Angebot für einen individuellen Transfer in Gdańsk, Sopot oder Gdynia an. Schnelle Antwort und flexible Preise.',
    },
    pricing: {
      title: 'Preise Taxi Gdańsk Flughafen | Taxi Airport Gdańsk',
      description:
        'Sehen Sie feste Preise für Flughafentransfers nach Gdańsk, Sopot und Gdynia inklusive Tag-/Nachttarife und individuelle Routen.',
    },
    cookies: {
      title: 'Cookie-Richtlinie | Taxi Airport Gdańsk',
      description: 'Informationen zu Cookies bei Taxi Airport Gdańsk.',
    },
    privacy: {
      title: 'Datenschutz | Taxi Airport Gdańsk',
      description: 'Details zum Datenschutz bei Taxi Airport Gdańsk.',
    },
    blog: {
      title: 'Blog | Taxi Airport Gdańsk',
      description: 'Tipps, Reiseführer und praktische Ratschläge für die Reise vom Flughafen Gdańsk. Wie Sie ins Zentrum, nach Sopot, Gdynia und mehr gelangen.',
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
      title: 'Evästekäytäntö | Taxi Airport Gdańsk',
      description: 'Tietoa evästeiden käytöstä Taxi Airport Gdańsk -palvelussa.',
    },
    privacy: {
      title: 'Tietosuoja | Taxi Airport Gdańsk',
      description: 'Tietosuojatiedot Taxi Airport Gdańsk -palvelusta.',
    },
    blog: {
      title: 'Blogi | Taxi Airport Gdańsk',
      description: 'Vinkkejä, oppaita ja käytännön neuvoja matkustamiseen Gdańskin lentokentältä. Kuinka päästä keskustaan, Sopotiin, Gdyniaan ja muualle.',
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
      title: 'Informasjonskapsler | Taxi Airport Gdańsk',
      description: 'Slik bruker Taxi Airport Gdańsk informasjonskapsler.',
    },
    privacy: {
      title: 'Personvern | Taxi Airport Gdańsk',
      description: 'Personverninformasjon for Taxi Airport Gdańsk.',
    },
    blog: {
      title: 'Blogg | Taxi Airport Gdańsk',
      description: 'Tips, guider og praktiske råd for reise fra Gdańsk flyplass. Hvordan komme til sentrum, Sopot, Gdynia og mer.',
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
      title: 'Cookiepolicy | Taxi Airport Gdańsk',
      description: 'Information om cookies hos Taxi Airport Gdańsk på svenska.',
    },
    privacy: {
      title: 'Integritetspolicy | Taxi Airport Gdańsk',
      description: 'Integritetsinformation för Taxi Airport Gdańsk.',
    },
    blog: {
      title: 'Blogg | Taxi Airport Gdańsk',
      description: 'Tips, guider och praktiska råd för resor från Gdańsk flygplats. Hur du tar dig till centrum, Sopot, Gdynia och mer.',
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
      title: 'Cookiepolitik | Taxi Airport Gdańsk',
      description: 'Information om cookies hos Taxi Airport Gdańsk på dansk.',
    },
    privacy: {
      title: 'Privatlivspolitik | Taxi Airport Gdańsk',
      description: 'Privatlivsoplysninger for Taxi Airport Gdańsk.',
    },
    blog: {
      title: 'Blog | Taxi Airport Gdańsk',
      description: 'Tips, guider og praktiske råd til rejser fra Gdańsk lufthavn. Sådan kommer du til centrum, Sopot, Gdynia og mere.',
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
  en: ({ destination }) => ({
    title: `Taxi Gdansk Airport to ${destination} | Price & Booking`,
    description: `Check the current taxi price from Gdansk Airport (GDN) to ${destination}. Fixed prices, 24/7 service, fast confirmation.`,
  }),
  de: ({ destination }) => ({
    title: `Taxi Flughafen Gdańsk nach ${destination} | Preis & Buchung`,
    description: `Aktueller Taxipreis vom Flughafen Gdańsk nach ${destination}. Festpreise, 24/7 Service, schnelle Bestätigung.`,
  }),
  no: ({ destination }) => ({
    title: `Taxi Gdańsk flyplass til ${destination} | Pris & bestilling`,
    description: `Sjekk gjeldende taxipris fra Gdańsk flyplass til ${destination}. Faste priser, 24/7 service, rask bekreftelse.`,
  }),
  sv: ({ destination }) => ({
    title: `Taxi Gdańsk flygplats till ${destination} | Pris & bokning`,
    description: `Kolla aktuellt taxipris från Gdańsk flygplats till ${destination}. Fasta priser, 24/7 service, snabb bekräftelse.`,
  }),
  da: ({ destination }) => ({
    title: `Taxa Gdańsk lufthavn til ${destination} | Pris & booking`,
    description: `Tjek den aktuelle taxapris fra Gdańsk lufthavn til ${destination}. Faste priser, 24/7 service, hurtig bekræftelse.`,
  }),
  fi: ({ destination }) => ({
    title: `Taksi Gdańskin lentokenttä – ${destination} | Hinta & varaus`,
    description: `Tarkista taksihinta Gdańskin lentokentältä kohteeseen ${destination}. Kiinteät hinnat, 24/7 palvelu, nopea vahvistus.`,
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
  if (!routeKey) {
    return `${site.url}/${locale}/`;
  }
  return `${site.url}/${locale}/${routeSlugs[locale][routeKey]}`;
};

export const buildRootUrl = (routeKey) => {
    if (!routeKey) return `${site.url}/`;
    // dla stron typu /gdansk-airport-taxi bez języka nie masz routingu,
    // więc root obsługuje tylko home:
    return `${site.url}/`;
};

const isIndexablePath = (urlPath) => {
  if (urlPath.includes('/admin')) return false;
  if (urlPath === '/') return false;
  const nonIndexableRouteKeys = new Set([]);
  const pathParts = urlPath.replace(/\/$/, '').split('/').filter(Boolean);
  const localeFromPath = getLocaleFromPath(urlPath);
  const locale = localeFromPath ?? defaultLocale;
  const slug = localeFromPath ? (pathParts[1] ?? '') : (pathParts[0] ?? '');
  if (!slug) return true;
  if (!localeFromPath) return false;
  const routeKey = getRouteKeyFromSlug(locale, slug);
  if (routeKey && nonIndexableRouteKeys.has(routeKey)) return false;
  if (getCountryAirportRoute(locale, slug)) return true;
  if (getCityRoute(locale, slug)) return true;
  if (routeKey === 'blog' && pathParts.length >= 3) return true;
  return Boolean(routeKey);
};

export const getHtmlLang = (urlPath) => getLocaleFromPath(urlPath) ?? defaultLocale;

export const buildSeoTags = (urlPath) => {
    const localeFromPath = getLocaleFromPath(urlPath);
    const locale = localeFromPath ?? defaultLocale;

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
        ? buildLocalizedUrl(defaultLocale, null)
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
                    const href = buildLocalizedUrl(lang, routeKey);
                    const hreflangs = localeHreflangMap[lang] ?? [lang];
                    return hreflangs.map(
                        (hreflang) => `<link rel="alternate" hreflang="${hreflang}" href="${href}">`
                    );
                })
                .join('');

    const xDefaultHref = cityRoute || countryAirport
        ? canonical
        : buildLocalizedUrl(defaultLocale, routeKey);
    const xDefault = `<link rel="alternate" hreflang="x-default" href="${xDefaultHref}">`;
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: process.env.VITE_GOOGLE_REVIEWS_RATING || '5.0',
      reviewCount: process.env.VITE_GOOGLE_REVIEWS_COUNT || '50',
      bestRating: '5',
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
    `<meta name="geo.region" content="PL-PM">`,
    `<meta name="geo.placename" content="Gdańsk">`,
    `<meta name="geo.position" content="54.3520;18.6466">`,
    `<meta name="ICBM" content="54.3520, 18.6466">`,
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
  const locale = getLocaleFromPath(urlPath) ?? defaultLocale;
  return metaByLocale[locale]?.noscript ?? metaByLocale.en.noscript;
};
