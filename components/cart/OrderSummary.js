import React from "react";
import { useCart } from "@/context/cart";
import Image from "next/image";

export default function OrderSummary() {
  const { cartItems, percentOff } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotalWithDiscount = () => {
    const totalPrice = calculateTotal();
    if (percentOff > 0) {
      const discountAmount = (totalPrice * percentOff) / 100;
      return totalPrice - discountAmount;
    }
    return totalPrice;
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const itemOrItems = totalItems === 1 ? "sản phẩm" : "sản phẩm";

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

  return (
    <div>
      <p className="alert alert-primary">Tóm tắt Đơn hàng</p>
      <ul className="list-unstyled">
        {cartItems?.map((product) => (
          <div className="card mb-3" key={product._id}>
            <div className="row g-0 d-flex align-items-center p-1">
              <div className="col-md-3">
                <div style={{ height: "66px", overflow: "hidden" }}>
                  <Image
                    src={product?.images?.[0]?.secure_url || "/images/image.jpg"}
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
                <p className="card-title text-secondary">{product.title}</p>
              </div>
              <div className="col-md-3">
                <p className="h6">{formatCurrency(product?.price)}</p>
                <p className="text-secondary">SL: {product?.quantity}</p>
              </div>
            </div>
          </div>
        ))}
      </ul>

      {percentOff > 0 && (
        <p className="alert alert-danger">{percentOff}% giảm giá đã được áp dụng!</p>
      )}

      {percentOff > 0 && (
        <div className="d-flex justify-content-between p-1">
          <p>Tổng trước khi giảm giá:</p>
          <p className="h4 text-danger">
            <del>{formatCurrency(calculateTotal())}</del>
          </p>
        </div>
      )}

      <div className="d-flex justify-content-between p-1">
        <p>
          Tổng {totalItems} {itemOrItems}:
        </p>
        <p className="h4">{formatCurrency(calculateTotalWithDiscount())}</p>
      </div>
    </div>
  );
}
