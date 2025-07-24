import { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../components/Pagination';
import ReactLoading from 'react-loading';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../../redux/toastSlice';
import { formatDate } from '../../utils/dateUtils';
import DeleteOrderModal from '../../components/DeleteOrderModal';
import { Link } from 'react-router-dom';
import { getPageOrdersData } from '../../redux/admin/adminOrderSlice';

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const AdminOrder = () => {
    const dispatch = useDispatch();

    //全螢幕Loading
    const [isScreenLoading, setIsScreenLoading] = useState(false);

    //頁碼邏輯
    const [pageInfo, setPageInfo] = useState({});
    const handlePageChange = (page) => {
        getOrdersList(page);
        window.scrollTo(0, 0);
    };

    //取得訂單
    const [orderList, setOrderList] = useState([]); //訂單list
    const getOrdersList = async (page = 1) => {
        setIsScreenLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/${API_PATH}/admin/orders?page=${page}`);
            console.log('訂單資料:', res.data.orders);  // 檢查訂單資料結構
            dispatch(getPageOrdersData([res.data.orders]));
            localStorage.setItem('pageOrderData', JSON.stringify([res.data.orders]));
            setOrderList(res.data.orders);
            setPageInfo(res.data.pagination);
        } catch (error) {
        dispatch(
            pushMessage({
                title: '訂單資料取得失敗',
                text: error.response.data.message,
                type: 'danger',
            })
        );
        } finally {
            setIsScreenLoading(false);
        }
    };

    useEffect(() => {
        getOrdersList();
    }, []);

    //Modal
    const [tempModalData, setTempModalData] = useState({});
    const [isDeleteOrderModalOpen, setIsDeleteOrderModalOpen] = useState(false);

    //開啟modal：刪除產品
    const openDeleteOrderModal = (order) => {
        setTempModalData(order);
        setIsDeleteOrderModalOpen(true);
    };

    return (
        <>
            <section>
                <div className="table-responsive p-4 bg-white rounded-4">
                    <h1 className="h4 mb-4">訂單管理</h1>
                    <table className="table align-middle adminTable">
                        <thead>
                            <tr>
                                <th scope="col" width={60} className="fs-7">
                                    No.
                                </th>
                                <th scope="col">訂單編號</th>
                                <th scope="col">
                                    訂購人 <span className="fs-7">/ E-mail</span>
                                </th>
                                <th scope="col">
                                    訂購產品 <span className="fs-7">/ 規格 / 數量</span>
                                </th>
                                <th scope="col" className="text-end">
                                    總金額
                                </th>
                                <th scope="col" className="text-center">
                                    訂單狀態
                                </th>
                                <th scope="col" className="text-center">
                                    訂購日期
                                </th>
                                <th scope="col">功能</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderList && orderList.length > 0 ? (
                                orderList.map((order) => (
                                    <tr key={order.id}>
                                        <td>
                                            <span className="fs-7">{order.num}</span>
                                        </td>
                                        <td>
                                            <span className="fs-7">{order.id}</span>
                                        </td>
                                        <td>
                                            <span className="h6">{order.user.name}</span>
                                            <br />
                                            <span className="fs-7">{order.user.email}</span>
                                        </td>
                                        <td>
                                            {Object.values(order.products).map((product) => (
                                                <div key={product.id}>
                                                    <span>{product.product.title}</span>
                                                    <span className="fs-7 p-1 d-inline-flex align-content center">
                                                        {product?.color && (  // 加入條件檢查 (如果不加，資料在完全載入前就開始渲染了，會出錯)
                                                            <span
                                                                className="me-1 adminColorSquare"
                                                                style={{ backgroundColor: product.color.colorCode }}
                                                            ></span>
                                                        )}
                                                        {product?.color?.colorName} x {product.qty}
                                                    </span>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="text-end">$ {order.total.toLocaleString()}</td>
                                        <td className="text-center">
                                            {order.is_paid === true ? (
                                                <span className="badge rounded-pill text-bg-success text-white d-inline-flex">
                                                    <span className="material-icons text-white align-content-center fs-6 me-1">
                                                        check
                                                    </span>
                                                    已付款
                                                </span>
                                            ) : (
                                                <span className="badge rounded-pill text-bg-danger text-white d-inline-flex">
                                                    <span className="material-icons text-white align-content-center fs-6 me-1">
                                                        clear
                                                    </span>
                                                    未付款
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <span style={{ whiteSpace: 'pre-line' }}>{formatDate(order.create_at)}</span>
                                        </td>
                                        <td>
                                            <Link to={order.id} className="btn btn-edit-outline me-3">
                                                管理
                                            </Link>
                                            <button
                                                type="button"
                                                className="btn btn-delete-outline me-3"
                                                onClick={() => openDeleteOrderModal(order)}
                                            >
                                                刪除
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">
                                        <p className="text-center text-secondary my-0 fx-7">目前沒有訂單</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
                </div>
            </section>
            <DeleteOrderModal
                tempModalData={tempModalData}
                getOrdersList={getOrdersList}
                setTempModalData={setTempModalData}
                isOpen={isDeleteOrderModalOpen}
                setIsOpen={setIsDeleteOrderModalOpen}
            />
            {isScreenLoading && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(201,223,238,0.7)',
                        zIndex: 1999,
                    }}
                >
                    <ReactLoading type="spin" color="#fff" width="4rem" height="4rem" />
                </div>
            )}
        </>
    );
};
export default AdminOrder;