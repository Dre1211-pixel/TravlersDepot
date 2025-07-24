// 套件與模組匯入
// 1. React hooks, axios, swiper 元件與功能模組
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar, Autoplay, FreeMode, Thumbs } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/thumbs';

// 2. Redux 狀態管理、router 與 alert 工具
import { useDispatch, useSelector } from 'react-redux';
import { pushMessage } from '../../redux/toastSlice';
import { Link, useNavigate } from 'react-router-dom';
import { ToastAlert } from '../../utils/sweetAlert';

// 3. 自定義 hook、資料與元件
import useScreenSize from '../../hooks/useScreenSize';
import swiperBannerImages from '../../data/swiperBannerImages';
import { setSearchValue, setSingleFilter } from '../../redux/searchSlice';
import { setAllProducts } from '../../redux/productSlice';
import ProductCard from '../../components/ProductCard';

// 4. 取得環境變數
const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const Home = () => {

    // 裝置判斷（RWD）
    const { screenWidth } = useScreenSize();
    const isMobile = screenWidth < 640; // 螢幕寬 < 640，返回true，否則返回false

    // swiper 播放邏輯：暫停與恢復
    const swiperRef = useRef(null);
    const pauseSwiper = () => swiperRef.current?.autoplay.stop(); //暫停
    const resumeSwiper = () => swiperRef.current?.autoplay.start(); //恢復

    // 商品資料狀態設定與取得
    // 1. 商品狀態管理
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [hottestProduct, setHottestProduct] = useState([]);  // 單筆：鎮店之寶
    const [newestProduct, setNewestProduct] = useState([]);    // 單筆：新品上架

    // 2. 元件初次載入時觸發 getAllProducts()，取得商品資料
    useEffect(() => {
        getAllProducts();
    }, []);

    // 3. 取得商品資料的主邏輯 + 篩選
    const getAllProducts = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products/all`);
            console.log('API Response:', res.data);

            const allProducts = res.data.products;
            console.log('All Products:', allProducts); // 檢查所有商品


            // 篩選新品上架：is_newest 為 true 的產品 (最多顯示 4 張照片)
            const newest = allProducts.filter(product => product.is_newest).slice(0, 4);

            // 篩選鎮店之寶：只顯示 category 為「鎮店之寶」的商品
            const hottest = allProducts.filter(product => product.is_hottest);
            console.log('Filtered Hottest Products:', hottest); // 檢查篩選後的商品

            dispatch(setAllProducts(allProducts));     // 存入 RTK
            setHottestProduct(hottest);
            setNewestProduct(newest);
        } catch (error) {
            console.error('API Error:', error);
            dispatch(pushMessage({
                title: '產品資料取得失敗',
                text: error.response?.data?.message || '未知錯誤',
                type: 'danger',
            }));
        } finally {
            setIsLoading(false); // 無論成功或失敗都要結束 loading 狀態
        }
    };

    // Swiper thumbs：記錄當前 Swiper thumbnails 狀態
    const [newestThumbsSwiper, setNewestThumbsSwiper] = useState(null);

    // 搜尋欄位：關鍵字輸入與觸發查詢
    const searchValue = useSelector((state) => state.search.searchValue);

    // 使用者輸入時，觸發 dispatch() 將內容即時存入 Redux
    const handleInputChange = (e) => {
        dispatch(setSearchValue(e.target.value));
    };

    // 點擊搜尋按鈕時觸發，如果有輸入關鍵字就導頁，否則顯示錯誤提示（條件式裡面寫的 != 是「不等於」的意思
    const handleFilterProducts = () => {
        if (searchValue !== '') {
            navigate(`/productList/search/${searchValue}`);
        } else {
            ToastAlert.fire({ icon: 'error', title: '請先輸入搜尋關鍵字' });
        }
    };

    // Add this near your other state declarations
    const [favorited, setFavorited] = useState({});

    // Add this handler function
    const handleFavoriteClick = (productId) => {
        setFavorited(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    // 在 Home 組件內，添加一個新的 state 來保存 Swiper 實例
    const [productSwiper, setProductSwiper] = useState(null);

    // 篩選主題按鈕行為（熱門、新品）
    const handleButtonFilterProducts = (filterName) => {
        dispatch(setSingleFilter(filterName));

        // 命名轉換（為 UI 呈現用）;切換 filter 類型並跳轉搜尋頁
        if (filterName === 'is_newest') {
            filterName = '新品上架';
        } else if (filterName === 'is_hottest') {
            filterName = '鎮店之寶';
        }

        navigate(`/productList/search/${filterName}`);
    };

    // 評論區塊資料
    const reviews = [
        {
            img: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: '來自台北的三寶媽 May',
            stars: 5,
            text: '以往帶孩子出門最怕行李太亂，現在用了旅人集所的分層袋和壓縮收納袋，每件東西都能找到自己的位置。旅行準備省心多了，再也不怕孩子們的衣服和玩具打成一團。'
        },
        {
            img: 'https://images.unsplash.com/photo-1493742774533-911ae88cc1bb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: '熱愛旅行的 Eden',
            stars: 5,
            text: '我是個常常說走就走的旅行者，旅人集所的折疊背包和多功能洗漱包是我的必備裝備，輕便又實用，讓我能隨時展開新的冒險！'
        },
        {
            img: 'https://images.unsplash.com/photo-1558203728-00f45181dd84?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: '常出差的外商主管 Larry',
            stars: 5,
            text: '旅人集所的旅行收納工具真的很專業，尤其是高效收納包和領帶收納夾，每次出差我都能快速整理好行李，讓我的行程變得更高效。'
        },
        {
            img: 'https://images.unsplash.com/photo-1483181957632-8bda974cbc91?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: '購物魂上身的 Sherry',
            stars: 5,
            text: '行李箱的壓縮袋和折疊購物袋真的是救星！讓我在購物狂歡後還能把所有戰利品整整齊齊地帶回家，太實用了！'
        },
        {
            img: 'https://images.unsplash.com/photo-1545911825-6bfa5b0c34a9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: '外拍模特 Lisa',
            stars: 5,
            text: '不管是精緻的分裝瓶還是輕巧的化妝品收納盒，旅人集所的產品不僅方便還很有質感，出國時能隨身攜帶一整套美麗秘訣。'
        }
    ]

    return (
        <section className='homePage'>
            {/* 🔹 Banner 輪播區：首頁主視覺區塊，含文字、搜尋、CTA */}
            <Swiper
                modules={[Navigation, Pagination, A11y]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{  // 啟用導航按鈕
                    prevEl: '.swiper-button-prev',
                    nextEl: '.swiper-button-next'
                }}
                pagination={{
                    clickable: true,
                    el: '.swiper-pagination'
                }}
                loop={true}
                className="swiperBanner"
            >
                {swiperBannerImages.map((img, i) => (
                    <SwiperSlide key={i}>
                        <div className="container detail">
                            <div className="mainTitle">
                                <h1>{img.title}</h1>
                            </div>
                            <div className='buttonWrapper'>
                                <Link to="/productList/all" className="fs-5 buyBtn">
                                    立即選購
                                </Link>
                            </div>
                        </div>
                        <img src={isMobile ? img.md : img.lg} alt={img.title} className="w-100" />
                    </SwiperSlide>
                ))}
                {/* 自定義導航按鈕 */}
                <div className="swiper-button-prev">
                    <span className="material-icons">chevron_left</span>
                </div>
                <div className="swiper-button-next">
                    <span className="material-icons">chevron_right</span>
                </div>
                {/* 自定義分頁指示器 */}
                <div className="swiper-pagination"></div>
            </Swiper>

            {/* 🔹 鎮店之寶區塊 */}
            <div className="pb-5">
                <div className="container pt-0 pt-md-5">
                    <h2 className={`${isMobile ? 'h5' : 'h3'} text-center py-5`}>
                        <span> ——— 鎮店之寶 ——— </span>
                    </h2>
                    <Swiper
                        className="productSwiper"
                        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                        spaceBetween={24}
                        autoplay={{ delay: 1000, disableOnInteraction: false }}
                        loop={hottestProduct.length >= 5}
                        navigation={true}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                            1440: { slidesPerView: 5 },
                        }}
                        onSwiper={setProductSwiper} // 添加這行來獲取 Swiper 實例

                    >
                        {hottestProduct?.map((product) => (
                            <SwiperSlide
                                key={product.id}
                                className="mb-5"
                                onMouseEnter={() => productSwiper?.autoplay.stop()}
                                onMouseLeave={() => productSwiper?.autoplay.start()}
                            >
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="text-center mt-4">
                        <Link
                            to="#"
                            className="moreBtn-lg d-inline-flex"
                            onClick={() => handleButtonFilterProducts('is_hottest')}
                        >
                            <span>更多熱銷商品</span>
                            <span className="material-icons">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 🔹 新品上架區塊 */}
            <div className="pb-5">
                <div className="container pt-0 pt-md-5">
                    <h2 className={`${isMobile ? 'h5' : 'h3'} text-center py-5`}>
                        <span> ——— 新品上架 ——— </span>
                    </h2>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="product-gallery">
                                <Swiper
                                    style={{
                                        '--swiper-navigation-color': '#333',
                                        '--swiper-pagination-color': '#333',
                                    }}
                                    spaceBetween={0}
                                    navigation={true}
                                    thumbs={{ swiper: newestThumbsSwiper }}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="main-swiper"
                                >
                                    {/* First show the main product image */}
                                    {newestProduct[3] && (
                                        <SwiperSlide>
                                            <img
                                                src={newestProduct[3].imageUrl}
                                                className="main-image"
                                                alt={newestProduct[3].title}
                                                style={{ width: '100%', height: '340px', objectFit: 'cover' }}
                                            />
                                        </SwiperSlide>
                                    )}
                                    {/* Then show additional images if they exist */}
                                    {newestProduct[3]?.imagesUrl?.map((imgUrl, index) => (
                                        <SwiperSlide key={index}>
                                            <img
                                                src={imgUrl}
                                                className="main-image"
                                                alt={`${newestProduct[3].title} - ${index + 1}`}
                                                style={{ width: '100%', height: '340px', objectFit: 'cover' }}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {/* Thumbnails Swiper */}
                                <Swiper
                                    onSwiper={setNewestThumbsSwiper}
                                    slidesPerView={4}
                                    watchSlidesProgress={true}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="thumbs-swiper mt-3"
                                    spaceBetween={12}
                                >
                                    {/* Main image thumbnail */}
                                    {newestProduct[3] && (
                                        <SwiperSlide>
                                            <div className="thumb-wrapper">
                                                <img
                                                    src={newestProduct[3].imageUrl}
                                                    className="thumb-image"
                                                    alt={`${newestProduct[3].title} thumbnail`}
                                                    style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                                                />
                                                <div className="thumb-mask"></div>
                                            </div>
                                        </SwiperSlide>
                                    )}
                                    {/* Additional images thumbnails */}
                                    {newestProduct[3]?.imagesUrl?.map((imgUrl, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="thumb-wrapper">
                                                <img
                                                    src={imgUrl}
                                                    className="thumb-image"
                                                    alt={`${newestProduct[3].title} thumbnail ${index + 1}`}
                                                    style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                                                />
                                                <div className="thumb-mask"></div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                        <div className="col-md-6 py-4 d-flex flex-column justify-content-center gap-3 gap-md-4">
                            <div>
                                <h4 className={`${isMobile ? 'h6' : 'h4'} primary-600-text`}>
                                    收納神器全新登場
                                </h4>
                            </div>
                            <div className={isMobile ? 'fs-6' : 'fs-4'}>
                                <p>還在為準備行李頭痛嗎？</p>
                                <p>全新上架的旅行收納神器，專為解決行李雜亂與空間不足而設計。</p>
                                <p>無論是背包客的簡約需求，還是家庭旅行的多樣收納，都能讓你輕鬆整理，最大利用行李箱空間。</p>
                            </div>
                            <div className="text-start">
                                <Link
                                    to='#'
                                    className="moreBtn-sm d-inline-flex"
                                    onClick={() => handleButtonFilterProducts('is_newest')}
                                >
                                    探索更多新品
                                    <span className="material-icons">
                                        arrow_forward
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔹 TA 區塊 */}
            <div className="pb-5">
                <div className="container pt-0 pt-md-5">
                    <h2 className={`${isMobile ? 'h5' : 'h3'} text-center py-5`}>
                        <span> ——— 你是以下族群嗎？ ——— </span>
                    </h2>
                    <div className="row justify-content-center gy-4 ta-group-row">
                        {[
                            {
                                type: 'family',
                                img: 'https://images.unsplash.com/flagged/photo-1568041193043-e86f15540986?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                text: '渴望舒適旅程的家庭'
                            },
                            {
                                type: 'business',
                                img: 'https://images.unsplash.com/photo-1495704907664-81f74a7efd9b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                text: '常常出差的商務人士'
                            },
                            {
                                type: 'adventure',
                                img: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                text: '熱愛旅行的冒險家'
                            },
                            {
                                type: 'backpacker',
                                img: 'https://images.unsplash.com/photo-1708647585211-255097b41449?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                text: '簡約打包風的背包客'
                            }
                        ].map((item, idx) => (
                            <Link
                                key={idx}
                                to={`/todoList?type=${item.type}`}
                                className="col-12 col-sm-6 col-lg-3 d-flex flex-column align-items-center user-type-card"
                            >
                                <div className="ta-avatar">
                                    <img
                                        src={item.img}
                                        alt={item.text}
                                        className="ta-avatar-img"
                                    />
                                </div>
                                <div 
                                    className="text-center ta-avatar-text primary-600-text" 
                                    style={{ fontSize: isMobile ? 20 : 24 }}
                                >
                                    {item.text}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* 🔹 特色區塊 */}
            <div className="pb-5">
                <div className="container pt-0 pt-md-5">
                    <h2 className={`${isMobile ? 'h5' : 'h3'} text-center py-5`}>
                        <span> ——— 旅人集所の特色 ——— </span>
                    </h2>
                    <div className="row feature-row gy-5">
                        {[
                            {

                                img: 'https://images.unsplash.com/photo-1631728370215-9440df2e29e3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                title: '一站式旅行打包工具專家',
                                desc: '從行李收納到旅途便利，我們提供全方位的旅行工具，讓你的旅程準備輕鬆又高效。不論是家庭出行、背包旅行，還是商務差旅，旅人集所都是你的最佳夥伴。'
                            },
                            {
                                img: 'https://images.unsplash.com/photo-1536584754829-12214d404f32?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                title: '精選高品質旅行好物',
                                desc: '我們精心挑選每一件產品，注重實用性與耐用性，讓你在旅途中安心使用。每款商品都經過反覆測試，只為確保滿足你旅途中的每一個需求。'
                            },
                            {
                                img: 'https://images.unsplash.com/photo-1597931752949-98c74b5b159f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                title: '環保與可持續理念',
                                desc: '愛旅行，也愛地球！我們推崇綠色出行，提供可重複使用的分裝瓶、環保袋等工具，讓你在旅行中減少浪費，輕鬆實現環保生活。'
                            },
                            {
                                img: 'https://images.unsplash.com/photo-1626863905121-3b0c0ed7b94c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                title: '貼心售後服務',
                                desc: '我們不僅賣產品，更關心你的旅途體驗。從購買到使用，提供全程貼心服務，讓你每一次選購都充滿信任與安心。'
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="col-12 col-sm-6 col-lg-3 d-flex flex-column feature-col">
                                <div className="feature-img-wrapper">
                                    <img src={item.img} alt={item.title} className="feature-img" />
                                </div>
                                <h5 className="feature-title">{item.title}</h5>
                                <p className="feature-desc">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 🔹 好評區塊 */}
            <div className="review-wrapper">
                <div className="pb-5 review-section">
                    <div className="container pt-0 pt-md-5">
                        <h2 className={`${isMobile ? 'h5' : 'h3'} text-center py-5`}>
                            <span> ——— 顧客の好評 ——— </span>
                        </h2>
                        {/* Swiper for mobile & iPad, row-cols for desktop */}
                        {isMobile ? (
                            <Swiper
                                modules={[Pagination, Autoplay]}
                                slidesPerView={1}
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                className="review-swiper"
                            >
                                {reviews.map((review, idx) => (
                                    <SwiperSlide key={idx}>
                                        <div className="review-card">
                                            <img src={review.img} alt={review.name} className="review-img mb-3" />
                                            <div className="review-name">{review.name}</div>
                                            <div className="review-stars">
                                                {[...Array(review.stars)].map((_, i) => (
                                                    <span key={i} className="star">&#9733;</span>
                                                ))}
                                                <span className="review-score">5.0</span>
                                            </div>
                                            <div className="review-text">{review.text}</div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <Swiper
                                modules={[Pagination, Autoplay]}
                                breakpoints={{
                                    0: { slidesPerView: 1, spaceBetween: 0 },           // <= 800px
                                    768: { slidesPerView: 3, spaceBetween: 24 },         // 801px ~ 1350px
                                    1350: { slidesPerView: 5, spaceBetween: 24 },        // > 1350px
                                }}
                                slidesPerView={5} // default fallback
                                autoplay={screenWidth < 1350 ? { delay: 3000, disableOnInteraction: false } : false}
                                className="review-swiper"
                            >
                                {reviews.map((review, idx) => (
                                    <SwiperSlide key={idx}>
                                        <div className="review-card mx-auto">
                                            <img src={review.img} alt={review.name} className="review-img" />
                                            <div className="review-name">{review.name}</div>
                                            <div className="review-stars">
                                                {[...Array(review.stars)].map((_, i) => (
                                                    <span key={i} className="star">&#9733;</span>
                                                ))}
                                                <span className="review-score">5.0</span>
                                            </div>
                                            <div className="review-text fs-6">{review.text}</div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Home;

