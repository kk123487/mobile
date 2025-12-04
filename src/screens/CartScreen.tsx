import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CartItemCard, Button } from '../components';
import { useCart } from '../context/CartContext';
import { createCheckout, formatPrice } from '../services/shopify';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { state, updateQuantity, removeItem, clearCart, getSubtotal } = useCart();

  const handleCheckout = async () => {
    if (state.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }

    try {
      const checkout = await createCheckout(state.items);
      
      if (checkout && checkout.webUrl) {
        // Open Shopify checkout in browser
        const supported = await Linking.canOpenURL(checkout.webUrl);
        
        if (supported) {
          await Linking.openURL(checkout.webUrl);
          clearCart();
        } else {
          Alert.alert('Error', 'Unable to open checkout. Please try again.');
        }
      } else {
        Alert.alert('Error', 'Failed to create checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const subtotal = getSubtotal();
  const currencyCode = state.items[0]?.variant.price.currencyCode || 'USD';

  if (state.items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Add some products to get started!
        </Text>
        <Button
          title="Browse Products"
          onPress={() => navigation.navigate('Products')}
          style={styles.browseButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={state.items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CartItemCard
            item={item}
            onUpdateQuantity={(quantity) => updateQuantity(item.variantId, quantity)}
            onRemove={() => removeItem(item.variantId)}
          />
        )}
        ListFooterComponent={
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Subtotal ({state.totalQuantity} items)
              </Text>
              <Text style={styles.summaryValue}>
                {formatPrice({ amount: String(subtotal), currencyCode })}
              </Text>
            </View>
            <Text style={styles.shippingNote}>
              Shipping and taxes calculated at checkout
            </Text>
          </View>
        }
      />
      
      <View style={styles.checkoutContainer}>
        <Button
          title={`Checkout - ${formatPrice({ amount: String(subtotal), currencyCode })}`}
          onPress={handleCheckout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f5f5f5',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    minWidth: 200,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#333',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  shippingNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
