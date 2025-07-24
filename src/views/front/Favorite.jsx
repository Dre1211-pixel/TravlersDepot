import Banner from '../../components/Banner';
import bannerImg4 from '../../assets/images/banner/banner4.jpeg';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import useScreenSize from '../../hooks/useScreenSize';
import { ToastAlert } from '../../utils/sweetAlert';
import ReactLoading from 'react-loading';
import { setAllProducts } from '../../redux/productSlice';
import ProductCard from '../../components/ProductCard';
import { Link } from 'react-router-dom';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const Favorite = () => {
    //RWD:自訂hook
    const { screenWidth } = useScreenSize();
    const isMobile = screenWidth < 640; // 螢幕寬 < 640，返回true，否則返回false

    //RTK取得：完整產品列表、加入收藏ID列表、收藏清單
    const allProducts = useSelector((state) => state.product.allProducts);
    const favoriteList = useSelector((state) => state.favorite.favoriteList);
    const favoriteProducts = allProducts.filter((product) => favoriteList[product.id]);

    //全螢幕Loading
    const [isScreenLoading, setIsScreenLoading] = useState(false);

    //取得產品資料
    const dispatch = useDispatch();
    const getAllProducts = useCallback(async () => {
        setIsScreenLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products/all`);
            const { products } = res.data;
            dispatch(setAllProducts(products));
        } catch (error) {
            ToastAlert.fire({
                icon: 'error',
                title: '取得產品失敗',
                text: error,
            });
        } finally {
            setIsScreenLoading(false);
        }
    }, [dispatch]);

    //若無產品資料才重新取得
    useEffect(() => {
        if (allProducts.length === 0) {
            getAllProducts();
        }
    }, [allProducts]);
    
    return (
        <section className='aboutPage'>
            {/* Banner 區塊 */}
            <Banner 
                imgSrc={bannerImg4} 
                alt='產品列表 Banner' 
                className='about-banner' 
                title='收藏清單' 
                content='留存心動的瞬間，收藏喜愛的商品' 
            />
            <div className="container pb-5 pt-0 pt-md-5">
                <h2 className={`${isMobile ? 'h3' : 'h2'} text-center py-5`}>
                    <span className="titleUnderline">
                        <span>收藏清單</span>
                    </span>
                </h2>
                {favoriteProducts.length === 0 && (
                    <p className="fs-5 text-secondary text-center">
                        還沒有收藏任何商品喔！趕快去逛逛吧！
                        <br />
                        <Link to="/productList/all" className="btn btn-product mt-4">
                            查看所有商品
                        </Link>
                    </p>
                )}
                <div className="row ">
                    <div className="col-md-9 m-auto">
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3">
                            {favoriteProducts?.map((product) => (
                                <div className="col mb-5" key={product.id}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
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
        </section>
    )
}
export default Favorite