import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageRange = 2,
}) => {
  const startPage = Math.max(1, currentPage - pageRange);
  const endPage = Math.min(totalPages, currentPage + pageRange);

  return (
    <section className="flex justify-center gap-2 mt-4">
      {currentPage > 1 && (
        <button
          className="w-[40px] h-[40px] flex justify-center items-center page-btn p-4 bg-white rounded-lg hover:bg-gray-300 duration-300 transition ease-in-out"
          onClick={() => onPageChange(currentPage - 1)}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
      )}

      {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
        const pageNumber = startPage + index;
        return (
          <button
            key={pageNumber}
            className={`w-[40px] h-[40px] flex justify-center items-center page-btn p-4 ${
              pageNumber === currentPage
                ? "bg-gray-400"
                : "bg-white hover:bg-gray-300"
            } rounded-lg duration-300 transition ease-in-out`}
            onClick={() => onPageChange(pageNumber)}
            data-page={pageNumber}
          >
            {pageNumber}
          </button>
        );
      })}

      {currentPage < totalPages && (
        <button
          className="w-[40px] h-[40px] flex justify-center items-center page-btn p-4 bg-white rounded-lg hover:bg-gray-300 duration-300 transition ease-in-out"
          onClick={() => onPageChange(currentPage + 1)}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      )}
    </section>
  );
};

export default Pagination;
