// Shopify Storefront API Types

export interface ShopifyImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyPrice;
  compareAtPrice: ShopifyPrice | null;
  availableForSale: boolean;
  sku: string | null;
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  images: ShopifyImage[];
  variants: ShopifyProductVariant[];
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyImage | null;
  products: ShopifyProduct[];
}

export interface CartItem {
  id: string;
  variantId: string;
  product: ShopifyProduct;
  variant: ShopifyProductVariant;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalQuantity: number;
  subtotal: ShopifyPrice;
  checkoutUrl: string;
}

export interface ShopifyCheckout {
  id: string;
  webUrl: string;
  lineItems: {
    id: string;
    title: string;
    quantity: number;
    variant: ShopifyProductVariant;
  }[];
  subtotalPrice: ShopifyPrice;
  totalPrice: ShopifyPrice;
  totalTax: ShopifyPrice;
}

export interface ShopifyConfig {
  storeDomain: string;
  storefrontAccessToken: string;
}
