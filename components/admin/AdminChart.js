import React from "react";
import { useRouter } from "next/navigation";
export default function AdminChart({ revenueData }) {
  const { totalRevenue, successfulOrdersCount, orders } = revenueData;
  const router = useRouter();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <h2 className="text-center">Revenue Statistics</h2>
          <ul className="list-group mb-4">
            <li className="list-group-item">
              <strong>Total Revenue:</strong>{new Intl.NumberFormat('vi-VN').format(totalRevenue) + " VND"}
            </li>
            <li className="list-group-item">
              <strong>Successful Orders:</strong> {successfulOrdersCount}
            </li>
          </ul>

          <h3>Order Details</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Amount Captured</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td
                    style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                    onClick={() => router.push(`/dashboard/admin/orders/${order._id}`)} // Điều hướng đến trang chi tiết đơn hàng
                  >
                    {order._id}
                  </td>

                  <td>{new Intl.NumberFormat('vi-VN').format(order.amount_captured) + " VND"}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
