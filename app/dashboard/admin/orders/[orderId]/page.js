"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function OrderDetailPage({ params }) {
  const { orderId } = params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const translateStatus = (status) => {
    const statusMap = {
      "succeeded": "Thành công",
      "failed": "Thất bại",
      // Add more statuses if needed
    };
    return statusMap[status] || status; // Return original status if no translation found
  };

  const translateDeliveryStatus = (status) => {
    const deliveryStatusMap = {
      "Not Processed": "Chưa xử lý",
      "processing": "Đang xử lý",
      "Dispatched": "Đã gửi đi",
      "Refunded": "Đã hoàn tiền",
      "Cancelled": "Đã hủy",
      "Delivered": "Đã giao",
    };
    return deliveryStatusMap[status] || status; // Return original status if no translation found
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(orderId);
    }
  }, [orderId]);

  const fetchOrderDetail = async (orderId) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.API}/admin/orders/${orderId}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data);
      } else {
        toast.error("Failed to fetch order details.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Đã có lỗi xảy ra khi tải chi tiết Đơn hàng.");
    }
    setLoading(false);
  };

  if (loading) return <div>Đang tải...</div>;

  if (!order) return <div>Không tìm thấy Đơn hàng.</div>;

  return (
    <div className="container">
      <h4>Mã Đơn hàng: {order._id}</h4>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th scope="row">Tên Khách hàng:</th>
            <td>{order?.userId?.name || "Tên khách hàng không xác định"}</td>
          </tr>
          <tr>
            <th scope="row">Mã Thanh toán:</th>
            <td>{order?.chargeId}</td>
          </tr>
          <tr>
            <th scope="row">Thời gian tạo:</th>
            <td>{new Date(order?.createdAt).toLocaleString()}</td>
          </tr>
          <tr>
            <th scope="row">Yêu cầu thanh toán:</th>
            <td>{order?.payment_intent}</td>
          </tr>
          <tr>
            <th scope="row">Hoàn tiền:</th>
            <td>{order?.refunded ? "Đã hoàn" : "Không có"}</td>
          </tr>
          <tr>
            <th scope="row">Trạng thái:</th>
            <td>{translateStatus(order?.status)}</td>
          </tr>
          <tr>
            <th scope="row">Tổng thanh toán:</th>
            <td> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order?.amount_captured)}</td>
          </tr>
          <tr>
            <th scope="row">Địa chỉ vận chuyển:</th>
            <td>
              {order?.shipping?.address?.line1}
              <br />
              {order?.shipping?.address?.line2 && (
                <>
                  {order?.shipping?.address?.line2}
                  <br />
                </>
              )}
              {order?.shipping?.address?.city}, {order?.shipping?.address?.state}
              <br />
              {order?.shipping?.address?.country}
            </td>
          </tr>
          <tr>
            <th scope="row">Sản phẩm đã đặt:</th>
            <td>
              {order?.cartItems?.map(product => (
                <div key={product?._id}>
                  {product?.quantity} x {product?.title} (
                  {new Intl.NumberFormat('vi-VN').format(product?.price) + " VND"})
                </div>
              ))}
            </td>
          </tr>
          <tr>
            <th scope="row">Trạng thái vận chuyển:</th>
            <td>{translateDeliveryStatus(order?.delivery_status)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
