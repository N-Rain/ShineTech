"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useProduct } from "@/context/product";
import { BsFillCartCheckFill } from "react-icons/bs";
import { useCart } from "@/context/cart";
export default function TopNav() {
  // console.table({ data, status, loading });

  const { data, status } = useSession();
  const { cartItems } = useCart();
  // console.table({ data, status });
  const { productSearchQuery, setProductSearchQuery,
    fetchProductSearchResults } =
    useProduct();


  return (
    <nav className="nav shadow p-2 justify-content-between mb-3">
      <div className="d-flex">
        <Link className="nav-link" href="/">
          🛒 SHINETECH
        </Link>
        <Link className="nav-link" href="/shop">
          SHOP
        </Link>
      </div>
      <form
        className="d-flex mx-2"
        role="search"
        onSubmit={fetchProductSearchResults}
      >
        <input
          className="form-control"
          type="search"
          placeholder="Search products"
          aria-label="Search"
          onChange={(e) => setProductSearchQuery(e.target.value)}
          value={productSearchQuery}
        />
        <button className="btn" type="submit" style={{ borderRadius: "20px" }}>
          &#128270;
        </button>
      </form>
      <div className="d-flex justify-content-end">
        <Link className="nav-link text-danger" href="/cart">
          <BsFillCartCheckFill size={25} /> {cartItems?.length}
        </Link>
        {status === "authenticated" ? (
          <>
            <Link
              className="nav-link"
              href={`/dashboard/${data?.user?.role === "admin" ? "admin" : "user"
                }`}
            >
              {data?.user?.name} ({data?.user?.role})
            </Link>
            <a
              className="nav-link pointer"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Logout
            </a>
          </>
        ) : status === "loading" ? (
          <a className="nav-link text-danger">Loading...</a>
        ) : (
          <>

            <Link className="nav-link" href="/login">
              Login
            </Link>
            <Link className="nav-link" href="/register">
              Register
            </Link>
          </>
        )}
      </div>

    </nav>
  );
}
