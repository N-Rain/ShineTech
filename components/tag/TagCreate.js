"use client";
import { useEffect } from "react";
import { useTag } from "@/context/tag";
import { useCategory } from "@/context/category";

export default function TagCreate() {
  const {
    name,
    setName,
    parentCategory,
    setParentCategory,
    updatingTag,
    setUpdatingTag,
    createTag,
    updateTag,
    deleteTag,
  } = useTag();
  const { fetchCategories, categories } = useCategory();
  useEffect(() => {
    fetchCategories();
  }, [])
  return <div>
    <input type="text" value={updatingTag ? updatingTag?.name : name} onChange={e => {
      if (updatingTag) {
        setUpdatingTag({ ...updatingTag, name: e.target.value });
      } else {
        setName(e.target.value);
      }
    }}
      className="form-control my-2 p-2" />
    <div className="form-group mt-4">
      <label>Parent category</label>
      <select
        name="category"
        className="form-control"
        onChange={(e) => setParentCategory(e.target.value)}>
        <option>Select a category</option>
        {categories?.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>
    </div>
  </div>;
}