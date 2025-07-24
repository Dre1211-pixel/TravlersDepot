import { useEffect, useState } from 'react'; // React hooks
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"; // 路由功能
import LogoHeader from '../assets/images/logo/LogoHeader.svg'; // Logo 圖片
import useScreenSize from '../hooks/useScreenSize'; // 自定義 hook：取得螢幕寬度
import axios from 'axios'; // 發送 HTTP 請求 (Ex: GET, POST)
import { useDispatch, useSelector } from 'react-redux'; // Redux Hooks
import { updateCartData } from '../redux/cartSlice'; // 購物車資料更新 action
import { ToastAlert } from '../utils/sweetAlert'; // 客製化通知

// 社群 icon
import fb from '../assets/images/logo/icon-fb.svg'; // fb icon
import ig from '../assets/images/logo/icon-ig.svg'; // ig icon
import line from '../assets/images/logo/icon-line.svg'; // line icon

// 我的最愛 & 購物車 icon


// Swiper 樣式
import 'swiper/css'; // 引入 Swiper 
import 'swiper/css/navigation'; // 引入 Swiper 的 左右箭頭導航樣式
import 'swiper/css/pagination'; // 引入 Swiper 的 分頁圓點指示器樣式

// 從 Redux 的 searchSlice 中匯入一個 action creator：setSearchValue，讓搜尋 input 能和全域狀態同步（記得！還需要使用 dispatch(setSearchValue(value)); 才能讓功能生效！！）
// 白話文解釋：使用者在 searchbar 裡面輸入的內容會 register 到 searchSlice 並顯示對應關鍵字的資料
import { setSearchValue } from '../redux/searchSlice'; 

// 帶入環境變數：API 網址與路徑
const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

// 導覽列與社群連結資料（路由陣列）=
// 1. 主選單導覽
const routesNav = [
    //{ path: '/', name: '首頁' },
    { path: '/productList/all', name: '所有產品' },
    { path: '/about', name: '關於旅人集所' },
];
// 2. 購物車 / 收藏等功能連結
const routesLinks = [
    { path: '/favorite', name: '收藏清單', icon: 'favorite', newTab: false },
    { path: '/cart', name: '購物車', icon: 'shopping_cart', newTab: false },
    //{ path: '/login', name: '登入管理', icon: 'person', newTab: true },
];
// 3. Footer 社群連結
const routesSocialMediaLinks = [
    { path: '/', name: 'FB', icon: fb, newTab: true },
    { path: '/', name: 'IG', icon: ig, newTab: true },
    { path: '/', name: 'LINE', icon: line, newTab: true },
];

