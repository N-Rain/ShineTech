import React from "react";
import { useCart } from "@/context/cart";
import Image from "next/image";
export default function OrderSummary() {
  const { cartItems } = useCart();
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const itemOrItems = totalItems === 1 ? "item" : "items";
  return (
    <div>
      <p className="alert alert-primary">Order Summary</p>
      <ul className="list-unstyled">
        {cartItems?.map((product) => (
          <div className="card mb-3" key={product._id}>
            <div className="row g-0 d-flex align-items-center p-1">
              <div className="col-md-3">
                <div style={{ height: "66px", overflow: "hidden" }}>
                  <Image
                    src={
                      product?.images?.[0]?.secure_url ||
                      "/images/new-wave.jpeg"
                    }
                    className="card-img-top"
                    width={500}
                    height={300}
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                    }}
                    alt={product?.title}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <p className="card-title text-secondary">{product.title}
                </p>
              </div>
              <div className="col-md-3">
                <p className="h6">{product?.price} VND</p>
                <p className="text-secondary">Qty: {product?.quantity}</p>
              </div>
            </div>
          </div>
        ))}
      </ul>
      <div className="d-flex justify-content-between p-1">
        <p>
          Total {totalItems} {itemOrItems}:
        </p>
        <p className="h4">{calculateTotal()} VND</p>
      </div>
    </div>
  );
}