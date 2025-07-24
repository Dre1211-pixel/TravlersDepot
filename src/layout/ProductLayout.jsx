import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllProducts, setFilterProducts } from '../redux/productSlice';
import { setSearchValue, setSingleFilter } from '../redux/searchSlice';
import { pushMessage } from '../redux/toastSlice';
import useScreenSize from '../hooks/useScreenSize';
import axios from 'axios';
import Banner from '../components/Banner';
import bannerImg1 from '../assets/images/banner/banner3.jpeg';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

//快速填入關鍵字
const tagList = ['背包', '收納', '耳塞'];

const ProductLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    //RWD:自訂hook
    const { screenWidth } = useScreenSize();
    const isMobile = screenWidth < 767.98; // 螢幕寬 < 767.98，返回true，否則返回false

    //RTK取得：全部產品列表
    const allProducts = useSelector((state) => state.product.allProducts);
    //RTK取得：首頁輸入的搜尋關鍵字
    const searchValue = useSelector((state) => state.search.searchValue);
    //RTK取得：首頁送出的的單一filter
    const singleFilter = useSelector((state) => state.search.singleFilter);
    
    const filterDefault = useMemo(
        () => ({
            category: '全部',
            is_newest: false,
            is_hottest: false,
            is_discounted: false,
            is_storage: false,
            is_light: false,
            is_eco: false 
        }),
        []
    );

    //篩選條件展開收合
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const toggleNavbar = () => {
        if (isMobile) {
            setIsFilterOpen(!isFilterOpen);
        }
    };

    //篩選條件狀態
    const [filtersData, setFiltersData] = useState(filterDefault);

    //設定篩選條件
    const filters = useMemo(
        () => ({
            category: (product) =>
                filtersData.category !== '全部' ? product.category === filtersData.category : true,
            is_newest: (product) => (filtersData.is_newest ? product.is_newest : true),
            is_hottest: (product) => (filtersData.is_hottest ? product.is_hottest : true),
            is_discounted: (product) =>
                filtersData.is_discounted ? product.origin_price > product.price : true,
            is_storage: (product) => (filtersData.is_storage ? product.is_storage : true),
            is_light: (product) => (filtersData.is_light ? product.is_light : true),
            is_eco: (product) => (filtersData.is_eco ? product.is_eco : true),
        }),
        [filtersData]
    );

    //產品篩選邏輯
    const handleFilterProducts = useCallback(() => {
        // singleFilter(首頁點選更多限時優惠、熱門產品、最新產品)
        // searchValue(首頁搜尋關鍵字)
        // 初始化執行：
        // -> 1. 若singleFilter有值則取值，並以全部產品進行篩選與渲染UI
        // -> 2. 若singleFilter無值，則判斷searchValue是否有值，並以全部產品進行篩選與渲染UI
        // -> 3. 以上皆無，才以全部產品套用filtersData篩選條件進行篩選(預設篩選條件為顯示全部)
        if (singleFilter !== '') {
            dispatch(setSearchValue(''));
        let result = [...allProducts];
        //「讀取RTK：首頁點選的篩選分類」-> 根據分類拆選產品
        if (singleFilter === 'is_discounted') {
            //限時優惠：篩選 有折扣 的商品
            result = result.filter((product) => product.origin_price > product.price);
        } else {
            //熱門產品、最新產品：篩選 is_hottest、is_newest 為true的商品
            result = result.filter((product) => product[singleFilter]);
        }
            dispatch(setFilterProducts(result)); //帶入搜尋結果，渲染UI
            dispatch(setSingleFilter('')); //清空首頁使用的RTK搜尋條件 setSingleFilter
        return;
        } else if (searchValue !== '') {
            //首頁若有搜尋則帶出搜尋結果
            let result = [...allProducts];
            //讀取RTK：首頁輸入的關鍵字」-> 根據關鍵字搜尋產品
            result = result.filter((product) => product.title.includes(searchValue));
            dispatch(setFilterProducts(result));
            dispatch(setSearchValue(''));
            return;
        } else {
            let result = [...allProducts];
            result = result.filter((product) =>
                Object.values(filters).every((filter) => filter(product))
            );
        dispatch(setFilterProducts(result));
        }
    }, [singleFilter, searchValue, allProducts, dispatch, filters]);

    //篩選button：點擊篩選產品主題：新品報到、限時搶購、冠軍排行
    const handleFilterClick = (filterName) => {
        const newFiltersData = {
            ...filtersData,
            [filterName]: !filtersData[filterName], //切換true/false
        };
        setFiltersData(newFiltersData);
        handleFilterProducts();

        //change Name for render path & UI
        if (filterName === 'is_newest' && !filtersData[filterName]) {
            filterName = '新品上架';
        } else if (filterName === 'is_discounted' && !filtersData[filterName]) {
            filterName = '限時搶購';
        } else if (filterName === 'is_hottest' && !filtersData[filterName]) {
            filterName = '鎮店之寶';
        } else {
            filterName = filtersData.category;
        }

        navigate(`/productList/search/${filtersData.category}`);
    };

    const handleCategoryClick = (categoryName) => {
        setFiltersData({
        ...filtersData,
        category: categoryName,
        });
            handleFilterProducts();
        if (categoryName === '全部') {
            navigate(`/productList/all`);
        } else {
            navigate(`/productList/search/${categoryName}`);
        }
    };

    //取得所有產品
    const getAllProducts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products/all`);
            const allProducts = res.data.products;
            dispatch(setAllProducts(allProducts));
        } catch (error) {
            dispatch(
                pushMessage({
                title: '產品資料取得失敗',
                text: error.response.data.message,
                type: 'danger',
                })
            );
        }
    };

    // 初始化顯示資料：預設執行顯示篩選結果(預設篩選條件為全部)
    // 當篩選條件變更時，重新執行篩選取結果
    useEffect(() => {
        if (allProducts.length === 0) {
            getAllProducts();
        }
        handleFilterProducts();
    }, [allProducts, filtersData]);

    // 點選 header nav、breadcrumb 的產品列表時
    // 強制切換分類為全部、並取消所有篩選分類
    useEffect(() => {
        if (location.pathname.includes('/productList/all')) {
            setFiltersData(filterDefault);
        }
    }, [location.pathname, filterDefault, navigate]);

    // 若在搜尋結果頁面執行重新整理，則自動導回全部產品列表頁
    useEffect(() => {
        // 執行首頁關鍵字搜尋、首頁分類查看更多產品時，不往下執行，避免誤判導致自動導向
        if (singleFilter !== '' || searchValue !== '') {
            return;
        }
        const isReload = performance.getEntriesByType('navigation')[0]?.type === 'reload';
        if (isReload && location.pathname.includes('/productList/search')) {
            navigate('/productList/all', { replace: true });
            setFiltersData(filterDefault);
        }
    }, []);

    // 來自產品詳細頁 productDetail.jsx 的 breadcrumb，選擇產品分類的邏輯處理
    useEffect(() => {
        if (location.state?.from === 'ProductDetailPage') {
            handleCategoryClick(params.search);
        }
        if (location.state?.from === 'allPagesSearch') {
            setFiltersData(filterDefault);
            let result = [...allProducts];
            result = result.filter((product) => product.title.includes(searchValue));
            dispatch(setFilterProducts(result));
        }
    }, [location.state]);

    // 監聽視窗大小改變
    useEffect(() => {
        if (!isMobile) {
            setIsFilterOpen(false);
        }
    }, [isMobile]);

    return (
        <section className="productListPage">
            <div className="container pb-5">
                <div className="breadcrumb">
                    <Link className="breadLink" to="/">首頁</Link>
                    <span className="material-icons-outlined breadcrumb-seperator">chevron_right</span>
                    <Link className="breadLink" to="/productList/all">旅人商品</Link>
                    <span className="material-icons-outlined breadcrumb-seperator">chevron_right</span>
                    <span className="breadLink active">{filtersData.category}</span>
                </div>
                <div className="row"> 
                    <div className="col-md-3 mb-3">
                        <div className="categoryNavWrapper">
                            <h3 className="mb-1 mb-md-3">
                                <span className="d-flex align-items-center">
                                    <span className="material-icons-outlined fs-2 me-1">category</span>產品分類
                                </span>
                            </h3>
                            <ul className="categoryNav">
                                <li>
                                    <button
                                        type="button"
                                        className={`btn categoryBtn ${filtersData.category === '；旅人商品' ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick('全部')}
                                    >
                                        <span className="material-icons">list</span>全部產品
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={`btn categoryBtn ${filtersData.category === '質感背包系列' ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick('質感背包系列')}
                                    >
                                        <span className="material-icons">backpack</span>質感背包
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={`btn categoryBtn ${filtersData.category === '巧收防水系列' ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick('巧收防水系列')}
                                    >
                                        <span className="material-icons">water_drop</span>巧收防水
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={`btn categoryBtn ${filtersData.category === '旅人配件系列' ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick('旅人配件系列')}
                                    >
                                        <span className="material-icons">settings</span>旅人配件
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={`btn categoryBtn ${filtersData.category === '舒眠保健系列' ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick('舒眠保健系列')}
                                    >
                                        <span className="material-icons">bedtime</span>舒眠保健
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={`btn categoryBtn ${filtersData.category === '輕便分裝系列' ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick('輕便分裝系列')}
                                    >
                                        <span className="material-icons">bento</span>輕便分裝
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <h3
                            className={`toggleFilter mb-1 mb-md-3 ${isFilterOpen ? 'active' : ''}`}
                            onClick={() => toggleNavbar()}
                        >
                            <span className="d-flex align-items-center">
                                <span className="material-icons-outlined fs-2">filter_alt</span>主題篩選
                                {isMobile && (
                                    <span className="material-icons-outlined fs-2 arrow">
                                        keyboard_arrow_down
                                    </span>
                                )}
                            </span>
                        </h3>
                        <div className={`toggleFilterItems ${isFilterOpen ? 'active' : ''}`}>
                            <ul className="categoryNav m-0">
                                <li>
                                    <div className="form-check p-0">
                                        <label
                                            className={`form-check-label btn categoryBtn ${filtersData.is_newest || params.search === '新品報到' ? 'active' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="form-check-input ms-0"
                                                checked={filtersData.is_newest}
                                                onChange={() => handleFilterClick('is_newest')}
                                            />
                                            新品上架
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check p-0">
                                        <label
                                            className={`form-check-label btn categoryBtn ${filtersData.is_hottest || params.search === '冠軍排行' ? 'active' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="form-check-input ms-0"
                                                checked={filtersData.is_hottest}
                                                onChange={() => handleFilterClick('is_hottest')}
                                            />
                                            鎮店之寶
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check p-0">
                                        <label
                                            className={`form-check-label btn categoryBtn ${filtersData.is_discounted || params.search === '限時搶購' ? 'active' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="form-check-input ms-0"
                                                checked={filtersData.is_discounted}
                                                onChange={() => handleFilterClick('is_discounted')}
                                            />
                                            限時搶購
                                        </label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <Outlet />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductLayout;
