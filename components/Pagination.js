import Link from "next/link";

export default function Pagination({
  currentPage,
  totalPages,
  pathname,
  searchParams,
}) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

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
                    ...searchParams,
                    page: currentPage - 1,
                  },
                }}
                // no need for 'as' when using the query object in 'href'
              >
                Previous
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
                      ...searchParams,
                      page,
                    },
                  }}
                  // no need for 'as' when using the query object in 'href'
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
                    ...searchParams,
                    page: currentPage + 1,
                  },
                }}
                // no need for 'as' when using the query object in 'href'
              >
                Next
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
