import RatingDistribution from "@/components/product/RatingDistribution";
import Stars from "@/components/product/Stars";

export default function UserReviews({ reviews }) {
  return (
    <>
      {reviews?.length > 0 ? (
        <div>
          <RatingDistribution reviews={reviews} />

          {/* List of user reviews */}
          <ul className="list-group mt-4 bg-white">
            {reviews?.map((review) => (
              <li className="list-group-item mb-1" key={review?._id}>
                <div>
                  <p>
                    <strong>{review?.postedBy?.name}</strong>
                  </p>
                  <Stars rating={review?.rating} />
                  {review?.comment && <p className="mt-3">{review?.comment}</p>}
                  <div>
                    <p className="text-muted">
                      {new Date(review.createdAt).toLocaleString()}{" "}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Chưa có đánh giá nào dành cho sản phẩm này.</p>
      )}
    </>
  );
}
