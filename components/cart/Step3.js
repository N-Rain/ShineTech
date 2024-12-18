import { useCart } from "@/context/cart";
import OrderSummary from "@/components/cart/OrderSummary";
import toast from "react-hot-toast";
import { useState } from "react";
export default function Step3({ onPrevStep }) {
  const { cartItems, validCoupon,couponCode } = useCart();
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    try {
      setLoading(true);
      const  payload = {};
      const cartData = cartItems?.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
      }));
      payload.cartItems = cartData;
      if (validCoupon) {
        payload.couponCode = couponCode;
      }
      const response = await fetch(`${process.env.API}/user/stripe/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      if (response.ok) {
        const data = await response.json();
        // console.log("checkout session response data", data); 
        window.location.href = data.url;
      }
      else {
        const errorData = await response.json();
        toast.error(errorData.err);
        setLoading(false);
      }
    }
    catch (err) {
      console.log(err);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8">
          <p className="alert alert-primary">Phương thức thanh toán</p>
          <h2 className="text-center">🔒 💳</h2>
          <p className="alert alert-danger"> Phí vận chuyển cố định 25.000 VND sẽ được áp dụng cho tất cả các đơn hàng 
            trên toàn quốc Việt Nam!
          </p>
          <p className="lead card p-5 bg-secondary text-light">
            Nhấn 'Đặt hàng' sẽ đưa bạn đến hệ thống thanh toán Stripe 
            để hoàn tất quá trình thanh toán. Mọi thông tin của bạn 
            đều được bảo mật và mã hóa an toàn.
          </p>
          <div className="d-flex justify-content-end my-4">
            <button
              className="btn btn-outline-danger btn-raised col-6"
              onClick={onPrevStep}
            >
              Quay lại
            </button>
            <button
              className="btn btn-success btn-raised col-6"
              onClick={handleClick}
              disabled={loading}
            >
              {loading ? "Đang xử lý ..." : "Đặt hàng"}
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
