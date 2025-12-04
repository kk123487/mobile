// Shopify Storefront API Configuration
// Replace these values with your actual Shopify store credentials

export const SHOPIFY_CONFIG = {
  // Your Shopify store domain (e.g., 'your-store.myshopify.com')
  storeDomain: process.env.EXPO_PUBLIC_SHOPIFY_DOMAIN || 'your-store.myshopify.com',
  
  // Storefront API access token (obtained from Shopify Admin > Apps > Develop apps)
  storefrontAccessToken: process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || 'your-storefront-access-token',
};

export const getStorefrontApiUrl = () => {
  return `https://${SHOPIFY_CONFIG.storeDomain}/api/2024-01/graphql.json`;
};
