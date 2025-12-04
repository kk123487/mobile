# My Shopify Mobile App

A React Native mobile application for a private Shopify store, built with Expo.

## Features

- 📱 Browse products from your Shopify store
- 🖼️ View detailed product information with image gallery
- 🛒 Add products to cart with variant selection
- 💰 Checkout via Shopify's secure checkout
- 🔄 Pull-to-refresh product listings
- 📱 Cross-platform support (iOS, Android, Web)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- A Shopify store with Storefront API access

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your Shopify store:
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
   EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token
   ```

   Or update the values in `src/services/config.ts`.

### Running the App

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

## Shopify Setup

### Creating a Storefront API Access Token

1. Go to your Shopify Admin
2. Navigate to **Apps** > **App and sales channel settings**
3. Click **Develop apps** (you may need to enable developer preview)
4. Create a new app
5. Configure Storefront API scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`
6. Install the app and copy your **Storefront API access token**

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Button.tsx
│   ├── CartItemCard.tsx
│   ├── LoadingSpinner.tsx
│   └── ProductCard.tsx
├── context/           # React Context providers
│   └── CartContext.tsx
├── navigation/        # React Navigation setup
│   └── AppNavigator.tsx
├── screens/           # App screens
│   ├── CartScreen.tsx
│   ├── ProductDetailScreen.tsx
│   └── ProductsScreen.tsx
├── services/          # API and external services
│   ├── config.ts
│   └── shopify.ts
└── types/             # TypeScript type definitions
    └── shopify.ts
```

## Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform for React Native
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **Shopify Storefront API** - E-commerce backend

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and intended for personal use.

