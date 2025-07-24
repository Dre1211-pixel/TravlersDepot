import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Pagination({ pageInfo, handlePageChange }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { current_page, total_pages } = pageInfo;

    useEffect(() => {
        navigate(`${location.pathname}?page=${current_page}`);
    }, [current_page, location.pathname, navigate]);

    // 計算要顯示的頁碼範圍
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisible = 5; // 最多顯示5個頁碼
        let start = Math.max(1, current_page - Math.floor(maxVisible / 2));
        let end = Math.min(start + maxVisible - 1, total_pages);

        // 調整起始頁碼
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <nav className="my-3">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${!pageInfo?.has_pre && 'disabled'}`}>
                    <Link
                        className="page-link-arrow"
                        onClick={() => handlePageChange(current_page - 1)}
                    >
                        <span className="material-icons">chevron_left</span>
                    </Link>
                </li>

                {getPageNumbers().map((pageNum) => (
                    <li
                        className={`page-item ${pageNum === current_page ? 'active' : ''}`}
                        key={pageNum}
                    >
                        <Link
                            className="page-link"
                            onClick={() => handlePageChange(pageNum)}
                        >
                            {pageNum}
                        </Link>
                    </li>
                ))}

                <li className={`page-item ${!pageInfo?.has_next && 'disabled'}`}>
                    <Link
                        className="page-link-arrow"
                        onClick={() => handlePageChange(current_page + 1)}
                    >
                        <span className="material-icons">chevron_right</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
export default Pagination;

Pagination.propTypes = {
    pageInfo: PropTypes.object.isRequired,
    handlePageChange: PropTypes.func.isRequired,
};