"use client";
import Link from "next/link";
import { useCart } from '@/context/cart';
import { useEffect } from "react";

export default function UserStripeSuccess() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, []);
  return (
    <div className="container">
      <div className="row">
        <div className="col text-center">
          <p>
          Cảm ơn bạn đã mua hàng. Bạn có thể kiểm tra trạng thái đơn hàng của mình trong mục quản lý.
          </p>
          <hr />
          <Link
            className="btn btn-primary btn-raised"
            href="/dashboard/user/orders"
          >
            Xem trạng thái Đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
} 