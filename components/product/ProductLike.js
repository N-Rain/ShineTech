"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";

export default function ProductLike({ product }) {
  const { data, status } = useSession();
  const [likes, setLikes] = useState(product?.likes || []);

  const router = useRouter();
  const pathname = usePathname();

  const userId = data?.user?._id;
  const isLiked = likes.some(like => like.user.toString() === userId);

  const handleLike = async () => {
    if (status !== "authenticated") {
      toast.error("Please login to like");
      router.push(`/login?callbackUrl=${process.env.API.replace("/api", "")}${pathname}`);
      return;
    }

    try {
      const endpoint = isLiked ? "/user/product/unlike" : "/user/product/like";
      const actionMessage = isLiked ? "unliked" : "liked";

      const response = await fetch(`${process.env.API}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error response:", errorResponse);
        throw new Error(`Error occurred: ${errorResponse.message || 'Try again.'}`);
      }

      const responseData = await response.json();
      setLikes(responseData.likes || []);
      toast.success(`Product ${actionMessage}`);
      router.refresh();
    } catch (err) {
      console.error("Error liking/unliking product:", err);
      toast.error("Error liking/unliking product. Please try again.");
    }
  };

  return (
    <small className="text-muted pointer">
      {!likes.length ? (
        <span onClick={handleLike}>❤️ Be the first person to like</span>
      ) : (
        <span onClick={handleLike}>❤️ {likes.length} people liked</span>
      )}
    </small>
  );
}
