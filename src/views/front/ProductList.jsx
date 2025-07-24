// 套件與模組匯入
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastAlert } from '../../utils/sweetAlert';
import ReactLoading from 'react-loading';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../../redux/productSlice';
import useScreenSize from '../../hooks/useScreenSize';
import productInfoData from '../../data/productInfoData';


import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';

// API 路徑
const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const ProductList = () => {
    // RWD:自訂hook
    const { screenWidth } = useScreenSize();
    const isMobile = screenWidth < 640; // 螢幕寬 < 640，返回true，否則返回false

    const dispatch = useDispatch();

    // 全螢幕Loading
    const [isScreenLoading, setIsScreenLoading] = useState(false);

     // 頁碼邏輯
    const [pageInfo, setPageInfo] = useState({});

    // 新增 currentPage state
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page) => {
        getProducts(page);
        window.scrollTo(0, 0);
    };  

    const getProducts = async (page = 1) => {
        setIsScreenLoading(true);
        try {
            // 獲取所有產品，不使用 limit 參數
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products/all`);
            
            const { products } = res.data;
            
            // 前端分頁處理
            const itemsPerPage = 6;
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            
            // 切割當前頁面需要的產品
            const currentPageProducts = products.slice(startIndex, endIndex);
            
            // 計算總頁數
            const totalPages = Math.ceil(products.length / itemsPerPage);
            
            // 更新 store，只存儲當前頁面的產品
            dispatch(setProducts(currentPageProducts));
            
            // 更新分頁信息
            setPageInfo({
                current_page: page,
                total_pages: totalPages,
                has_pre: page > 1,
                has_next: page < totalPages,
                total_items: products.length
            });
            
            setCurrentPage(page);
        } catch (error) {
            ToastAlert.fire({
                icon: 'error',
                title: '取得產品失敗',
                text: error,
            });
        } finally {
            setIsScreenLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    //RTK取得：搜尋產品列表
    const products = useSelector((state) => state.product.products);

    return (
        <>
            <div className="mb-5">
                <h1 className={`${isMobile ? 'h5' : 'h4'}  mt-0 text-primary`}>
                    {productInfoData['全部'].title}
                </h1>
                <div className={isMobile ? 'fs-6' : 'fs-5'}>
                    <div dangerouslySetInnerHTML={{ __html: productInfoData['全部'].content }} />
                </div>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3">
                {products?.map((product) => (
                    <div className="col mb-5" key={product.id}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
            {pageInfo && <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />}
            {isScreenLoading && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(99, 167, 205,0.7)',
                        zIndex: 1999,
                    }}
                >
                    <ReactLoading type="spin" color="#fff" width="4rem" height="4rem" />
                </div>
            )}
        </>
    );
};
export default ProductList;
