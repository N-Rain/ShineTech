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

  const fetchOrders = async (
    page,
    startDate,
    endDate,
    status,
    customerName
  ) => {
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
        toast.success("Cập nhật trạng thái đơn thành công!");
      } else {
        toast.error("Đã có lỗi xảy ra khi cập nhật đơn hàng!");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Đã có lỗi xảy ra khi cập nhật đơn hàng!");
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
          <h4 className="text-center">Quản lý Đơn hàng</h4>

          {/* Customer Name Filter */}
          <div className="mb-4">
            <label>Tên Khách hàng:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên khách hàng"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          {/* Date Filters */}
          <div className="mb-4">
            <label>Từ ngày:</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label>Đến ngày:</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="mb-4">
            <label>Trạng thái:</label>
            <select
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="Not Processed">Chưa xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="Dispatched">Đã gửi đi</option>
              <option value="Delivered">Đã giao</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Filter and Clear Buttons */}
          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={handleFilterClick}>
              Lọc
            </button>
            <button className="btn btn-secondary" onClick={handleClearFilters}>
              Xóa
            </button>
          </div>

          {/* Orders Display */}
          {!loading && orders?.length > 0 ? (
            orders?.map((order) => (
              <div key={order._id} className="mb-4 p-4 alert alert-secondary">
                <table className="table table-striped">
                  <tbody>
                    <tr>
                      <th scope="row">Tên Khách hàng:</th>
                      <td>{order?.userId?.name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Mã Thanh toán:</th>
                      <td>{order?.chargeId}</td>
                    </tr>
                    <tr>
                      <th scope="row">Thời gian tạo:</th>
                      <td>{new Date(order?.createdAt).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <th scope="row">Yêu cầu thanh toán:</th>
                      <td>{order?.payment_intent}</td>
                    </tr>
                    <tr>
                      <th scope="row">Hóa đơn:</th>
                      <td>
                        <a href={order?.receipt_url} target="_blank">
                          Xem chi tiết hóa đơn
                        </a>
                      </td>
                    </tr>

                    <tr>
                      <th scope="row">Tổng thanh toán:</th>
                      <td>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(order?.amount_captured)}
                      </td>
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
                        {order?.shipping?.address?.city},{" "}
                        {order?.shipping?.address?.state}
                        <br />
                        {order?.shipping?.address?.country}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="w-25">
                        Sản phẩm đã đặt:
                      </th>
                      <td className="w-75">
                        {order?.cartItems?.map((product) => (
                          <div
                            className="pointer text-primary"
                            key={product._id}
                            onClick={() =>
                              router.push(`/product/${product?.slug}`)
                            }
                          >
                            {product?.quantity} x {product?.title} (
                            {new Intl.NumberFormat("vi-VN").format(
                              product?.price
                            ) + " VND"}
                            )
                          </div>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Trạng thái vận chuyển</th>
                      <td>
                        <select
                          className="form-control"
                          onChange={(e) =>
                            handleStatusChange(e.target.value, order?._id)
                          }
                          value={order?.delivery_status}
                          disabled={order?.refunded}
                        >
                          <option value="Not Processed">Chưa xử lý</option>
                          <option value="processing">Đang xử lý</option>
                          <option value="Dispatched">Đã gửi đi</option>
                          {order?.refunded && (
                            <option value="Cancelled">Đã hủy</option>
                          )}
                          <option value="Delivered">Đã giao</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>Chưa có đơn hàng.</p>
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
