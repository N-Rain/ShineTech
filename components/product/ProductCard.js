import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Stars from "./Stars";
import { calculateAverageRating } from "@/utils/helpers";
import AddToCart from "@/components/product/AddToCart";
dayjs.extend(relativeTime);

export default function ({ product }) {
  return (
    <div key={product?._id} className="card my-3">
      <div style={{ height: "200px", overflow: "hidden" }}>
        <Image
          src={product?.images?.[0]?.secure_url || "/images/hn2.jpeg"}
          width={500}
          height={300}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          alt={product?.title}
        />
      </div>
      <div className="card-body">
        <Link href={`/product/${product?.slug}`}>
          <h5 className="card-title">{product?.price?.toFixed(2)} VND {product?.title}</h5>
        </Link>
        <div
          dangerouslySetInnerHTML={{
            __html:
              product?.description?.length > 160
                ? `${product?.description?.substring(0, 160)}..`
                : product?.description,
          }}
        />
      </div>
      <div className="card-footer d-flex justify-content-between">
        <small>Category: {product?.category?.name}</small>
        <small>Tags: {product?.tags?.map((t) => t?.name).join(" ")}</small>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <small>❤️ Likes</small>
        <small>Posted {dayjs(product?.createdAt).fromNow()}</small>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <small>Brand: {product?.brand}</small>
        {/* <small>⭐ Stars</small> */}
        <div>
            <small>
              <Stars rating={calculateAverageRating(product?.ratings)} />
            </small>
            <small className="text-muted ml-1">
              {`(${product?.ratings?.length})`}
            </small>
          </div>
      </div>

      <div className="card-footer">
        <AddToCart product={product} />
      </div>
    </div>
  );
}
