import Link from "next/link";

export function searchParamsToObject(searchParams) {
  const params = {};
  
  // Nếu searchParams không phải là URLSearchParams, tạo mới
  const searchParamsObj = searchParams instanceof URLSearchParams ? searchParams : new URLSearchParams(searchParams);

  for (const [key, value] of searchParamsObj.entries()) {
    params[key] = value;
  }

  return params;
}
export default function Pagination({
  currentPage,
  totalPages,
  pathname,
  searchParams,
}) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  // Chuyển searchParams thành object


  const currentQuery = searchParamsToObject(searchParams);
  return (
    <div className="d-flex justify-content-center">
      <nav aria-label="Page navigation">
        <ul className="pagination">
          {hasPreviousPage && (
            <li className="page-item">
              <Link
                className="page-link px-3"
                href={{
                  pathname,
                  query: {
                    // ...searchParams,
                    ...currentQuery, // Giữ các thông tin lọc hiện tại

                    page: currentPage - 1,
                  },
                }}
              >
                Trước
              </Link>
            </li>
          )}

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return (
              <li
                key={page}
                className={`page-item${currentPage === page ? " active" : ""}`}
              >
                <Link
                  className="page-link"
                  href={{
                    pathname,
                    query: {
                      // ...searchParams,
                      ...currentQuery, // Giữ các thông tin lọc hiện tại

                      page,
                    },
                  }}
                >
                  {page}
                </Link>
              </li>
            );
          })}

          {hasNextPage && (
            <li className="page-item">
              <Link
                className="page-link px-3"
                href={{
                  pathname,
                  query: {
                    // ...searchParams,
                    ...currentQuery, // Giữ các thông tin lọc hiện tại
                    page: currentPage + 1,
                  },
                }}
              >
                Tiếp
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
