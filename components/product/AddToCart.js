"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/cart";
import Link from "next/link";

export default function AddToCart({
  product,
  reviewAndCheckout = true,
  isColorSelected,
}) {
  const { addToCart, updateQuantity, cartItems, removeFromCart } = useCart();
  const existingProduct = cartItems.find((item) => item._id === product._id);
  const initialQuantity = existingProduct ? existingProduct.quantity : 1;
  const [quantity, setQuantity] = useState(initialQuantity);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setQuantity(existingProduct ? existingProduct.quantity : 1);
  }, [existingProduct]);

  const handleIncrement = () => {
    if (product.stock > 1 && quantity < product.stock - 1) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      updateQuantity(product, newQuantity);
      setErrorMessage(""); // Xóa thông báo lỗi nếu có
    } else if (product.stock <= 1) {
      setErrorMessage("Not enough stock for this item.");
    } else {
      setErrorMessage("You can only add up to " + (product.stock - 1) + " items.");
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(product, newQuantity);
      setErrorMessage(""); // Xóa thông báo lỗi nếu có
    } else {
      removeFromCart(product._id);
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (product.stock === 1) {
      setErrorMessage("Not enough stock for this item.");
      return;
    }

    if (quantity <= product.stock - 1) {
      addToCart(product, quantity);
      setErrorMessage(""); // Xóa thông báo lỗi nếu có
    } else {
      setErrorMessage("You can only add up to " + (product.stock - 1) + " items.");
    }
  };

  return (
    <div>
      {cartItems.some((item) => item._id === product._id) ? (
        <>
          <div className="input-group quantity-input">
            <div className="input-group-prepend">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleDecrement}
              >
                -
              </button>
            </div>
            <input
              type="number"
              className="form-control no-spin-arrows mx-5 text-center"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (value <= product.stock && value >= 1) {
                  setQuantity(value);
                  updateQuantity(product, value);
                  setErrorMessage(""); // Xóa thông báo lỗi
                } else {
                  setErrorMessage("Not enough stock for this item.");
                }
              }}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="alert alert-danger mt-2">{errorMessage}</div>
          )}

          {reviewAndCheckout && (
            <Link
              className="btn btn-outline-danger btn-raised btn-block mt-2"
              href="/cart"
            >
              Đánh giá & Thanh toán
            </Link>
          )}
        </>
      ) : (
        <button
          className={`btn btn-raised btn-block ${
            isColorSelected && product.stock > 1 ? "btn-danger" : "btn-secondary"
          }`}
          onClick={handleAddToCart}
          disabled={!isColorSelected || product.stock <= 1} // Vô hiệu hóa khi stock <= 1
        >
          Thêm vào giỏ hàng
        </button>
      )}
    </div>
  );
}


