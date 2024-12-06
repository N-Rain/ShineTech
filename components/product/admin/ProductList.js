"use client";
import { useEffect, useState } from "react";
import { useProduct } from "@/context/product";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import Image from "next/image";

export default function ProductList() {
  const {
    products,
    currentPage,
    totalPages,
    fetchProducts,
    setUpdatingProduct,
  } = useProduct();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stockFilter, setStockFilter] = useState("all");

  const fetchAdminSearchResults = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.API}/search/products?productSearchQuery=${adminSearchQuery}`
      );
      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching admin search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const displayProducts = searchResults.length > 0 ? searchResults : products;

  // Lọc sản phẩm theo số lượng tồn kho
  const filteredProducts = displayProducts.filter((product) => {
    if (stockFilter === "all") return true; // Không lọc
    if (stockFilter === "low") return product.stock <= 10 && product.stock > 0; // Tồn kho thấp
    if (stockFilter === "out") return product.stock === 0; // Hết hàng
    return product.stock > 10; // Tồn kho lớn hơn 10
  });
  const productsPerPage = 2;

  const totalPagesN = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    if (!adminSearchQuery) {
      fetchProducts(page);
    }
  }, [page, adminSearchQuery]);

  return (
    <div className="container mb-5">
      <form
        className="d-flex mb-4"
        role="search"
        onSubmit={fetchAdminSearchResults}
      >
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search products"
          aria-label="Search"
          value={adminSearchQuery}
          onChange={(e) => setAdminSearchQuery(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Lọc theo số lượng tồn kho */}
      <div className="mb-4">
        <label htmlFor="stockFilter" className="form-label">Filter by Stock : </label>
        <br />
        <select
          className="form-select form-select-sm w-auto mt-2"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="all">All Products</option>
          <option value="low">Low Stock </option>
          <option value="out">Out of Stock</option>
          <option value="in">In Stock </option>
        </select>
      </div>
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="col-lg-6 mb-4 pointer"
              onClick={() => {
                setUpdatingProduct(product);
                router.push(`/dashboard/admin/product`);
              }}
            >
              <div className="row g-0 justify-content-center align-items-center">
                <div className="col-md-4">
                  <div style={{ height: "100px", overflow: "hidden" }}>
                    <Image
                      src={product?.images?.[0]?.secure_url || "/images/hn2.jpeg"}
                      className="card-img-top"
                      width={500}
                      height={300}
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                      }}
                      alt={product?.title}
                    />
                  </div>
                </div>
                <div className="col-md-8 justify-content-center align-items-center">
                  <div className="card-body">
                    <h4 className="card-title">{product.title}</h4>
                    <h6>
                      {new Intl.NumberFormat("vi-VN").format(product?.price) +
                        " VND"}
                    </h6>{" "}
                    <div className="card-text text-secondary">
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            product?.description?.length > 160
                              ? `${product?.description.substring(0, 160)}...`
                              : product?.description,
                        }}
                      ></div>
                      <div className="row d-flex justify-content-between">
                        <p className="text-secondary">Sold: {product.sold}</p>
                        <p className="text-secondary">Stock: {product.stock}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-secondary">No products found.</p>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPagesN}
        pathname={pathname}
      />

    </div>
  );
}