import { useSession, signOut } from "next-auth/react";
import { useSearch } from "@/context/search";
import Link from "next/link";
import { useProduct } from "@/context/product";
import { useCart } from "@/context/cart";
import { BsFillCartCheckFill } from "react-icons/bs";

export default function TopNav() {
  const { data, status } = useSession();
  const { cartItems } = useCart();

  const roleMapping = {
    admin: "Quản lý",
    user: "Khách hàng",
  };

  const translatedRole = roleMapping[data?.user?.role] || "Vai trò không xác định";

  // products
  const {
    productSearchQuery,
    setProductSearchQuery,
    fetchProductSearchResults,
  } = useProduct();

  const { searchQuery, setSearchQuery, fetchSearchResults } = useSearch();

  // console.log(data, status);

  return (
    <nav className="nav shadow justify-content-between mb-3 pt-3">
      <Link className="nav-link" href="/">
        🛒 ShineTech
      </Link>

      <Link className="nav-link" href="/products">
        Sản phẩm
      </Link>

      <Link className="nav-link" href="/categories">
        Danh mục
      </Link>

      <Link className="nav-link" href="/blogs">
        Bài viết
      </Link>

      <form
        className="d-flex mx-2"
        role="search"
        onSubmit={fetchProductSearchResults}
      >
        <input
          className="form-control"
          type="search"
          placeholder="Tìm kiếm sản phẩm"
          aria-label="Search"
          onChange={(e) => setProductSearchQuery(e.target.value)}
          value={productSearchQuery}
        />
        <button className="btn" type="submit" style={{ borderRadius: "20px" }}>
          &#128270;
        </button>
      </form>

      <form className="d-flex mx-2" role="search" onSubmit={fetchSearchResults}>
        <input
          className="form-control"
          type="search"
          placeholder="Tìm kiếm bài viết"
          aria-label="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
        <button className="btn" type="submit" style={{ borderRadius: "20px" }}>
          &#128270;
        </button>
      </form>

      <Link className="nav-link text-danger" href="/cart">
        <BsFillCartCheckFill size={25} /> {cartItems?.length}
      </Link>

      {status === "authenticated" ? (
        <div className="d-flex">
          <Link
            className="nav-link"
            href={`/dashboard/${data?.user?.role === "admin" ? "admin" : "user"
              }`}
          >
            {data.user.name} ({translatedRole})
          </Link>
          <a
            className="nav-link pointer"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Đăng xuất
          </a>
        </div>
      ) : (
        <div className="d-flex">
          <Link className="nav-link" href="/login">
            Đăng nhập
          </Link>
          <Link className="nav-link" href="/register">
            Đăng ký
          </Link>
        </div>
      )}
    </nav>
  );
}