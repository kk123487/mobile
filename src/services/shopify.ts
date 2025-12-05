import { SHOPIFY_CONFIG, getStorefrontApiUrl } from './config';
import {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyCheckout,
  Cart,
  CartItem,
} from '../types/shopify';

// GraphQL query helper
const shopifyFetch = async <T>(query: string, variables: Record<string, unknown> = {}): Promise<T> => {
  const response = await fetch(getStorefrontApiUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();

  if (json.errors) {
    console.error('Shopify API Error:', json.errors);
    throw new Error(json.errors[0]?.message || 'Error fetching data from Shopify');
  }

  return json.data;
};

// GraphQL Queries
const PRODUCTS_QUERY = `
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          vendor
          productType
          tags
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                sku
                image {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      productType
      tags
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            sku
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

const COLLECTIONS_QUERY = `
  query Collections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

const COLLECTION_BY_HANDLE_QUERY = `
  query CollectionByHandle($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      description
      image {
        id
        url
        altText
        width
        height
      }
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            vendor
            productType
            tags
            images(first: 10) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                  sku
                  image {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

const CREATE_CHECKOUT_MUTATION = `
  mutation CreateCheckout($lineItems: [CheckoutLineItemInput!]!) {
    checkoutCreate(input: { lineItems: $lineItems }) {
      checkout {
        id
        webUrl
        lineItems(first: 10) {
          edges {
            node {
              id
              title
              quantity
              variant {
                id
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        subtotalPrice {
          amount
          currencyCode
        }
        totalPrice {
          amount
          currencyCode
        }
        totalTax {
          amount
          currencyCode
        }
      }
      checkoutUserErrors {
        field
        message
      }
    }
  }
`;

// Helper functions to parse API responses
const parseProduct = (productNode: any): ShopifyProduct => ({
  id: productNode.id,
  title: productNode.title,
  handle: productNode.handle,
  description: productNode.description,
  descriptionHtml: productNode.descriptionHtml,
  vendor: productNode.vendor,
  productType: productNode.productType,
  tags: productNode.tags,
  images: productNode.images.edges.map((edge: any) => edge.node),
  variants: productNode.variants.edges.map((edge: any) => edge.node),
  priceRange: productNode.priceRange,
});

const parseCollection = (collectionNode: any): ShopifyCollection => ({
  id: collectionNode.id,
  title: collectionNode.title,
  handle: collectionNode.handle,
  description: collectionNode.description,
  image: collectionNode.image,
  products: collectionNode.products?.edges.map((edge: any) => parseProduct(edge.node)) || [],
});

// API Functions
export const getProducts = async (first: number = 20): Promise<ShopifyProduct[]> => {
  try {
    const data = await shopifyFetch<{ products: { edges: { node: any }[] } }>(
      PRODUCTS_QUERY,
      { first }
    );
    return data.products.edges.map((edge) => parseProduct(edge.node));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductByHandle = async (handle: string): Promise<ShopifyProduct | null> => {
  try {
    const data = await shopifyFetch<{ productByHandle: any }>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle }
    );
    return data.productByHandle ? parseProduct(data.productByHandle) : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const getCollections = async (first: number = 20): Promise<Omit<ShopifyCollection, 'products'>[]> => {
  try {
    const data = await shopifyFetch<{ collections: { edges: { node: any }[] } }>(
      COLLECTIONS_QUERY,
      { first }
    );
    return data.collections.edges.map((edge) => ({
      ...edge.node,
      products: [],
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
};

export const getCollectionByHandle = async (
  handle: string,
  productFirst: number = 20
): Promise<ShopifyCollection | null> => {
  try {
    const data = await shopifyFetch<{ collectionByHandle: any }>(
      COLLECTION_BY_HANDLE_QUERY,
      { handle, first: productFirst }
    );
    return data.collectionByHandle ? parseCollection(data.collectionByHandle) : null;
  } catch (error) {
    console.error('Error fetching collection:', error);
    return null;
  }
};

export const createCheckout = async (cartItems: CartItem[]): Promise<ShopifyCheckout | null> => {
  try {
    const lineItems = cartItems.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));

    const data = await shopifyFetch<{ checkoutCreate: { checkout: any; checkoutUserErrors: any[] } }>(
      CREATE_CHECKOUT_MUTATION,
      { lineItems }
    );

    if (data.checkoutCreate.checkoutUserErrors?.length > 0) {
      console.error('Checkout errors:', data.checkoutCreate.checkoutUserErrors);
      throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
    }

    const checkout = data.checkoutCreate.checkout;
    return {
      id: checkout.id,
      webUrl: checkout.webUrl,
      lineItems: checkout.lineItems.edges.map((edge: any) => edge.node),
      subtotalPrice: checkout.subtotalPrice,
      totalPrice: checkout.totalPrice,
      totalTax: checkout.totalTax,
    };
  } catch (error) {
    console.error('Error creating checkout:', error);
    return null;
  }
};

// Format price for display
export const formatPrice = (price: { amount: string; currencyCode: string }): string => {
  const amount = parseFloat(price.amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(amount);
};
