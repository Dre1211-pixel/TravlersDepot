import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { packingListData } from '../../data/packingListData';
import useScreenSize from '../../hooks/useScreenSize';
import ProductCard from '../../components/ProductCard'; 
import axios from 'axios'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ToDoList = () => {

    const location = useLocation();
    const navigate = useNavigate(); 
    const [items, setItems] = useState([]); 
    const [newItem, setNewItem] = useState(''); 
    const [userType, setUserType] = useState(null); 

    const [recommendedProducts, setRecommendedProducts] = useState([]); 
    const [isLoading, setIsLoading] = useState(false); 

    // 新增獲取推薦產品的函數
    const fetchRecommendedProducts = async (type) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/${import.meta.env.VITE_API_PATH}/products/all`);
            const allProducts = response.data.products;
            
            // 過濾出推薦清單中的產品
            const recommended = allProducts.filter(product => 
                packingListData[type].recommendedProducts.includes(product.title)
            );
            
            setRecommendedProducts(recommended);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 裝置判斷
    const { screenWidth } = useScreenSize();
    const isMobile = screenWidth < 640; // 螢幕寬 < 640，返回true，否則返回false

    // 根據 URL 參數獲取使用者類型（)，判斷顯示哪一種預設打包清單
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const type = params.get('type');

        if (!type || !packingListData[type]) {
            navigate('/'); // 如果沒有類型參數或類型不存在，導回首頁
            return;
        }

        setUserType(type);
        setItems(packingListData[type].items);
        fetchRecommendedProducts(type);
    }, [location]);

    const addItem = (e) => {
        e.preventDefault(); // 防止表單提交時頁面重新載入
        if (!newItem.trim()) return; // 如果輸入框為空，則不添加新項目
        
        // 
        setItems([
            ...items, // 讀取並保留原有的所有項目
            { // 新增一個新的項目
                id: Date.now(),
                text: newItem,
                completed: false
            }
        ]);
        setNewItem(''); // 添加新項目後，清空輸入框
    };

    const finishedItem = (id) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        );

        // 重新排序：未完成的項目在前，已完成的項目在後
        const sortedItems = [
            ...updatedItems.filter(item => !item.completed),
            ...updatedItems.filter(item => item.completed)
        ];
        setItems(sortedItems);
    };

    const deleteItem = (id) => {
        setItems(items.filter(item => item.id !== id)); // If the current item id is not equal to the id of the item to be deleted, it will be retained; If it is equal, it will be deleted
    };

    const moveItemUp = (index) => {
        if (index > 0) {
            const updatedItems = [...items];
            const currentElement = document.querySelector(`li[data-index="${index}"]`);

            if (currentElement) {
                currentElement.classList.add('shake-animation','move-shadow');

                [updatedItems[index], updatedItems[index - 1]] = 
                [updatedItems[index - 1], updatedItems[index]];
                setItems(updatedItems);

                setTimeout(() => {
                    currentElement.classList.remove('shake-animation', 'move-shadow');
                }, 300);
            }
        }
    };

    const moveItemDown = (index) => {
        if (index < items.length - 1) {
            const updatedItems = [...items];
            const currentElement = document.querySelector(`li[data-index="${index}"]`);
            
            if (currentElement) {
                currentElement.classList.add('shake-animation', 'move-shadow');

                [updatedItems[index], updatedItems[index + 1]] = 
                [updatedItems[index + 1], updatedItems[index]];
                setItems(updatedItems);

                setTimeout(() => {
                    currentElement.classList.remove('shake-animation', 'move-shadow');
                }, 300);
            }
        }
    };

    if (!userType) return null; // 如果沒有使用者類型，則不渲染任何內容

    return (
        <div className="container user-type ">
            <h1 className={`${isMobile ? 'h4' : 'h3'} mb-4` }>打包清單</h1>
            <div className="todo-section mb-8">
                <form onSubmit={addItem} className="mb-4">
                        <input
                            type="text"
                            placeholder="新增品項..."
                            value={newItem}
                            className="input-field"
                            onChange={(e) => setNewItem(e.target.value)}
                        />
                        <button 
                            className="add-button"
                            onClick={addItem}>
                            新增
                        </button>
                </form>

                <ol>
                    {items.map((item, index) => (
                        <li key={item.id} data-index={index}>
                            <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => finishedItem(item.id)}
                                className="form-checkbox"
                            />
                            <span className="text">{item.text}</span>
                            <button 
                                onClick={() => deleteItem(item.id)} 
                                className="delete-button"
                            >
                                x
                            </button>
                            <button
                                className="move-button material-icons"
                                onClick={() => moveItemUp(index)}
                            >
                                arrow_circle_up
                            </button>
                            <button
                                className="move-button material-icons"
                                onClick={() => moveItemDown(index)}
                            >
                                arrow_circle_down
                            </button>
                        </li>
                    ))}
                </ol>
            </div>

            <div className="recommended-products mt-8">
                <h2 className={`${isMobile ? 'h5' : 'h4'} mb-4`}>你可能會喜歡...</h2>
                <Swiper
                    className="product-swiper"
                    modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                    spaceBetween={24}
                    navigation={true}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                        1440: { slidesPerView: 5 },
                    }}
                >
                    {recommendedProducts.map((product) => (
                        <SwiperSlide key={product.id}>
                            <ProductCard product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ToDoList;
