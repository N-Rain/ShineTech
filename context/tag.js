"use client";
import { createContext, useState, useContext } from "react";
import toast from "react-hot-toast";
export const TagContext = createContext();
export const TagProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [updatingTag, setUpdatingTag] = useState(null);
  const createTag = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/tag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, parent: parentCategory }),
      });
      if (response.ok) {
        const newlyCreatedTag = await response.json();
        setTags((prevTags) => [newlyCreatedTag, ...prevTags]);
        toast.success("Thêm thẻ thành công");
        setName("");
        setParentCategory("");
      } else {
        const errorData = await response.json();
        toast.error(errorData.err || "Lỗi khi tạo thẻ");
      }
    } catch (err) {
      console.error("Error creating tag:", err);
      toast.error("Đã xảy ra lỗi khi tạo thẻ");
    }
  };
  const fetchTags = async () => {
    try {
      const response = await fetch(`${process.env.API}/tags`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      console.log("API URL:", `${process.env.API}/tags`);
      console.log("Response Status:", response.status); // Log status code

      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }

      const data = await response.json();
      console.log("Fetched Tags Data:", data); // Log dữ liệu đã fetch
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Không thể tải thẻ");
    }
  };



  const updateTag = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/tag/${updatingTag._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatingTag),
        }
      );
      if (!response.ok) {
        throw new Error("Lỗi khi cập nhật thẻ");
      }
      const updatedTag = await response.json();
      setTags((prevTags) =>
        prevTags.map((t) => (t._id === updatedTag._id ? updatedTag : t))
      );
      toast.success("Cập nhật thẻ thành công");
      setUpdatingTag(null);
      setParentCategory("");
    } catch (err) {
      console.error("Error updating tag:", err);
      toast.error("Đã xảy ra lỗi khi cập nhật thẻ");
    }
  };

  const deleteTag = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/tag/${updatingTag._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Lỗi khi xóa thẻ");
      }
      const deletedTag = await response.json();
      setTags((prevTags) =>
        prevTags.filter((t) => t._id !== deletedTag._id)
      );
      toast.success("Xóa thẻ thành công");
      setUpdatingTag(null);
      setParentCategory("");
    } catch (err) {
      console.error("Error deleting tag:", err);
      toast.error("Đã xảy ra lỗi khi xóa thẻ");
    }
  };

  return (
    <TagContext.Provider
      value={{
        name,
        setName,
        parentCategory,
        setParentCategory,
        createTag,
        tags,
        setTags,
        fetchTags,
        updatingTag,
        setUpdatingTag,
        updateTag,
        deleteTag,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};

export const useTag = () => useContext(TagContext);
