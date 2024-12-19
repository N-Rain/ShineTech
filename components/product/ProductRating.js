"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import Modal from "@/components/Modal";
import Stars from "@/components/product/Stars";
import { calculateAverageRating } from "@/utils/helpers";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function ProductRating({ product, leaveReview = true }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [productRatings, setProductRatings] = useState(product?.ratings || []);
  const [averageRating, setAverageRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingText, setRatingText] = useState("Để lại đánh giá của bạn");

  // did current user already leave a rating
  const alreadyRated = productRatings?.find(
    (rate) => rate?.postedBy?._id === session?.user?._id
  );

  useEffect(() => {
    if (alreadyRated) {
      setCurrentRating(alreadyRated?.rating);
      setComment(alreadyRated?.comment);
    } else {
      setCurrentRating(0);
      setComment("");
    }
  }, [alreadyRated]);

  useEffect(() => {
    if (productRatings) {
      const average = calculateAverageRating(productRatings);
      setAverageRating(average);
    }
  }, [product?.ratings]);

  const submitRating = async () => {
    if (status !== "authenticated") {
      toast.error("Vui lòng đăng nhập để đánh giá sản phẩm.");
      router.push(`/login?callbackUrl=${process.env.NEXTAUTH_URL}${pathname}`);
      return;
    }
    try {
      const response = await fetch(`${process.env.API}/user/product/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product?._id,
          rating: currentRating,
          comment,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setProductRatings(data?.ratings);
        setShowRatingModal(false);
        toast.success("Bạn đã đánh giá sản phẩm thành công");
        setRatingText("Cập nhật đánh giá của bạn");
        router.refresh(); // only works in server components
      } else if (response.status === 400) {
        const errorData = await response.json();
        toast.error(errorData.err);
      } else {
        // Handle other error scenarios
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi đánh giá sản phẩm");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <small className="text-muted">
          <Stars rating={averageRating} /> (
          {productRatings?.length &&
            `Đánh giá trung bình là ${averageRating?.toFixed(2)} sao từ ${
              productRatings?.length
            } lượt đánh giá`}
          )
        </small>

        {leaveReview && (
          <small className="text-muted pointer">
            <span className="pointer" onClick={(e) => setShowRatingModal(true)}>
              {ratingText}
            </span>
          </small>
        )}
      </div>
      {/* rating modal */}
      {showRatingModal && (
        <Modal>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Hãy viết đánh giá của bạn"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="pointer">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <span
                  key={ratingValue}
                  className={
                    ratingValue <= currentRating ? "star-active lead" : "lead"
                  }
                  onClick={() => setCurrentRating(ratingValue)}
                  role="img"
                >
                  {ratingValue <= currentRating ? (
                    <FaStar className="text-danger" />
                  ) : (
                    <FaRegStar />
                  )}
                </span>
              );
            })}
          </div>

          <button
            onClick={submitRating}
            className="btn btn-primary btn-raised mt-3"
          >
            Xác nhận
          </button>
          
        </Modal>
      )}
    </>
  );
}