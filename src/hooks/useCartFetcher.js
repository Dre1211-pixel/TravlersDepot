import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateCartData } from '../redux/cartSlice';
import { ToastAlert } from '../utils/sweetAlert';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const useCartFetcher = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const getCartList = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
            dispatch(updateCartData(res.data.data));
        } catch (error) {
            ToastAlert.fire({
            icon: 'error',
            title: '取得購物車失敗',
            text: error.message || '未知錯誤',
            });
        }
        };

        getCartList();
        // 如果你希望未來能 auto-refresh 購物車資料，可以把 polling 加在這邊
    }, []);
};

export default useCartFetcher;