const FrontLayout = () => {

    // 狀態管理 & 螢幕尺寸 hook
    const [isNavOpen, setIsNavOpen] = useState(false); // 控制 mobile 漢堡選單開關
    const { screenWidth } = useScreenSize();           // 自訂 hook：取得螢幕寬度

    // 控制 navbar 展開收合
    const toggleNavbar = () => {
        if (screenWidth <= 767) {
            setIsNavOpen(!isNavOpen);
        }
    };

    // Redux 與 Router 功能 hook
    const dispatch = useDispatch();     // 發送 action
    const navigate = useNavigate();    // 導頁

    // 購物車
    // 1. 設定取得購物車資料邏輯
    const getCartList = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
          dispatch(updateCartData(res.data.data)); // 存入 Redux
        } catch (error) {
            ToastAlert.fire({ icon: 'error', title: '取得購物車失敗', text: error });
        }
    };
    // 2. 初始渲染畫面時呼叫購物車 API 取得購物車資料（只會在元件「第一次渲染」時執行）
    useEffect(() => {
        getCartList(); 
    }, []);
    // 3. 取得目前在 Redux 中購物車資料
    const carts = useSelector((state) => state.cart.carts); 
    
    // 關鍵字
    // 1. 取得目前在 Redux 中的關鍵字
    const searchValue = useSelector((state) => state.search.searchValue);
    // 2. 儲存關鍵字（onChange 事件綁定在 input），代表系統會即時儲存搜尋欄輸入的內容到 Redux
    const handleInputChange = (e) => {
        const { value } = e.target; // 
        dispatch(setSearchValue(value));
    };
    // 3. 點擊搜尋按鈕時，觸發搜尋行為
    const handleFilterProducts = () => {
        toggleNavbar();
        if (searchValue !== '') {
            navigate(`/productList/search/${searchValue}`, { state: { from: 'allPagesSearch' } });
        } else {
            ToastAlert.fire({
                icon: 'error',
                title: '請先輸入搜尋關鍵字',
            });
        }
    };

    // 自動捲動頁面至頂部（切換路由時）-> 每一次切換到另外一個頁面時初始畫面都會是在頁面頂部
    const { pathname, search } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname, search]);

    return (
        <>
            {/* Header 頁首：包含 NavBar & SwiperBanner */}
            <header className="frontHeader fixed-top">
                <nav className="navbar navbar-expand-md mainNav">
                    <div className="container">

                        {/* 左上 Logo */}
                        <Link to="/" className="navbar-brand">
                            <img src={LogoHeader} alt="logo" />
                        </Link>

                        {/* RWD 漢堡選單 */}
                        <span className="navbar-toggler border-0" onClick={toggleNavbar}>
                            <span className="material-icons align-content-center me-1 fs-5">
                            {isNavOpen ? 'close' : 'menu'}
                            </span>
                        </span>

                        {/* 導覽連結 */}
                        <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarToggler">
                            <ul className="nav navbar-nav d-flex justify-content-end w-100 gap-3">
                                
                                {/* 上方主選單（產品、關於我們） */}
                                {routesNav.map((route) => (
                                    <li className="nav-item" key={route.path}>
                                        <NavLink to={route.path} className="nav-link px-2" onClick={toggleNavbar}>
                                            <span className="nav-text">{route.name}</span>
                                        </NavLink>
                                    </li>
                                ))}

                                {/* 收藏、購物車 icon 按鈕 */}
                                {routesLinks.map((route) => (
                                    <li className="nav-item" key={route.path}>
                                        <NavLink
                                            to={route.path}
                                            className="nav-link px-2 d-flex align-items-center justify-content-center"
                                            onClick={toggleNavbar}
                                            {...(route.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                        >
                                            {/* 若是購物車且有資料，顯示數字徽章 */}
                                            {route.name === '購物車' && carts.length > 0 && (
                                                <div className="position-relative">
                                                    <span
                                                        className="position-absolute badge text-bg-primary rounded-pill text-white"
                                                        style={{ bottom: '6px', left: '10px' }}
                                                    >
                                                        {carts.length}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="material-icons align-content-center me-1 fs-5">
                                                {route.icon}
                                            </span>
                                            <span className="nav-text">
                                                {screenWidth <= 767 && route.name}
                                            </span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>

                            {/* 搜尋欄 */}
                            <div className={`searchBar mt-3 mt-md-0 ms-md-3 ${searchValue ? 'active' : ''}`}>
                                <input
                                    type="search"
                                    placeholder="搜尋商品"
                                    value={searchValue}
                                    className="input px-3"
                                    onChange={handleInputChange}
                                />
                                <button type="submit" className="btn btn-primary" onClick={handleFilterProducts}>
                                    <span className="material-icons-outlined fs-5 align-self-center">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            
            {/* 對應 React Router 中的子頁面顯示區塊 */}
            <div className="frontContent">
                <Outlet />
            </div>   
            
            {/* Footer 頁尾 */}
            <footer className="frontFooter">
                <div className="container">
                    <div className="row g-3 g-lg-5">
                        <div className="col-lg-3 text-center text-lg-start">
                            <Link to="/" className="navbar-brand">
                                <img src={LogoHeader} alt="logo" />
                            </Link>
                        </div>
                        <div className="col-lg-6">
                            <ul className="nav navbar-nav d-flex flex-md-row justify-content-center gap-3">
                                {routesNav.map((route) => (
                                    <li className="nav-item text-center" key={route.path}>
                                        <Link to={route.path} className="nav-link px-2">
                                            {route.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-lg-3">
                            <ul className="nav navbar-nav d-flex flex-row justify-content-center justify-content-lg-end gap-3">
                                {routesSocialMediaLinks.map((route) => (
                                    <li className="nav-item text-center" key={route.name}>
                                        <Link
                                            to={route.path}
                                            className="nav-link p-0 d-flex justify-content-center align-items-center"
                                            style={{ width: '24px', height: '24px' }}
                                        >
                                            <img src={route.icon} alt={route.name} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col">
                            <p className="textBody3 text-center copyright">
                                旅人集所股份有限公司：100 台北市中正區重慶南路二段122號<br />
                                無商業用途且僅供作品展示 | 版權所有：© Copyright 2025 旅人集所. All Rights
                                Reserved
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </> 
    );
};
export default FrontLayout;