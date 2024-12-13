"use client";
import { useEffect, useState } from "react";
import { useProduct } from "@/context/product";
import { useCategory } from "@/context/category";
import { useTag } from "@/context/tag";
export default function ProductCreate() {
  // context
  const {
    product,
    setProduct,
    updatingProduct,
    setUpdatingProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImages,
    uploading,
    deleteImage,
    colorOptions,
    setColorOptions,
    selectedColor,
    setSelectedColor,
  } = useProduct();

  const { categories, fetchCategories } = useCategory();
  const { tags, fetchTags } = useTag();
  const [colorInput, setColorInput] = useState(""); //
  const selectedTags = Array.isArray(tags)
    ? tags.filter((tag) => tag.parent?._id === (updatingProduct?.category?._id || product?.category?._id || ""))
    : [];

  const handleAddColor = () => {
    if (colorInput.trim()) {
      const updatedColors = [...(product.colors || []), colorInput];
      setProduct({ ...product, colors: updatedColors });
      setColorInput(""); // Reset ô nhập liệu
    }
  };
  const imagePreviews = updatingProduct
    ? updatingProduct?.images
    : product
      ? product?.images
      : [];

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  return (
    <>
      <p className="lead">{updatingProduct ? "Update" : "Create"} Product</p>
      <label>
        Title <span style={{ color: "red" }}> *</span>
      </label>

      <input
        type="text"
        placeholder="Enter Title"
        value={updatingProduct ? updatingProduct?.title : product?.title}
        onChange={(e) =>
          updatingProduct
            ? setUpdatingProduct({ ...updatingProduct, title: e.target.value })
            : setProduct({ ...product, title: e.target.value })
        }
        className="form-control p-2 my-2"
      />
      <label>
        Description <span style={{ color: "red" }}> *</span>
      </label>
      <textarea
        placeholder="Enter Description"
        value={
          updatingProduct ? updatingProduct.description : product?.description
        }
        onChange={(e) =>
          updatingProduct
            ? setUpdatingProduct({
              ...updatingProduct,
              description: e.target.value,
            })
            : setProduct({ ...product, description: e.target.value })
        }
        className="form-control p-2 my-2"
      />
      <label>
        Price <span style={{ color: "red" }}>*</span>
      </label>
      <div className="form-group">
        <input
          type="number"
          placeholder="Enter Price >= 1000"
          min="1000"
          name="price"
          className="form-control p-2 my-2"
          value={updatingProduct ? updatingProduct.price : product?.price}
          onChange={(e) => {
            updatingProduct
              ? setUpdatingProduct({
                ...updatingProduct,
                price: e.target.value,
              })
              : setProduct({ ...product, price: e.target.value });
          }}
        />
      </div>

      {updatingProduct && (
        <div className="form-group">
          <label>
            Previous Price <span style={{ color: "red" }}> *</span>
          </label>
          <input
            type="number"
            placeholder="Enter Previous Price"
            min="1"
            name="previousPrice"
            className="form-control p-2 my-2"
            value={updatingProduct?.previousPrice}
            onChange={(e) => {
              setUpdatingProduct({
                ...updatingProduct,
                previousPrice: e.target.value,
              });
            }}
          />
        </div>
      )}

      {/* <div className="form-group">
        <input
          type="text"
          placeholder="Color"
          name="price"
          className="form-control p-2 my-2"
          value={updatingProduct ? updatingProduct.color : product?.color}
          onChange={(e) => {
            updatingProduct
              ? setUpdatingProduct({
                ...updatingProduct,
                color: e.target.value,
              })
              : setProduct({ ...product, color: e.target.value });
          }}
        />
      </div> */}
      <div className="form-group">
        <label>
          Add color <span style={{ color: "red" }}> *</span>
        </label>
        <input
          type="text"
          placeholder="Enter Add color"
          value={colorInput}
          onChange={(e) => setColorInput(e.target.value)}
          className="form-control p-2 my-2"
        />
        <button
          type="button"
          onClick={() => {
            if (colorInput.trim()) {
              const updatedColors = updatingProduct
                ? [...(updatingProduct?.colors || []), colorInput]
                : [...(product?.colors || []), colorInput];

              if (updatingProduct) {
                setUpdatingProduct({
                  ...updatingProduct,
                  colors: updatedColors,
                });
              } else {
                setProduct({ ...product, colors: updatedColors });
              }

              setColorInput(""); // Reset ô nhập liệu
            }
          }}
          className="btn btn-primary"
        >
          Add Color
        </button>
      </div>

      <div className="form-group">
        <div className="d-flex flex-wrap">
          {(updatingProduct?.colors || product?.colors || []).map(
            (color, index) => (
              <div
                key={index}
                className="mx-3 d-flex align-items-center justify-content-center"
              >
                {color}
                <div
                  onClick={() => {
                    const filteredColors = updatingProduct
                      ? updatingProduct.colors.filter((_, i) => i !== index)
                      : product.colors.filter((_, i) => i !== index);

                    updatingProduct
                      ? setUpdatingProduct({
                        ...updatingProduct,
                        colors: filteredColors,
                      })
                      : setProduct({ ...product, colors: filteredColors });
                  }}
                  className="pointer m-1"
                >
                  ❌
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="form-group">
        <label>
          Brand <span style={{ color: "red" }}> *</span>
        </label>
        <input
          type="text"
          placeholder="Enter Brand"
          name="brand"
          className="form-control p-2 my-2"
          value={updatingProduct ? updatingProduct.brand : product?.brand}
          onChange={(e) => {
            updatingProduct
              ? setUpdatingProduct({
                ...updatingProduct,
                brand: e.target.value,
              })
              : setProduct({ ...product, brand: e.target.value });
          }}
        />

        <div className="form-group">
          <label>
            Stock <span style={{ color: "red" }}> *</span>
          </label>
          <input
            type="number"
            // min="1"
            placeholder="Enter Stock >= 1"
            name="Stock"
            className="form-control p-2 my-2"
            value={updatingProduct ? updatingProduct.stock : product?.stock}
            onChange={(e) => {
              updatingProduct
                ? setUpdatingProduct({
                  ...updatingProduct,
                  stock: e.target.value,
                })
                : setProduct({ ...product, stock: e.target.value });
            }}
          />
        </div>

        <div className="form-group">
          <label>Select category</label>
          <select
            name="category"
            className="form-control p-2 my-2"
            onChange={(e) => {
              const categoryId = e.target.value;
              const categoryName =
                e.target.options[e.target.selectedIndex].getAttribute("name");
              const category = categoryId
                ? { _id: categoryId, name: categoryName }
                : null; // Set the category to null if no value is selected

              if (updatingProduct) {
                setUpdatingProduct({
                  ...updatingProduct,
                  category: category,
                  tag: [],
                });
              } else {
                setProduct({
                  ...product,
                  category: category,
                  tag: [],
                });
              }
            }}
            value={
              updatingProduct
                ? updatingProduct?.category?._id || "" // Make sure to handle the case when updatingProduct.category is null or undefined
                : product?.category?._id || "" // Make sure to handle the case when product.category is null or undefined
            }
          >
            <option value="" disabled>
              Enter Select category
            </option>
            {categories.length > 0 &&
              categories.map((c) => (
                <option key={c._id} value={c._id} name={c.name}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
        {selectedTags.map((tag) => (
          <div key={tag._id}>
            <input
              type="checkbox"
              value={tag._id}
              checked={
                updatingProduct
                  ? updatingProduct.tags?.includes(tag._id)
                  : product.tags?.includes(tag._id)
              }
              onChange={(e) => {
                const updatedTags = e.target.checked
                  ? updatingProduct
                    ? [...(updatingProduct.tags || []), tag._id]
                    : [...(product.tags || []), tag._id]
                  : updatingProduct
                    ? updatingProduct.tags.filter((id) => id !== tag._id)
                    : product.tags.filter((id) => id !== tag._id);

                if (updatingProduct) {
                  setUpdatingProduct({ ...updatingProduct, tags: updatedTags });
                } else {
                  setProduct({ ...product, tags: updatedTags });
                }
              }}
            />
            {tag.name}
          </div>
        ))}


        <div className="form-group mt-3">
          <label
            className={`btn btn-primary col-12 ${uploading ? "disabled" : ""}`}
          >
            {uploading ? "Processing..." : "Upload images"}
            <input
              type="file"
              multiple
              hidden
              accept="images/*"
              onChange={uploadImages}
              disabled={uploading}
            />
          </label>
          {imagePreviews?.length === 0 && (
            <small className="text-danger">
              At least one image is required.
            </small>
          )}
        </div>

        <div className="d-flex justify-content-center">
          {imagePreviews?.length > 0
            ? imagePreviews.map((img) => (
              <div key={img.public_id}>
                <img
                  src={img.secure_url}
                  className="img-thumbnail mx-1 shadow"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "10%",
                    // overflow: "hidden",
                  }}
                />
                <br />
                <div
                  className="text-center pointer mt-3"
                  onClick={() => deleteImage(img.public_id)}
                >
                  ❌
                </div>
              </div>
            ))
            : ""}
        </div>
      </div>

      {/* BUTTONS FOR UPDATE / DELETE */}

      <div className="d-flex justify-content-between mt-3">
        {/* <button
          className={`btn btn-raised bg-${
            updatingProduct ? "info" : "primary"
          } text-light`}
          onClick={(e) => {
            e.preventDefault();
            updatingProduct ? updateProduct() : createProduct();
          }}
        >
          {updatingProduct ? "Update" : "Create"}
        </button> */}
        <button
          className={`btn btn-raised bg-${updatingProduct ? "info" : "primary"
            } text-light`}
          onClick={(e) => {
            e.preventDefault();
            // Kiểm tra xem có hình ảnh trước khi tạo sản phẩm
            if (!(imagePreviews?.length > 0)) {
              alert("At least one image is required.");
              return;
            }
            updatingProduct ? updateProduct() : createProduct();
          }}
        >
          {updatingProduct ? "Update" : "Create"}
        </button>

        {updatingProduct && (
          <>
            <button
              className={`btn bg-danger text-light`}
              onClick={(e) => {
                e.preventDefault();
                deleteProduct();
              }}
            >
              Delete
            </button>

            <button
              className="btn bg-success text-light"
              onClick={() => window.location.reload()}
            >
              Clear
            </button>
          </>
        )}
      </div>
      {/* <pre>{JSON.stringify(product, null, 4)}</pre> */}
    </>
  );
}
