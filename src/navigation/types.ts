import { ShopifyProduct } from '../types/shopify';

export type RootStackParamList = {
  Main: undefined;
  Products: undefined;
  ProductDetail: { product: ShopifyProduct };
  Cart: undefined;
};

export type BottomTabParamList = {
  Products: undefined;
  Cart: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
