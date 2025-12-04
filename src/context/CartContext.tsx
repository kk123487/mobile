import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, ShopifyProduct, ShopifyProductVariant } from '../types/shopify';

interface CartState {
  items: CartItem[];
  totalQuantity: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: ShopifyProduct; variant: ShopifyProductVariant; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { variantId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { variantId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addItem: (product: ShopifyProduct, variant: ShopifyProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.variantId === variant.id
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return {
          ...state,
          items: updatedItems,
          totalQuantity: state.totalQuantity + quantity,
        };
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${variant.id}`,
          variantId: variant.id,
          product,
          variant,
          quantity,
        };
        return {
          ...state,
          items: [...state.items, newItem],
          totalQuantity: state.totalQuantity + quantity,
        };
      }
    }

    case 'REMOVE_ITEM': {
      const { variantId } = action.payload;
      const itemToRemove = state.items.find((item) => item.variantId === variantId);
      if (!itemToRemove) return state;

      return {
        ...state,
        items: state.items.filter((item) => item.variantId !== variantId),
        totalQuantity: state.totalQuantity - itemToRemove.quantity,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { variantId, quantity } = action.payload;
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const itemToRemove = state.items.find((item) => item.variantId === variantId);
        if (!itemToRemove) return state;

        return {
          ...state,
          items: state.items.filter((item) => item.variantId !== variantId),
          totalQuantity: state.totalQuantity - itemToRemove.quantity,
        };
      }

      const existingItemIndex = state.items.findIndex(
        (item) => item.variantId === variantId
      );
      if (existingItemIndex === -1) return state;

      const oldQuantity = state.items[existingItemIndex].quantity;
      const updatedItems = [...state.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity,
      };

      return {
        ...state,
        items: updatedItems,
        totalQuantity: state.totalQuantity - oldQuantity + quantity,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product: ShopifyProduct, variant: ShopifyProductVariant, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } });
  };

  const removeItem = (variantId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { variantId } });
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { variantId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getSubtotal = (): number => {
    return state.items.reduce((total, item) => {
      return total + parseFloat(item.variant.price.amount) * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
