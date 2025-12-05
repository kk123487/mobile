// Shopify Storefront API Configuration
// Replace these values with your actual Shopify store credentials

export const SHOPIFY_CONFIG = {
  // Your Shopify store domain (e.g., 'your-store.myshopify.com')
  storeDomain: process.env.EXPO_PUBLIC_SHOPIFY_DOMAIN || 'your-store.myshopify.com',
  
  // Storefront API access token (obtained from Shopify Admin > Apps > Develop apps)
  storefrontAccessToken: process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || 'your-storefront-access-token',
  
  // API version (update as needed for latest features)
  apiVersion: process.env.EXPO_PUBLIC_SHOPIFY_API_VERSION || '2024-10',
  
  // Product fetch limit
  productLimit: 50,
};

export const getStorefrontApiUrl = () => {
  return `https://${SHOPIFY_CONFIG.storeDomain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;
};
