export type RouteType = 'standard' | 'bus';
export type PickupType = 'airport' | 'address';

export type OrderNotes = {
  pickupType: PickupType;
  signService?: 'sign' | 'self';
  signFee?: number;
  signText: string;
  passengers: string;
  largeLuggage: string;
  route: {
    from: string;
    to: string;
    type: RouteType;
  };
  notes: string;
};

export const buildAdditionalNotes = (notes: OrderNotes) => JSON.stringify(notes);

export const parseAdditionalNotes = (value: string): Partial<OrderNotes> => {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object') {
      return parsed as Partial<OrderNotes>;
    }
  } catch {
    return { notes: value };
  }

  return { notes: value };
};
