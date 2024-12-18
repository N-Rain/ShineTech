import React from "react";
import { useRouter } from "next/navigation";
export default function AdminChart({ revenueData }) {
  const { totalRevenue, successfulOrdersCount, orders } = revenueData;
  const router = useRouter();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <h2 className="text-center">Số liệu Doanh thu</h2>
          <ul className="list-group mb-4">
            <li className="list-group-item">
              <strong>Tổng doanh thu:</strong>{new Intl.NumberFormat('vi-VN').format(totalRevenue) + " VND"}
            </li>
            <li className="list-group-item">
              <strong>Đơn hàng thành công:</strong> {successfulOrdersCount}
            </li>
          </ul>

          <h3>Chi tiết Đơn hàng</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Mã Đơn hàng</th>
                <th>Số tiền đã nhận</th>
                <th>Thời gian tạo</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td
                    style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                    onClick={() => router.push(`/dashboard/admin/orders/${order._id}`)} 
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