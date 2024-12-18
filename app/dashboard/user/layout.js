import Link from "next/link";

export default function UserLayout({ children }) {
  return (
    <>
      <nav className="nav justify-content-center mb-3">
        <Link className="nav-link" href="/dashboard/user">
          Thống kê
        </Link>
        <Link className="nav-link" href="/dashboard/user/liked/blogs">
          Bài viết yêu thích
        </Link>
        <Link className="nav-link" href="/dashboard/user/liked/products">
          Sản phẩm yêu thích
        </Link>
        <Link className="nav-link" href="/dashboard/user/orders">
          Lịch sử đơn hàng
        </Link>
        <Link className="nav-link" href="/dashboard/user/product/reviews">
          Bài đánh giá Sản phẩm
        </Link>
      </nav>
      {children}
    </>
  );
}
