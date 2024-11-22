"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/cart";
import Link from "next/link";
// export default function AddToCart({
//   product,
//   reviewAndCheckout = true,
//   isColorSelected,
// }) {
//   const { addToCart, updateQuantity, cartItems, removeFromCart } = useCart();
//   const existingProduct = cartItems.find((item) => item._id === product._id);
//   const initialQuantity = existingProduct ? existingProduct.quantity : 1;
//   const [quantity, setQuantity] = useState(initialQuantity);
//   const [errorMessage, setErrorMessage] = useState("");
//   useEffect(() => {
//     cartItems;
//     setQuantity(existingProduct ? existingProduct.quantity : 1);
//   }, [existingProduct]);

//   // const handleIncrement = () => {
//   //   const newQuantity = quantity + 1;
//   //   setQuantity(newQuantity);
//   //   updateQuantity(product, newQuantity);
//   // };
//   const handleIncrement = () => {
//     if (quantity < product.stock) {
//       const newQuantity = quantity + 1;
//       setQuantity(newQuantity);
//       updateQuantity(product, newQuantity);
//       setErrorMessage(""); // Xóa thông báo lỗi nếu có
//     } else {
//       setErrorMessage("Not enough stock for this item.");
//     }
//   };
//   const handleDecrement = () => {
//     if (quantity > 1) {
//       const newQuantity = quantity - 1;
//       setQuantity(newQuantity);
//       updateQuantity(product, newQuantity);
//     } else {
//       removeFromCart(product._id);
//       setQuantity(1);
//     }
//   };
//   // const handleAddToCart = () => {
//   //   addToCart(product, quantity);
//   // };
//   const handleAddToCart = () => {
//     if (quantity <= product.stock) {
//       addToCart(product, quantity);
//       setErrorMessage(""); // Xóa thông báo lỗi nếu có
//     } else {
//       setErrorMessage("Not enough stock for this item.");
//     }
//   };
//   return (
//     <div>
//       {cartItems.some((item) => item._id === product._id) ? (
//         <>
//           <div className="input-group quantity-input">
//             <div className="input-group-prepend">
//               <button
//                 className="btn btn-outline-secondary"
//                 type="button"
//                 onClick={handleDecrement}
//               >
//                 -
//               </button>
//             </div>
//             <input
//               type="number"
//               className="form-control no-spin-arrows mx-5 text-center"
//               value={quantity}
//               onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
//             />
//             <div className="input-group-append">
//               <button
//                 className="btn btn-outline-secondary"
//                 type="button"
//                 onClick={handleIncrement}
//               >
//                 +
//               </button>
//             </div>
//           </div>
//           {errorMessage && (
//             <div className="alert alert-danger mt-2">{errorMessage}</div>
//           )}

//           {reviewAndCheckout && (
//             <Link
//               className="btn btn-outline-danger btn-raised btn-block mt-2"
//               href="/cart"
//             >
//               Review & Checkout
//             </Link>
//           )}
//         </>
//       ) : (
//         <button
//           className={`btn btn-raised btn-block ${
//             isColorSelected ? "btn-danger" : "btn-secondary"
//           }`}
//           onClick={handleAddToCart}
//           disabled={!isColorSelected}
//         >
//           Add to Cart
//         </button>
//       )}
//     </div>
//   );
// }
//           {/* {reviewAndCheckout && (
//             <Link
//               className="btn btn-outline-danger btn-raised btn-block mt-2"
//               href="/cart"
//             >
//               Review & Checkout
//             </Link>
//           )}
//         </>
//       ) : (
//         // <button
//         //   className="btn btn-danger btn-raised btn-block"
//         //   onClick={handleAddToCart}
//         // >
//         //   Add to Cart
//         // </button>
//         <button
//           className={`btn btn-raised btn-block ${
//             isColorSelected ? "btn-danger" : "btn-secondary"
//           }`}
//           onClick={handleAddToCart}
//           disabled={!isColorSelected}
//         >
//           Add to Cart
//         </button>
//       )}
//     </div>
//   );
// } */}
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
    if (quantity < product.stock) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      updateQuantity(product, newQuantity);
      setErrorMessage(""); // Xóa thông báo lỗi nếu có
    } else {
      setErrorMessage("Not enough stock for this item.");
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
    if (quantity <= product.stock) {
      addToCart(product, quantity);
      setErrorMessage(""); // Xóa thông báo lỗi nếu có
    } else {
      setErrorMessage("Not enough stock for this item.");
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
                if (value <= product.stock) {
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
              Review & Checkout
            </Link>
          )}
        </>
      ) : (
        <button
          className={`btn btn-raised btn-block ${
            isColorSelected ? "btn-danger" : "btn-secondary"
          }`}
          onClick={handleAddToCart}
          disabled={!isColorSelected}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}
