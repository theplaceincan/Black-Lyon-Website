export type MoneyV2 = { amount: string; currencyCode: string };

export type ShopifyImage = {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type SelectedOption = { name: string; value: string };

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  selectedOptions?: SelectedOption[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description?: string;
  images?: { edges: { node: ShopifyImage }[] };
  featuredImage?: ShopifyImage | null;
  variants?: { edges: { node: ProductVariant }[] };
  tags?: string[];
  priceRange?: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
};

export type ProductEdge = { node: Product };
export type ProductConnection = { edges: ProductEdge[] };

export type Attribute = { key: string; value: string };

export type CartLine = {
  id: string;
  quantity: number;
  cost?: {
    amountPerQuantity?: MoneyV2;
    totalAmount?: MoneyV2;
  };
  merchandise: ProductVariant & {
    product: Pick<Product, "id" | "handle" | "title" | "featuredImage">;
  };
};

export type Cart = {
  id: string;
  totalQuantity: number;
  cost?: {
    subtotalAmount?: MoneyV2;
    totalAmount?: MoneyV2;
  };
  lines?: { edges: { node: CartLine }[] };
  attributes?: Attribute[];
};

export type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};
