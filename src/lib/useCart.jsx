import { useState, useEffect, createContext, useContext } from "react";
const CartContext = createContext(null);
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem("lojinha_cart") || "[]"); } catch { return []; } });
  useEffect(() => { localStorage.setItem("lojinha_cart", JSON.stringify(cart)); }, [cart]);
  const addToCart = (product, quantity = 1, size = "") => {
    setCart(prev => {
      const key = product.id + '-' + size;
      const existing = prev.find(i => i.product_id + '-' + i.size === key);
      if (existing) return prev.map(i => i.product_id + '-' + i.size === key ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, { product_id: product.id, product_name: product.name, price: product.price, quantity, size, image: product.images?.[0] || "" }];
    });
  };
  const removeFromCart = (productId, size) => setCart(prev => prev.filter(i => !(i.product_id === productId && i.size === size)));
  const updateQuantity = (productId, size, quantity) => { if (quantity <= 0) return removeFromCart(productId, size); setCart(prev => prev.map(i => i.product_id === productId && i.size === size ? { ...i, quantity } : i)); };
  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>{children}</CartContext.Provider>;
}
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}