"use client";
import { createContext, useState, useContext } from "react";
import toast from "react-hot-toast";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [updatingCategory, setUpdatingCategory] = useState(null);
  const createCategory = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });
      if (response.ok) {
        toast.success("Thêm danh mục thành công");
        const newlyCreatedCategory = await response.json();
        setName("");
        setCategories([newlyCreatedCategory, ...categories]);
      } else {
        const errorData = await response.json();
        toast.error(errorData.err);
      }
    } catch (err) {
      console.log("err => ", err);
      toast.error("Đã xảy ra lỗi trong khi thêm danh mục");
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.API}/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const updateCategory = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/category/${updatingCategory._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatingCategory),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const updatedCategory = await response.json();
      setCategories((prevCategories) =>
        prevCategories.map((c) =>
          c._id === updatedCategory._id ? updatedCategory : c
        )
      );
      setUpdatingCategory(null);

      toast.success("Câp nhật danh mục thành công");
    } catch (err) {
      console.log("err => ", err);
      toast.error("Đã xảy ra lỗi trong khi cập nhật danh mục");
    }
  };
  const deleteCategory = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/category/${updatingCategory._id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const deletedCategory = await response.json();
      setCategories((prevCategories) =>
        prevCategories.filter((c) => c._id !== deletedCategory._id)
      );
      setUpdatingCategory(null);
      toast.success("Xóa danh mục thành công");
    } catch (err) {
      console.log("err => ", err);
      toast.error("Đã xảy ra lỗi trong khi xóa danh mục");
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        name,
        setName,
        createCategory,
        categories,
        setCategories,
        fetchCategories,
        updatingCategory,
        setUpdatingCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
export const useCategory = () => useContext(CategoryContext);