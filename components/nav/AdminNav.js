import Link from "next/link";

export default function AdminNav() {
  return (
    <nav className="nav justify-content-center mb-3">
      <Link href={"/dashboard/admin"} className="nav-link">
        Thống kê
      </Link>
      <Link className="nav-link" href="/dashboard/admin/blog/create">
        Thêm Bài viết
      </Link>
      <Link className="nav-link" href="/dashboard/admin/blog/list">
        Danh sách Bài viết
      </Link>
      <Link href={"/dashboard/admin/category"} className="nav-link">
        Quản lý Danh mục
      </Link>
      <Link clasfixsName="nav-link" href="/dashboard/admin/tag">
        Quản lý Thẻ
      </Link>
      <Link className="nav-link" href={"/dashboard/admin/product"}>
        Thêm Sản phẩm
      </Link>
      <Link className="nav-link" href="/dashboard/admin/products">
        Danh sách Sản phẩm
      </Link>
      <Link className="nav-link" href="/dashboard/admin/orders">
        Quản lý Đơn hàng
      </Link>
      <Link className="nav-link" href="/dashboard/admin/product/reviews">
        Các bài Đánh giá Sản phẩm
      </Link>
    </nav>
  );
}
