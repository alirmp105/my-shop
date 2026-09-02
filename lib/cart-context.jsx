// lib/cart-context
"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSession } from "next-auth/react";

import {
  fetchCart,
  addToCart as addToCartRequest,
  updateCartItem as updateCartItemRequest,
  removeFromCart as removeFromCartRequest,
} from "@/services/cart";
import { usePathname, useRouter } from "next/navigation";


const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { status } = useSession();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pathname = usePathname()
  const router = useRouter()



  
  const loadCart = useCallback(async () => {
    try {
      setError(null);

      const data = await fetchCart();

      setCart(data.cart);
    } catch (error) {
      console.error("Load cart error:", error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      loadCart();
    }

    if (status === "unauthenticated") {
      setCart(null);
      setError(null);
      setLoading(false);
    }
  }, [status, loadCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);

      const data = await addToCartRequest(productId, quantity);
      if(data?.code === "unauthorized"){
            router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
            return
           }

      setCart(data.cart);

      return data.cart;
    } catch (error) {
      console.error("Add to cart error:", error);

      setError(error.message);

      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      setError(null);

      const data = await updateCartItemRequest(productId, quantity);

      setCart(data.cart);

      return data.cart;
    } catch (error) {
      console.error("Update cart item error:", error);

      setError(error.message);

      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setError(null);

      const data = await removeFromCartRequest(productId);

      setCart(data.cart);

      return data.cart;
    } catch (error) {
      console.error("Remove from cart error:", error);

      setError(error.message);

      throw error;
    }
  };

  const getCartItem = useCallback(
    (productId) => {
      if (!cart?.items) return null;

      return (
        cart.items.find((item) => {
          // Handle both populated product objects and ObjectId references
          const productRef = item.product;

          // If product is populated (has _id property)
          if (productRef && typeof productRef === "object" && productRef._id) {
            return productRef._id.toString() === productId;
          }

          // If product is just an ObjectId
          if (productRef && typeof productRef.toString === "function") {
            return productRef.toString() === productId;
          }

          return false;
        }) ?? null
      );
    },
    [cart],
  );

  const getCartItemQuantity = useCallback(
    (productId) => {
      return getCartItem(productId)?.quantity ?? 0;
    },
    [getCartItem],
  );

  const cartItemsCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  const value = {
    cart,
    loading,
    error,

    loadCart,

    addToCart,
    updateCartItem,
    removeFromCart,

    getCartItem,
    getCartItemQuantity,

    cartItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
