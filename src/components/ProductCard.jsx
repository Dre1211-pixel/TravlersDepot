import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleFavoriteList } from '../redux/favoriteListSlice';
import { ToastAlert } from '../utils/sweetAlert';
import { updateCartData } from '../redux/cartSlice';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import axios from 'axios';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const ProductCard = ({ product }) => {
    // toggle favorite
    const dispatch = useDispatch();
    const favoriteList = useSelector((state) => state.favorite.favoriteList);

    //Loading邏輯
    const [isLoading, setIsLoading] = useState(false); //局部loading

    //加入/取消收藏
    const toggleFavorite = (e, id) => {
        e.preventDefault(); // 取消 a 連結
        e.stopPropagation(); // 取消觸發 <Link> 導航行為
        dispatch(toggleFavoriteList(id));
    };

    const defaultColor = {
        id: '',
        colorName: '',
        colorCode: '',
    };
    //加入購物車：產品顏色
    const [selectedColor, setSelectedColor] = useState(defaultColor);

    //選擇顏色
    const handleColorChange = (id, colorName, colorCode) => {
        const colorInfo = { id, colorName, colorCode };
        setSelectedColor(colorInfo);
    };

    //加入購物車
    const addCardItem = async (id) => {
        if (id !== selectedColor.id) {
            setSelectedColor(defaultColor);
            ToastAlert.fire({
                icon: 'error',
                title: '請先選擇顏色',
            });
            return;
        }
        setIsLoading(true);
        const color = {
            colorName: selectedColor.colorName,
            colorCode: selectedColor.colorCode,
        };
        const data = { product_id: id, qty: 1, color };

        try {
            await axios.post(`${BASE_URL}/api/${API_PATH}/cart`, { data });
            getCartList();
            ToastAlert.fire({
                icon: 'success',
                title: '產品已加入購物車',
            });
        } catch (error) {
            ToastAlert.fire({
                icon: 'error',
                title: '加入購物車失敗',
                text: error,
            });
        } finally {
            setIsLoading(false);
        }
    };

    //取得購物車資料，更新header購物車數量
    const getCartList = async () => {
        try {
        const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
        dispatch(updateCartData(res.data.data));
        } catch (error) {
        ToastAlert.fire({
            icon: 'error',
            title: '取得購物車失敗',
            text: error,
        });
        }
    };

    return (
        <div className="productCard h-100 w-100">
            <Link to={`/productList/${product.id}`} className="d-block w-100">
                <div className="tagBox">
                {product.is_newest && (
                    <span className="tag tag-newest fs-7">
                    <span className="material-icons fs-5 me-1">verified</span>
                        新品
                    </span>
                )}
                {product.is_hottest && (
                    <span className="tag tag-hottest fs-7">
                    <span className="material-icons fs-5 me-1">local_fire_department</span>
                        TOP
                    </span>
                )}
                {product.origin_price > product.price && (
                    <span className="tag tag-cheaper fs-7">
                    <span className="material-icons fs-5 me-1">timer</span>
                        限時優惠
                    </span>
                )}
                </div>
                <span
                    className={`material-icons favoriteBtn ${favoriteList[product.id] && 'active'}`}
                    onClick={(e) => toggleFavorite(e, product.id)}
                ></span>
                <div className="img-wrapper">
                <img className="w-100 img-fluid round-top" src={product.imageUrl} alt={product.title} />
                </div>
            </Link>
            <div className="card-body">
                <p className="card-title h6 m-0">
                    <Link to={`/productList/${product.id}`} className="product-link">
                        {product.title}
                    </Link>
                </p>
                <p className="card-text fs-6 mb-2">{product.description}</p>
            <div className="d-flex gap-2 justify-content-start">
                {product?.color
                    ?.filter((color) => color.colorCode) // 只顯示有 colorCode 的顏色
                    .map((color, index) => {
                        return (
                            <div className="form-check p-0 checkedStyle">
                                <input
                                    type="radio"
                                    id={`${product.id}-color-${index + 1}`}
                                    value={color.colorName}
                                    name={`color-${product.id}`}
                                    className="form-check-input d-none"
                                    onChange={() => handleColorChange(product.id, color.colorName, color.colorCode)}
                                    checked={color.colorName === selectedColor.colorName}
                                />
                                <label className="form-check-label" htmlFor={`${product.id}-color-${index + 1}`}>
                                    <div className="d-flex flex-column">
                                        <span
                                            className="colorSquare"
                                            style={{
                                                backgroundColor: color.colorCode,
                                                borderRadius: '4px',
                                                width: '20px',
                                                height: '20px',
                                                cursor: 'pointer',
                                                border:
                                                    color.colorName === selectedColor.colorName
                                                        ? '2px solid #26719B'
                                                        : '1px solid #b6b6b6',
                                            }}
                                        ></span>
                                    </div>
                                </label>
                            </div>
                        );
                    }
                )}
            </div>
            <div className="d-flex justify-content-between align-items-center">
                <div className="fs-6 price">$ {product.price.toLocaleString()}</div>
                {product.origin_price > product.price && (
                    <del className="fs-7 text-body-tertiary">
                    $ {product.origin_price.toLocaleString()}
                    </del>
                )}
                </div>
            </div>
            <div className="card-footer">
                <button
                    type="button"
                    className="btn btn-primary-outline d-flex w-100 justify-content-center align-items-center rounded-2"
                    onClick={() => addCardItem(product.id)}
                    disabled={isLoading}
                >
                    <span className="material-icons me-1 fs-5">add</span>
                    <span className="cart-btn-text fs-6">加入購物車</span>
                    {isLoading && (
                        <ReactLoading type={'spin'} color={'#000'} height={'1.2rem'} width={'1.2rem'} />
                    )}
                </button>
            </div>
        </div>
    );
};
export default ProductCard;

ProductCard.propTypes = {
    product: PropTypes.object.isRequired,
};