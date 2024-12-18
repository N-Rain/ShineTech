"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import Resizer from "react-image-file-resizer";

export default function AdminBlogCreate() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // cloudinary - click on settings icon > preset > unsigned
  // const uploadImage = async (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setLoading(true);
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET); // replace with your upload_preset

  //     // upload to cloudinary
  //     try {
  //       const response = await fetch(process.env.CLOUDINARY_URL, {
  //         method: "POST",
  //         body: formData,
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         setImage(data.secure_url);
  //       } else {
  //         console.log("Image upload failed");
  //       }
  //     } catch (err) {
  //       console.log("Error uploading image:", err);
  //     }

  //     setLoading(false);
  //   }
  // };

  const uploadImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setLoading(true);

      Resizer.imageFileResizer(
        file,
        1280,
        720,
        "JPEG",
        100,
        0,
        (uri) => {
          fetch(`${process.env.API}/admin/upload/image`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: uri }),
          })
            .then((response) => response.json())
            .then((data) => {
              // console.log("IMAGE UPLOAD RES DATA", data);
              setImage(data);
            })
            .catch((err) => {
              console.log("CLOUDINARY UPLOAD ERR", err);
            })
            .finally(() => {
              setLoading(false);
            });
        },
        "base64"
      );
    }
  };

  const deleteImage = (public_id) => {
    setLoading(true);
    fetch(`${process.env.API}/admin/upload/image`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_id }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("IMAGE DELETE RES DATA", data);
        setImage({
          public_id: "",
          secure_url: "",
        });
      })
      .catch((err) => {
        toast.error("Lỗi xảy ra khi xóa ảnh!");
        console.log("CLOUDINARY DELETE ERR", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createBlog = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          category,
          image,
        }),
      });

      if (response.ok) {
        router.push("/dashboard/admin/blog/list");
        toast.success("Thêm bài viết thành công!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.err);
      }
    } catch (err) {
      console.log("err => ", err);
      toast.error("Đã có lỗi xảy ra khi thêm bài viết!");
    }
  };

  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <h4 className="text-center">Thêm Bài viết</h4>
          <label className="text-secondary">
            Tiêu đề <span style={{ color: "red" }}> *</span>
          </label>
          <input
            type="text"
            placeholder="Nhập tiêu đề bài viết"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control p-2 my-2"
          />

          <label className="text-secondary">
            Nội dung <span style={{ color: "red" }}> *</span>
          </label>
          <ReactQuill
            className="border rounded my-2"
            value={content}
            onChange={setContent}
          />

          <label className="text-secondary">
            Danh mục <span style={{ color: "red" }}> *</span>
          </label>
          <input
            type="text"
            placeholder="Nhập danh mục / thể loại bài viết"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-control p-2 my-2"
          />

          {image?.secure_url && (
            <div className="d-flex justify-content-start align-items-center">
              <img
                src={image.secure_url}
                alt="preview"
                style={{ width: "100px" }}
              />
              <div
                className="text-center pointer ml-2"
                onClick={() => deleteImage(img.public_id)}
              >
                ❌
              </div>
            </div>
          )}

          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-outline-secondary">
              <label className="mt-2" htmlFor="upload-button">
                {loading ? "Đang tải..." : "Đăng ảnh"}
              </label>
              <input
                id="upload-button"
                type="file"
                accept="image/*"
                hidden
                onChange={uploadImage}
              />
            </button>

            <button
              diasabled={loading}
              className="btn bg-primary text-light"
              onClick={createBlog}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
