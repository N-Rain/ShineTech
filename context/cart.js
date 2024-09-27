import { createContext, useState, useContext, useEffect } from "react";
export const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"))
      || [];
    setCartItems(storedCartItems);
  }, []);
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);
  const addToCart = (product, quantity) => {
    const existingProduct = cartItems.find((item) => item._id ===
      product._id);
    if (existingProduct) {
      const updatedCartItems = cartItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCartItems(updatedCartItems);
    }
    else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
  };
  const updateQuantity = (product, quantity) => {
    const updatedItems = cartItems.map((item) =>
      item._id === product._id ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };
  const removeFromCart = (productId) => {
    const updatedCartItems = cartItems.filter((item) => item._id !==
      productId);
    setCartItems(updatedCartItems);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updatedCartItems));
    }
  };
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext); 