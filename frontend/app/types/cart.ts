export type MoneyV2 = { amount: string; currencyCode: string };

export type CartLine = {
  id: string;
  quantity: number;
  merchandise?: { id?: string } | null;
};

export type CartResponse = {
  id: string;
  checkoutUrl?: string;
  lines?: { edges: { node: CartLine }[] };
};

export type CartUserError = { message: string };
export type CartLineInput = { merchandiseId: string; quantity: number };
