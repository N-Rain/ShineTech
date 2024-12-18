"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

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

  
  // State cho bộ lọc
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Lấy giá trị từ URL query
  useEffect(() => {
    const page = searchParams.get("page") || 1;
    const startDateParam = searchParams.get("startDate") || "";
    const endDateParam = searchParams.get("endDate") || "";
    const statusParam = searchParams.get("status") || "";

    setCurrentPage(Number(page));
    setStartDate(startDateParam);
    setEndDate(endDateParam);
    setStatus(statusParam);

    fetchOrders(page, startDateParam, endDateParam, statusParam);
  }, [searchParams]);

  const fetchOrders = async (page, startDate, endDate, status) => {
    setLoading(true);
    try {
      const url = new URL(`${process.env.API}/user/orders`);

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
        `${process.env.API}/user/orders/${orderId}`,
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
    }).toString();

    router.push(`${pathname}?${query}`);
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatus("");
    router.push(`${pathname}`); // Reset URL query
  };
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(
        `/api/user/orders/refund?orderId=${orderId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Hủy đơn thành công!");

        // Reload the page to fetch updated orders
        router.push(
          `${pathname}?${new URLSearchParams({
            page: currentPage,
            startDate,
            endDate,
            status,
          }).toString()}`
        );
      } else {
        const data = await response.json();
        toast.error(data.err || "Đã có lỗi xảy ra khi hủy đơn hàng!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi hủy đơn hàng!");
    }
  };

  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <h4 className="text-center">Lịch sử Đơn hàng</h4>

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
              <option value="Refunded">Đã hoàn tiền</option>
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
                        <a
                          href={order?.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
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
                      <th scope="row">Trạng thái vận chuyển:</th>
                      <td>
                        {translateDeliveryStatus(order?.delivery_status)}
                        {order?.delivery_status === "Not Processed" &&
                          !order.refunded && (
                            <>
                              <br />
                              <span
                                className="text-danger pointer"
                                onClick={() => handleCancelOrder(order?._id)}
                              >
                                Hủy đơn hàng
                              </span>
                            </>
                          )}
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
