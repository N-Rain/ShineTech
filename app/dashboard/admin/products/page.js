"use client";

import ProductList from "@/components/product/admin/ProductList";


export default function AdminProductsList() {
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <h4 className=" mb-4 text-center">Danh sách Sản phẩm</h4>
          <ProductList />
        </div>
      </div>
    </div>
  );
}
