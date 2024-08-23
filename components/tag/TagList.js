"use client";
import { useEffect } from "react";
import { useTag } from "@/context/tag";
import { useCategory } from "@/context/category";
export default function TagList() {
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
  return <div>TagList</div>
}