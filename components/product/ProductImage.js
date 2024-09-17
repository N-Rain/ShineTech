// "use client";
// import Image from "next/image";
// import { useState, useEffect } from "react";

// export default function ProductImage({ product }) {
//   const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
//   const [currentImagePreviewUrl, setCurrentImagePreviewUrl] = useState("");
 
//   const openModal = (url) => {
//     setCurrentImagePreviewUrl(url);
//     setShowImagePreviewModal(true);
//   };

//   const closeModal = () => {
//     setShowImagePreviewModal(false);
//     setCurrentImagePreviewUrl("");
//   };

//   const showImage = (src, title) => (
//     <Image
//       src={src}
//       className="card-img-top"
//       width={500}
//       height={300}
//       style={{ objectFit: "contain", height: "100%", width: "100%" }}
//       alt={title}
//     />
//   );
//   return (
//     <>
//       {showImagePreviewModal && (
//         <div className="modal fade show" style={{ display: "block" }}>
//           <div
//             className="modal-dialog modal-dialog-centered modal-lg"
//             style={{ height: "calc(100% - 60px)" }}
//           >
//             <div
//               className="modal-content"
//               style={{ height: "calc(100% - 60px)" }}
//             >
//               <div className="modal-body overflow-auto">
//                 {showImage(currentImagePreviewUrl, product?.title)}
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   data-bs-dismiss="modal"
//                   onClick={closeModal}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="d-flex justify-content-center align-items-center">
//         {product?.images?.length > 0 ? (
//           <>
//             {product?.images?.map((image) => (
//               <div
//                 key={image.public_id}
//                 style={{ height: "350px", overflow: "hidden" }}
//                 className="pointer"
//                 onClick={() => openModal(image?.secure_url)}
//               >
//                 {showImage(image?.secure_url, product?.title)}
//               </div>
//             ))}
//           </>
//         ) : (
//           <div
//             style={{ height: "350px", overflow: "hidden" }}
//             className="pointer"
//             onClick={() => openModal("/images/default.jpeg")}
//           >
//             {showImage("/images/default.jpeg", product?.title)}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useProduct } from "@/context/product";
import Modal from "@/components/Modal";

export default function ProductImage({ product }) {
  const {
    showImagePreviewModal,
    currentImagePreviewUrl,
    openImagePreviewModal,
  } = useProduct();

  // const closeModal = () => {
  //   setShowImagePreviewModal(false);
  // };

  // useEffect(() => {
  //   window.addEventListener("click", handleClickOutside);
  //   return () => {
  //     window.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  // const handleClickOutside = (event) => {
  //   if (event.target.classList.contains("modal")) {
  //     closeModal();
  //   }
  // };

  const showImage = (src, alt) => (
    <Image
      src={src}
      className="card-img-top pointer"
      width={500}
      height={300}
      style={{ objectFit: "cover", height: "100%", width: "100%" }}
      alt={alt}
    />
  );

  return (
    <>
      {showImagePreviewModal && (
        <Modal>{showImage(currentImagePreviewUrl, product?.title)}</Modal>
      )}
      {/* {showImagePreviewModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-body">
                {showImage(currentImagePreviewUrl, product.title)}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      <div className="d-flex justify-content-center align-items-center">
        {product?.images?.length > 0 ? (
          product?.images?.map((image, index) => (
            <div
              key={image?.public_id}
              style={{ height: "350px", overflow: "hidden", cursor: "pointer" }}
              onClick={() => openImagePreviewModal(image?.secure_url)}
            >
              {showImage(image?.secure_url, product?.title)}
            </div>
          ))
        ) : (
          <div
            style={{ height: "350px", overflow: "hidden", cursor: "pointer" }}
            onClick={() => openImagePreviewModal("/images/hn2.jpeg")}
          >
            {showImage("/images/hn2.jpeg", product?.title)}
          </div>
        )}
      </div>
    </>
  );
}