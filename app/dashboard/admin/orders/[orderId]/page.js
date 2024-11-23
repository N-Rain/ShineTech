"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function OrderDetailPage({ params }) {
  const { orderId } = params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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
      toast.error("An error occurred while fetching order details.");
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  if (!order) return <div>Order not found.</div>;

  return (
    <div className="container">
      <h4>Order Details: {order._id}</h4>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th scope="row">Customer Name:</th>
            <td>{order?.userId?.name || "Unknown Customer"}</td>
          </tr>
          <tr>
            <th scope="row">Charge ID:</th>
            <td>{order?.chargeId}</td>
          </tr>
          <tr>
            <th scope="row">Created At:</th>
            <td>{new Date(order?.createdAt).toLocaleString()}</td>
          </tr>
          <tr>
            <th scope="row">Payment Intent:</th>
            <td>{order?.payment_intent}</td>
          </tr>
          <tr>
            <th scope="row">Refunded:</th>
            <td>{order?.refunded ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <th scope="row">Status:</th>
            <td>{order?.status}</td>
          </tr>
          <tr>
            <th scope="row">Total Charged:</th>
            <td> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order?.amount_captured)}</td>
          </tr>
          <tr>
            <th scope="row">Shopping Address:</th>
            <td>
              {order?.shipping?.address?.line1}<br />
              {order?.shipping?.address?.line2 && `${order.shipping.address.line2} `}
              {order?.shipping?.address?.city}, {order?.shipping?.address?.state}, {order?.shipping?.address?.postal_code}
              <br />
              {order?.shipping?.address?.country}
            </td>
          </tr>
          <tr>
            <th scope="row">Ordered Products:</th>
            <td>
              {order?.cartItems?.map(product => (
                <div key={product?._id}>
                  {product?.quantity} x {product?.title} {product?.price} {order?.currency}
                </div>
              ))}
            </td>
          </tr>
          <tr>
            <th scope="row">Delivery Status:</th>
            <td>{order?.delivery_status}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
