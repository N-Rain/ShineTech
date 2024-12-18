import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import ProductRating from "@/components/product/ProductRating";
import AddToCart from "@/components/product/AddToCart";
import ProductLike from "./ProductLike";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export default function ({ product }) {
  return (
    <div key={product?._id} className="card my-3">
      <div style={{ height: "200px", overflow: "hidden" }}>
        <Image
          src={product?.images?.[0]?.secure_url || "/images/image.jpg"}
          width={500}
          height={300}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          alt={product?.title}
        />
      </div>

      <div className="card-body">
        <Link href={`/product/${product?.slug}`}>
          <h4 className="card-title">
            {/* <strong>{product?.price} VND</strong>  */}
            {product?.title}
          </h4>
          {/* <h5 className="card-title text-danger">
            {/* <strong>{product?.price} VND</strong> */}
            {/* <strong>
            🛍️{" "} {new Intl.NumberFormat("vi-VN").format(product?.price) + " VND"}
            </strong>{" "}
          </h5> */}
        </Link>
        {/* {product?.previousPrice > product?.price && (
          <h5 className="card-price text-primary">
            {/* 🛍️{" "} */}
            {/* <del>
              {new Intl.NumberFormat("vi-VN").format(product?.previousPrice) +
                " VND"}
            </del>
          </h5>
        )} */}
        <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title text-danger">
              <strong>
                🛍️{" "} {new Intl.NumberFormat("vi-VN").format(product?.price) + " VND"}
              </strong>{" "}
            </h5>
            {product?.previousPrice > product?.price && (
              <h5 className="card-price text-muted">
                <del>
                  {new Intl.NumberFormat("vi-VN").format(product?.previousPrice) + " VND"}
                </del>
              </h5>
            )}
          </div>
        <div
          dangerouslySetInnerHTML={{
            __html:
              product?.description?.length > 160
                ? `${product?.description?.substring(0, 160)}..`
                : product?.description,
          }}
        />
      </div>
      {/* before accessing category and tags, make sure .populate() is used in api routes and ref: 'Category' models are imported in `Product` model */}
      <div className="card-footer d-flex justify-content-between">
        <small>Danh mục: {product?.category?.name}</small>
        <small>Thẻ: {product?.tags?.map((t) => t?.name).join(" ")}</small>
      </div>

      <div className="card-footer d-flex justify-content-between">
        {/* <small>❤️ Likes</small> */}
        <ProductLike product={product} />
        <small>Đã thích {dayjs(product?.createdAt).fromNow()}</small>
      </div>

      <div className="card-footer d-flex justify-content-between align-items-center">
        <small>Nhãn hàng: {product?.brand}</small>
        <ProductRating product={product} leaveARating={false} />
      </div>

      <div className="card-footer">
        <AddToCart product={product} />
      </div>
    </div>
  );
}
