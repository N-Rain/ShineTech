import Link from "next/link";

export default function AdminNav() {
  return (
    <nav className="nav justify-content-center mb-3">
      <Link href={"/dashboard/admin"} className="nav-link">
        Admin
      </Link>
      <Link href={"/dashboard/admin/category"} className="nav-link">
        Categories
      </Link>
      <Link clasfixsName="nav-link" href="/dashboard/admin/tag">
        Tags
      </Link>
      <Link className="nav-link" href={"/dashboard/admin/product"}>
        Add Product
      </Link>
      <Link className="nav-link" href="/dashboard/admin/products">
        Products List
      </Link>
      <Link className="nav-link" href="/dashboard/admin/orders">
        Orders
      </Link>
    </nav>
  );
}
