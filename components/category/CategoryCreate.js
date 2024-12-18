"use client";
import { useCategory } from "@/context/category";
export default function AdminCreateCategory() {
  // context
  const {
    name,
    setName,
    updatingCategory,
    setUpdatingCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategory();
  return (
    <>
      <h5>Thêm Danh mục</h5>
      <label>
        Tên <span style={{ color: "red" }}> *</span>
      </label>
      <input
        type="text"
        placeholder="Nhập tên danh mục"
        value={updatingCategory ? updatingCategory.name : name}
        onChange={(e) =>
          updatingCategory
            ? setUpdatingCategory({
                ...updatingCategory,
                name: e.target.value,
              })
            : setName(e.target.value)
        }
        className="form-control p-2 my-2"
      />
      {/* <pre>{JSON.stringify(categoryUpdate, null, 4)}</pre> */}
      <div className="d-flex justify-content-between my-5">
        <button
          className={`btn bg-${
            updatingCategory ? "info" : "primary"
          } text-light`}
          onClick={(e) => {
            e.preventDefault();
            updatingCategory ? updateCategory() : createCategory();
          }}
        >
          {updatingCategory ? "Cập nhật" : "Thêm mới"}
        </button>
        {updatingCategory && (
          <>
            <button
              className={`btn bg-danger text-light`}
              onClick={(e) => {
                e.preventDefault();
                deleteCategory();
              }}
            >
              Xóa Danh mục
            </button>
            <button
              className="btn bg-success text-light"
              onClick={() => setUpdatingCategory(null)}
            >
              Xóa chỉnh sửa
            </button>
          </>
        )}
      </div>
    </>
  );
}
