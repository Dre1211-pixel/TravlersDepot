import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useScreenSize from '../../hooks/useScreenSize';
import { Link, useParams } from 'react-router-dom';
import { ToastAlert } from '../../utils/sweetAlert';
import ReactLoading from 'react-loading';
import axios from 'axios';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const CreateOrderSuccess = () => {
    //RWD:自訂hook
    const { screenWidth } = useScreenSize();
    const isMobile = screenWidth < 992; // 螢幕寬 < 992，返回true，否則返回false

    //Loading邏輯
    const [isScreenLoading, setIsScreenLoading] = useState(false); //全螢幕Loading

    //RTK取得：訂單資訊
    const orderData = useSelector((state) => state.order.orderData);
    const { id: order_id } = useParams();

    //付款：線上刷卡
    const checkout = async () => {
        setIsScreenLoading(true);
        try {
            await axios.post(`${BASE_URL}/api/${API_PATH}/pay/${order_id}`);
            getOrder();
        } catch (error) {
            ToastAlert.fire({
                icon: 'error',
                title: `刷卡失敗，訂單尚未付款！`,
                text: error,
            });
        } finally {
            setIsScreenLoading(false);
        }
    };

    //取得單一訂單資訊
    const [orderInfo, setOrderInfo] = useState({});

    //取得訂單資料
    const getOrder = async () => {
        setIsScreenLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/order/${order_id}`);
            setOrderInfo(res.data.order);
        } catch (error) {
            ToastAlert.fire({
                icon: 'error',
                title: `訂單取得失敗！`,
                text: error,
            });
        } finally {
            setIsScreenLoading(false);
        }
    };

    useEffect(() => {
        getOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container">
            <section className="orderSuccessPage py-5 mb-md-5" id="orderSuccess">
                <h2 className={`${isMobile ? 'h4' : 'h3'} text-center mb-5`}>
                    <span className="titleUnderline">
                        <span>謝謝您的訂購</span>
                    </span>
                </h2>
                <div className="row col-lg-8 m-auto orderCard">
                    <div className="col-md-6 p-4">
                        <h4 className="h5 order-title mb-4">訂單資訊</h4>
                        <ul className="orderList d-flex flex-column gap-3">
                            <li>
                                <span className="title">訂單編號</span>
                                <span className="fs-6">{order_id}</span>
                            </li>
                            <li>
                                <span className="title">收件人姓名</span>
                                <span clasName="fs-6">{orderData.user.name}</span>
                            </li>
                            <li>
                                <span className="title">收件人電話</span>
                                <span clasName="fs-6"></span>
                                {orderData.user.tel}
                            </li>
                            <li>
                                <span className="title">收件地址</span>
                                <span clasName="fs-6">{orderData.user.address}</span>
                            </li>
                            <li>
                                <span className="title">Email</span>
                                <span clasName="fs-6 "> {orderData.user.email}</span>
                            </li>
                                {orderData.message !== '' && (
                                    <li>
                                        <span className="title">留言</span>
                                        {orderData.message}
                                    </li>
                                )}
                            <li>
                                <span className="title">付款方式</span>
                                <span className="fs-5 order-title">{orderData.user.paymond}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-6 d-flex flex-column align-items-center justify-content-center gap-3 p-4 orderInfo">
                        {orderData.user.paymond === '貨到付款' && (
                            <div className="text-center">
                                <p className="h5 text-primary">已收到您的訂單</p>
                                <p className="h5 text-primary mb-4">預計三天內為您出貨！</p>
                                <Link to="/productList/all" className="btn allProductBtn m-auto">
                                    繼續逛逛
                                </Link>
                            </div>
                        )}
                        {orderData.user.paymond === '匯款轉帳' && (
                            <div className="w-100">
                                <h4 className="h5 order-title mb-4">轉帳資訊</h4>
                                <p className="fs-5">
                                    <span className="title">中華郵政</span>700
                                </p>
                                <p className="fs-5 mb-5">
                                    <span className="title">虛擬帳號</span>00314960054569
                                </p>
                                <div className="text-center">
                                    <p className="h6 order-title text-center">請於三天內匯款</p>
                                    <p className="h6 order-title text-center mb-4">收到款項後將盡快為您出貨！</p>
                                    <Link to="/productList/all" className="btn allProductBtn">
                                        繼續逛逛
                                    </Link>
                                </div>
                            </div>
                        )}
                        {orderData.user.paymond === '線上刷卡' && orderInfo.is_paid && (
                            <div className="w-100 h-100 text-center">
                                <h4 className="h4 text-primary mb-4">卡片資訊</h4>
                                <p className="textBody2 mb-5">
                                    <span className="title">卡號</span>
                                    {orderData.user.cardNumber}
                                </p>

                                <p className="h6 text-primary text-center">已收到您的款項</p>
                                <p className="h6 text-primary text-center mb-4">將盡快為您出貨</p>
                                <Link to="/productList/all" className="btn btn-primary">
                                    繼續逛逛
                                </Link>
                            </div>
                        )}
                        {orderData.user.paymond === '線上刷卡' && !orderInfo.is_paid && (
                            <div className="w-100 text-center">
                                <h4 className="h4 text-primary mb-4">訂單尚未付款喔！</h4>
                                <p className="h5 mb-4">付款成功後將盡快為您出貨。</p>
                                <button type="button" className="btn btn-primary" onClick={() => checkout()}>
                                    立即付款
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            {isScreenLoading && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(230,146,112,0.7)',
                        zIndex: 1999,
                    }}
                >
                    <ReactLoading type="spin" color="#fff" width="4rem" height="4rem" />
                </div>
            )}
        </div>
    );
};

export default CreateOrderSuccess;