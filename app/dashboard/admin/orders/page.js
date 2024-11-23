"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";


export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // State cho bộ lọc
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [customerName, setCustomerName] = useState(""); // Thêm state cho tên khách hàng

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Lấy giá trị từ URL query
  useEffect(() => {
    const page = searchParams.get("page") || 1;
    const startDateParam = searchParams.get("startDate") || "";
    const endDateParam = searchParams.get("endDate") || "";
    const statusParam = searchParams.get("status") || "";
    const customerNameParam = searchParams.get("customerName") || "";

    setCurrentPage(Number(page));
    setStartDate(startDateParam);
    setEndDate(endDateParam);
    setStatus(statusParam);
    setCustomerName(customerNameParam);

    fetchOrders(
      page,
      startDateParam,
      endDateParam,
      statusParam,
      customerNameParam
    );
  }, [searchParams]);

  const fetchOrders = async (page, startDate, endDate, status, customerName) => {
    setLoading(true);
    try {
      const url = new URL(`${process.env.API}/admin/orders`);

      // Nếu endDate được thiết lập, thêm thời gian cuối ngày (23:59:59)
      let adjustedEndDate = endDate;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Đặt thời gian cuối ngày
        adjustedEndDate = end.toISOString(); // Định dạng thành chuỗi ISO
      }

      const params = {
        page,
        startDate,
        endDate: adjustedEndDate, // Sử dụng ngày đã điều chỉnh
        status,
        customerName,
      };
      url.search = new URLSearchParams(params).toString();

      const response = await fetch(url, { method: "GET" });
      const data = await response.json();

      setOrders(data.orders);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus, orderId) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ delivery_status: newStatus }),
        }
      );

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o._id === orderId ? { ...o, delivery_status: newStatus } : o
          )
        );
        toast.success("Order status updated successfully");
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("An error occurred while updating order status");
    }
  };
  const handleFilterClick = () => {
    const query = new URLSearchParams({
      page: 1,
      startDate,
      endDate,
      status,
      customerName,
    }).toString();

    router.push(`${pathname}?${query}`);
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatus("");
    setCustomerName("");
    router.push(`${pathname}`); // Reset URL query
  };

  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <h4 className="text-center">Recent Orders</h4>

          {/* Customer Name Filter */}
          <div className="mb-4">
            <label>Customer Name:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          {/* Date Filters */}
          <div className="mb-4">
            <label>Start Date:</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label>End Date:</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="mb-4">
            <label>Status:</label>
            <select
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="Not Processed">Not Processed</option>
              <option value="processing">Processing</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Filter and Clear Buttons */}
          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={handleFilterClick}>
              Filter
            </button>
            <button className="btn btn-secondary" onClick={handleClearFilters}>
              Clear
            </button>
          </div>

          {/* Orders Display */}
          {!loading && orders?.length > 0 ? (
            orders?.map((order) => (
              <div key={order._id} className="mb-4 p-4 alert alert-secondary">
                <table className="table table-striped">
                  <tbody>
                    <tr>
                      <th scope="row">Customer Name:</th>
                      <td>{order?.userId?.name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Charge ID:</th>
                      <td>{order?.chargeId}</td>
                    </tr>
                    <tr>
                      <th scope="row">Created:</th>
                      <td>{new Date(order?.createdAt).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <th scope="row">Payment Intent:</th>
                      <td>{order?.payment_intent}</td>
                    </tr>
                    <tr>
                      <th scope="row">Receipt:</th>
                      <td>
                        <a
                          href={order?.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Receipt
                        </a>
                      </td>
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
                      <td>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order?.amount_captured)}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Shopping Address:</th>
                      <td>{order?.shipping?.address?.line1}</td>
                    </tr>
                    <tr>
                      <th scope="row">Delivery Status</th>
                      <td>
                        <select
                          className="form-control"
                          onChange={(e) =>
                            handleStatusChange(e.target.value, order?._id)
                          }
                          value={order?.delivery_status}
                          disabled={order?.refunded}
                        >
                          <option value="Not Processed">Not Processed</option>
                          <option value="processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          {order?.refunded && (
                            <option value="Cancelled">Cancelled</option>
                          )}
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pathname={pathname}
      />
    </div>
  );
}