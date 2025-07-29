import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  isLoading: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload.items,
        itemCount: action.payload.itemCount,
        subtotal: parseFloat(action.payload.subtotal),
        isLoading: false,
      };
    case 'ADD_ITEM':
      return {
        ...state,
        items: action.payload.items,
        itemCount: action.payload.itemCount,
        subtotal: parseFloat(action.payload.subtotal),
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: action.payload.items,
        itemCount: action.payload.itemCount,
        subtotal: parseFloat(action.payload.subtotal),
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: action.payload.items,
        itemCount: action.payload.itemCount,
        subtotal: parseFloat(action.payload.subtotal),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        itemCount: 0,
        subtotal: 0,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated, user]);

  // Load cart from server
  const loadCart = async () => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.get('/cart');
      dispatch({
        type: 'LOAD_CART',
        payload: response.data.data,
      });
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Sepete ürün eklemek için giriş yapmalısınız');
      return { success: false };
    }

    try {
      await api.post('/cart', { productId, quantity });
      await loadCart(); // Reload cart to get updated data
      toast.success('Ürün sepete eklendi');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Ürün sepete eklenirken bir hata oluştu';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated) return { success: false };

    try {
      await api.put(`/cart/${productId}`, { quantity });
      await loadCart();
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Ürün güncellenirken bir hata oluştu';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return { success: false };

    try {
      await api.delete(`/cart/${productId}`);
      await loadCart();
      toast.success('Ürün sepetten kaldırıldı');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Ürün kaldırılırken bir hata oluştu';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!isAuthenticated) return { success: false };

    try {
      await api.delete('/cart');
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Sepet temizlendi');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Sepet temizlenirken bir hata oluştu';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Get cart item quantity for a specific product
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return state.items.some(item => item.product_id === productId);
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    getItemQuantity,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 