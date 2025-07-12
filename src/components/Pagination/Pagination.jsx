import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "./Pagination.module.scss";

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    showPrevNext = true,
    maxVisiblePages = 5,
    className,
    ...props
}) => {
    const handlePageClick = (page) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange?.(page);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            handlePageClick(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            handlePageClick(currentPage + 1);
        }
    };

    // Calculate visible page numbers
    const getVisiblePages = () => {
        const delta = Math.floor(maxVisiblePages / 2);
        let start = Math.max(1, currentPage - delta);
        let end = Math.min(totalPages, start + maxVisiblePages - 1);

        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const visiblePages = getVisiblePages();

    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav className={clsx(styles.pagination, className)} {...props}>
            <ul className={styles.pageList}>
                {/* Previous Button */}
                {showPrevNext && (
                    <li className={styles.pageItem}>
                        <button
                            className={clsx(styles.pageLink, {
                                [styles.disabled]: currentPage === 1,
                            })}
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                        >
                            &larr; Previous
                        </button>
                    </li>
                )}

                {/* First page + ellipsis */}
                {visiblePages[0] > 1 && (
                    <>
                        <li className={styles.pageItem}>
                            <button
                                className={styles.pageLink}
                                onClick={() => handlePageClick(1)}
                            >
                                1
                            </button>
                        </li>
                        {visiblePages[0] > 2 && (
                            <li className={styles.pageItem}>
                                <span className={styles.ellipsis}>…</span>
                            </li>
                        )}
                    </>
                )}

                {/* Visible page numbers */}
                {visiblePages.map((page) => (
                    <li key={page} className={styles.pageItem}>
                        <button
                            className={clsx(styles.pageLink, {
                                [styles.active]: page === currentPage,
                            })}
                            onClick={() => handlePageClick(page)}
                            aria-current={
                                page === currentPage ? "page" : undefined
                            }
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {/* Last page + ellipsis */}
                {visiblePages[visiblePages.length - 1] < totalPages && (
                    <>
                        {visiblePages[visiblePages.length - 1] <
                            totalPages - 1 && (
                            <li className={styles.pageItem}>
                                <span className={styles.ellipsis}>…</span>
                            </li>
                        )}
                        <li className={styles.pageItem}>
                            <button
                                className={styles.pageLink}
                                onClick={() => handlePageClick(totalPages)}
                            >
                                {totalPages}
                            </button>
                        </li>
                    </>
                )}

                {/* Next Button */}
                {showPrevNext && (
                    <li className={styles.pageItem}>
                        <button
                            className={clsx(styles.pageLink, {
                                [styles.disabled]: currentPage === totalPages,
                            })}
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                        >
                            Next &rarr;
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    onPageChange: PropTypes.func,
    showPrevNext: PropTypes.bool,
    maxVisiblePages: PropTypes.number,
    className: PropTypes.string,
};

export default Pagination;
