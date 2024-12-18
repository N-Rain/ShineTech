import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import BlogLike from "@/components/blog/BlogLike";
import Image from "next/image";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export default function BlogCard({ blog }) {
  return (
    <div className="card mb-4">
      <div style={{ height: "200px", overflow: "hidden", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Image
          src={blog?.image?.secure_url || "/images/new-wave.jpeg"}
          className="card-img-top"
          width={500}
          height={300}
          style={{ objectFit: "cover", height: "100%", width: "100%", borderRadius: "10px" }}
          alt={blog.title}
        />
      </div>
      <div className="card-body">
        <h5 className="card-title" style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "10px" }}>
          {blog.title}
        </h5>
        <div className="card-text" style={{ maxHeight: "250px", overflowY: "auto", lineHeight: "1.6", fontSize: "0.95rem", color: "#333" }}>
          <div
            dangerouslySetInnerHTML={{
              __html: blog?.content || "",
            }}
          ></div>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-between align-items-center" style={{ backgroundColor: "#f8f9fa" }}>
        <small className="text-muted">Danh mục: {blog.category}</small>
        <small className="text-muted">Tác giả: {blog.postedBy?.name || "Admin"}</small>
      </div>
      <div className="card-footer d-flex justify-content-between align-items-center" style={{ backgroundColor: "#f8f9fa" }}>
        <BlogLike blog={blog} />
        <small className="text-muted">Đã thích {dayjs(blog.updatedAt).fromNow()}</small>
      </div>
    </div>
  );
}
