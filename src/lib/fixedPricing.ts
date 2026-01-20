export const FIXED_PRICES = {
  standard: {
    gdansk: { day: 100, night: 120 },
    sopot: { day: 120, night: 150 },
    gdynia: { day: 200, night: 250 },
  },
  bus: {
    gdansk: { day: 150, night: 180 },
    sopot: { day: 170, night: 200 },
    gdynia: { day: 280, night: 330 },
  },
} as const;

export type FixedCityKey = keyof typeof FIXED_PRICES.standard;
export type FixedVehicleKey = keyof typeof FIXED_PRICES;
