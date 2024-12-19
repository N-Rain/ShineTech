"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserLayout({ children }) {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;
  return (
    <>
      <nav className="nav justify-content-center mb-3">
        <Link className={`nav-link ${isActive("/dashboard/user") ? "active-link" : ""}`} href="/dashboard/user">
          Thống kê
        </Link>
        <Link className={`nav-link ${isActive("/dashboard/user/liked/blogs") ? "active-link" : ""}`} href="/dashboard/user/liked/blogs">
          Bài viết yêu thích
        </Link>
        <Link className={`nav-link ${isActive("/dashboard/user/liked/products") ? "active-link" : ""}`} href="/dashboard/user/liked/products">
          Sản phẩm yêu thích
        </Link>
        <Link className={`nav-link ${isActive("/dashboard/user/orders") ? "active-link" : ""}`} href="/dashboard/user/orders">
          Lịch sử đơn hàng
        </Link>
        <Link className={`nav-link ${isActive("/dashboard/user/product/reviews") ? "active-link" : ""}`} href="/dashboard/user/product/reviews">
          Bài đánh giá Sản phẩm
        </Link>
      </nav>
      {children}
    </>
  );
}
