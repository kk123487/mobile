import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Button } from '../components';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../services/shopify';
import { ShopifyProductVariant } from '../types/shopify';
import { RootStackParamList } from '../navigation/types';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

const { width } = Dimensions.get('window');

export const ProductDetailScreen: React.FC = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { product } = route.params;
  const { addItem } = useCart();
  
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant>(
    product.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddToCart = () => {
    if (!selectedVariant.availableForSale) {
      Alert.alert('Unavailable', 'This product is currently out of stock.');
      return;
    }
    
    addItem(product, selectedVariant, quantity);
    Alert.alert(
      'Added to Cart',
      `${product.title} has been added to your cart.`,
      [{ text: 'OK' }]
    );
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Image Gallery */}
      <View style={styles.imageContainer}>
        {product.images.length > 0 ? (
          <Image
            source={{ uri: product.images[currentImageIndex].url }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image Available</Text>
          </View>
        )}
        
        {/* Image Thumbnails */}
        {product.images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailContainer}
          >
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={image.id}
                onPress={() => setCurrentImageIndex(index)}
                style={[
                  styles.thumbnail,
                  currentImageIndex === index && styles.thumbnailActive,
                ]}
              >
                <Image
                  source={{ uri: image.url }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.title}</Text>
        
        {product.vendor && (
          <Text style={styles.vendor}>by {product.vendor}</Text>
        )}

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(selectedVariant.price)}</Text>
          {selectedVariant.compareAtPrice && 
           parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
            <Text style={styles.compareAtPrice}>
              {formatPrice(selectedVariant.compareAtPrice)}
            </Text>
          )}
        </View>

        {/* Variant Selector */}
        {product.variants.length > 1 && (
          <View style={styles.variantContainer}>
            <Text style={styles.sectionTitle}>Options</Text>
            <View style={styles.variantOptions}>
              {product.variants.map((variant) => (
                <TouchableOpacity
                  key={variant.id}
                  style={[
                    styles.variantOption,
                    selectedVariant.id === variant.id && styles.variantOptionActive,
                    !variant.availableForSale && styles.variantOptionDisabled,
                  ]}
                  onPress={() => setSelectedVariant(variant)}
                  disabled={!variant.availableForSale}
                >
                  <Text
                    style={[
                      styles.variantOptionText,
                      selectedVariant.id === variant.id && styles.variantOptionTextActive,
                      !variant.availableForSale && styles.variantOptionTextDisabled,
                    ]}
                  >
                    {variant.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decrementQuantity}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={incrementQuantity}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        {product.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        )}

        {/* Add to Cart Button */}
        <View style={styles.actionContainer}>
          <Button
            title={
              selectedVariant.availableForSale
                ? `Add to Cart - ${formatPrice({
                    amount: String(
                      parseFloat(selectedVariant.price.amount) * quantity
                    ),
                    currencyCode: selectedVariant.price.currencyCode,
                  })}`
                : 'Out of Stock'
            }
            onPress={handleAddToCart}
            disabled={!selectedVariant.availableForSale}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
  },
  mainImage: {
    width: width,
    height: width,
  },
  placeholderImage: {
    width: width,
    height: width,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  thumbnailContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: '#007AFF',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  vendor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
  },
  compareAtPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 12,
  },
  variantContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  variantOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  variantOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  variantOptionActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  variantOptionDisabled: {
    backgroundColor: '#f0f0f0',
  },
  variantOptionText: {
    fontSize: 14,
    color: '#333',
  },
  variantOptionTextActive: {
    color: '#fff',
  },
  variantOptionTextDisabled: {
    color: '#999',
  },
  quantityContainer: {
    marginBottom: 20,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 24,
    color: '#333',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  actionContainer: {
    marginBottom: 32,
  },
});
