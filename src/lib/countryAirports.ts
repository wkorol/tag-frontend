export type CountryAirport = {
  slug: string;
  city: string;
  airport: string;
};

type CountryAirportsConfig = {
  country: string;
  airports: CountryAirport[];
};

const countryAirportsByLocale: Record<string, CountryAirportsConfig> = {
  en: {
    country: 'United Kingdom',
    airports: [
      { slug: 'gdansk-airport-transfer-aberdeen', city: 'Aberdeen', airport: 'Aberdeen (ABZ)' },
      { slug: 'gdansk-airport-transfer-belfast', city: 'Belfast', airport: 'Belfast (BFS)' },
      { slug: 'gdansk-airport-transfer-bristol', city: 'Bristol', airport: 'Bristol (BRS)' },
      { slug: 'gdansk-airport-transfer-birmingham', city: 'Birmingham', airport: 'Birmingham (BHX)' },
      { slug: 'gdansk-airport-transfer-edinburgh', city: 'Edinburgh', airport: 'Edinburgh (EDI)' },
      { slug: 'gdansk-airport-transfer-leeds-bradford', city: 'Leeds', airport: 'Leeds Bradford (LBA)' },
      { slug: 'gdansk-airport-transfer-liverpool', city: 'Liverpool', airport: 'Liverpool (LPL)' },
      { slug: 'gdansk-airport-transfer-london-luton', city: 'London', airport: 'London Luton (LTN)' },
      { slug: 'gdansk-airport-transfer-london-stansted', city: 'London', airport: 'London Stansted (STN)' },
      { slug: 'gdansk-airport-transfer-manchester', city: 'Manchester', airport: 'Manchester (MAN)' },
    ],
  },
  de: {
    country: 'Deutschland',
    airports: [
      { slug: 'gdansk-flughafentransfer-dortmund', city: 'Dortmund', airport: 'Dortmund (DTM)' },
      { slug: 'gdansk-flughafentransfer-frankfurt', city: 'Frankfurt', airport: 'Frankfurt (FRA)' },
      { slug: 'gdansk-flughafentransfer-hamburg', city: 'Hamburg', airport: 'Hamburg (HAM)' },
      { slug: 'gdansk-flughafentransfer-munchen', city: 'München', airport: 'München (MUC)' },
    ],
  },
  no: {
    country: 'Norge',
    airports: [
      { slug: 'gdansk-flyplasstransport-alesund', city: 'Ålesund', airport: 'Ålesund (AES)' },
      { slug: 'gdansk-flyplasstransport-bergen', city: 'Bergen', airport: 'Bergen (BGO)' },
      { slug: 'gdansk-flyplasstransport-haugesund', city: 'Haugesund', airport: 'Haugesund (HAU)' },
      { slug: 'gdansk-flyplasstransport-oslo-gardermoen', city: 'Oslo', airport: 'Oslo Gardermoen (OSL)' },
      { slug: 'gdansk-flyplasstransport-oslo-torp', city: 'Oslo', airport: 'Oslo Torp (TRF)' },
      { slug: 'gdansk-flyplasstransport-stavanger', city: 'Stavanger', airport: 'Stavanger (SVG)' },
      { slug: 'gdansk-flyplasstransport-tromso', city: 'Tromsø', airport: 'Tromsø (TOS)' },
      { slug: 'gdansk-flyplasstransport-trondheim', city: 'Trondheim', airport: 'Trondheim (TRD)' },
    ],
  },
  sv: {
    country: 'Sverige',
    airports: [
      { slug: 'gdansk-flygplatstransfer-goteborg', city: 'Göteborg', airport: 'Göteborg (GOT)' },
      { slug: 'gdansk-flygplatstransfer-malmo', city: 'Malmö', airport: 'Malmö (MMX)' },
      { slug: 'gdansk-flygplatstransfer-skelleftea', city: 'Skellefteå', airport: 'Skellefteå (SFT)' },
      { slug: 'gdansk-flygplatstransfer-stockholm-arlanda', city: 'Stockholm', airport: 'Stockholm Arlanda (ARN)' },
    ],
  },
  da: {
    country: 'Danmark',
    airports: [
      { slug: 'gdansk-lufthavn-transfer-aarhus', city: 'Aarhus', airport: 'Aarhus (AAR)' },
      { slug: 'gdansk-lufthavn-transfer-billund', city: 'Billund', airport: 'Billund (BLL)' },
      { slug: 'gdansk-lufthavn-transfer-copenhagen', city: 'København', airport: 'København (CPH)' },
    ],
  },
  fi: {
    country: 'Suomi',
    airports: [
      { slug: 'gdansk-lentokenttakuljetus-helsinki', city: 'Helsinki', airport: 'Helsinki (HEL)' },
      { slug: 'gdansk-lentokenttakuljetus-turku', city: 'Turku', airport: 'Turku (TKU)' },
    ],
  },
  pl: {
    country: 'Europa',
    airports: [
      { slug: 'transfer-lotnisko-gdansk-londyn-stansted', city: 'Londyn', airport: 'London Stansted (STN)' },
      { slug: 'transfer-lotnisko-gdansk-londyn-luton', city: 'Londyn', airport: 'London Luton (LTN)' },
      { slug: 'transfer-lotnisko-gdansk-manchester', city: 'Manchester', airport: 'Manchester (MAN)' },
      { slug: 'transfer-lotnisko-gdansk-edynburg', city: 'Edynburg', airport: 'Edinburgh (EDI)' },
      { slug: 'transfer-lotnisko-gdansk-dortmund', city: 'Dortmund', airport: 'Dortmund (DTM)' },
      { slug: 'transfer-lotnisko-gdansk-hamburg', city: 'Hamburg', airport: 'Hamburg (HAM)' },
      { slug: 'transfer-lotnisko-gdansk-oslo', city: 'Oslo', airport: 'Oslo Gardermoen (OSL)' },
      { slug: 'transfer-lotnisko-gdansk-sztokholm', city: 'Sztokholm', airport: 'Stockholm Arlanda (ARN)' },
      { slug: 'transfer-lotnisko-gdansk-kopenhaga', city: 'Kopenhaga', airport: 'København (CPH)' },
      { slug: 'transfer-lotnisko-gdansk-helsinki', city: 'Helsinki', airport: 'Helsinki (HEL)' },
    ],
  },
};

export const getCountryAirports = (locale: string) => countryAirportsByLocale[locale]?.airports ?? [];

export const getCountryAirportBySlug = (locale: string, slug: string) =>
  getCountryAirports(locale).find((airport) => airport.slug === slug) ?? null;

export const getCountryAirportCountry = (locale: string) =>
  countryAirportsByLocale[locale]?.country ?? '';

export default countryAirportsByLocale;
