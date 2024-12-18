"use client";
import { useEffect } from "react";
import { useTag } from "@/context/tag";
import TagCreate from "@/components/tag/TagCreate";
import TagsList from "@/components/tag/TagList";

export default function Tags() {
  const { fetchTags } = useTag();
  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <h4 className="text-center">Quản lý Thẻ</h4>
          <TagCreate />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <h4 className="text-center mb-4">Danh sách Thẻ</h4>
          <TagsList />
        </div>
      </div>
    </div>
  );
}