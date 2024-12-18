"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <>
      <nav className="nav justify-content-center mb-3">
        <Link
          className={`nav-link ${isActive("/dashboard/admin") ? "active-link" : ""}`}
          href="/dashboard/admin"
        >
          Thống kê
        </Link>
        <Link
          className={`nav-link ${isActive("/dashboard/admin/blog/create") ? "active-link" : ""}`}
          href="/dashboard/admin/blog/create"
        >
          Thêm Bài viết
        </Link>
        <Link
          className={`nav-link ${isActive("/dashboard/admin/blog/list") ? "active-link" : ""}`}
          href="/dashboard/admin/blog/list"
        >
          Danh sách Bài viết
        </Link>
        <Link
          className={`nav-link ${isActive("/dashboard/admin/category") ? "active-link" : ""}`}
          href="/dashboard/admin/category"
        >
          Quản lý Danh mục
        </Link>
        <Link
          className={`nav-link ${isActive("/dashboard/admin/tag") ? "active-link" : ""}`}
          href="/dashboard/admin/tag"
        >
          Quản lý Thẻ
        </Link>
        <Link
          className={`nav-link ${isActive("/dashboard/admin/product") ? "active-link" : ""}`}
          href="/dashboard/admin/product"
        >
          Thêm Sản phẩm
        </Link>
        <Link
          className={`nav-link ${isActive("/dashboard/admin/products") ? "active-link" : ""}`}
          href="/dashboard/admin/products"
        >
          Danh sách Sản phẩm
        </Link>
        <Link
          className={`nav-link ${isActive("/dashboard/admin/orders") ? "active-link" : ""}`}
          href="/dashboard/admin/orders"
        >
          Quản lý Đơn hàng
        </Link>
        <Link
          className={`nav-link ${isActive("/dashboard/admin/product/reviews") ? "active-link" : ""}`}
          href="/dashboard/admin/product/reviews"
        >
          Đánh giá Sản phẩm
        </Link>
      </nav>
      {children}
    </>
  );
}
