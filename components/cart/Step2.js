import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/context/cart";
import toast from "react-hot-toast";
import OrderSummary from "@/components/cart/OrderSummary";

export default function Step2({ onNextStep, onPrevStep }) {
  const { data, status, update } = useSession();

  const { couponCode, setCouponCode, handleCoupon } = useCart();

  if (status !== "authenticated") {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div className="d-flex justify-content-end my-4">
              <button
                className="btn btn-outline-danger btn-raised col-6"
                onClick={onPrevStep}
              >
                Trước
              </button>

              <Link
                className="btn btn-primary btn-raised col-6"
                href={`/login?callbackUrl=${window.location.href}`}
              >
                Login to Continue
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8">
          <p className="alert alert-primary">Thông tin cá nhân / Đăng nhập</p>

          <div>
            <input
              type="text"
              value={data?.user?.name}
              className="form-control mb-2 px-2"
              placeholder="Tên của bạn"
              disabled
            />
            <input
              type="email"
              value={data?.user?.email}
              className="form-control mb-2 px-2"
              placeholder="Email của bạn"
              disabled
            />
          </div>
          <div>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="form-control mb-2 px-2 mt-4"
              placeholder="Nhập mã giảm giá của bạn tại đây"
            />
            <button className="btn btn-success btn-raised"
              onClick={() => handleCoupon(couponCode)}
              disabled={!couponCode?.trim()}
            >
              Áp dụng Mã giảm giá
            </button>
          </div>
          <div className="d-flex justify-content-end my-4">
            <button
              className="btn btn-outline-danger btn-raised col-6"
              onClick={onPrevStep}
            >
              Quay lại
            </button>

            <button
              className="btn btn-danger btn-raised col-6"
              onClick={onNextStep}
            >
              Tiếp tục
            </button>
          </div>
        </div>

        <div className="col-lg-4">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
