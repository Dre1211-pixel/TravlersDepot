import { createHashRouter } from "react-router-dom";
import FrontLayout from "../layout/FrontLayout";
import Home from "../views/front/Home";
import ProductLayout from "../layout/ProductLayout";
import ProductList from "../views/front/ProductList";
import SearchProductResult from "../views/front/SearchProductResult";
import ProductDetail from "../views/front/ProductDetail";
import Cart from "../views/front/Cart";
import CreateOrderSuccess from "../views/front/CreateOrderSuccess";
import About from "../views/front/About";
import Favorite from "../views/front/Favorite";
import Login from "../views/front/Login";
import AdminLayout from "../layout/AdminLayout";
import AdminProduct from "../views/admin/AdminProduct";
import AdminOrder from "../views/admin/AdminOrder";
import AdminSingleOrder from "../views/admin/AdminSingleOrder";
import AdminCoupon from "../views/admin/AdminCoupon";
import NotFound from "../views/front/NotFound";
import ToDoList from "../views/front/ToDoList";

const router = createHashRouter([
    {
        path: '/',
        element: <FrontLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'productList',
                element: <ProductLayout />,
                children: [
                    {
                        path: 'all',
                        element: <ProductList />
                    },
                    {
                        path: 'search/:search', // search/:search 是在定義動態路由參數，其中 :search 就會被當作變數來抓值（Ex: /search/抹茶 → search = "抹茶")
                        element: <SearchProductResult />
                    }
                ]
            },
            {
                path: 'productList/:id', // search/:search 是在定義動態路由參數，其中 :search 就會被當作變數來抓值（Ex: /search/抹茶 → search = "抹茶")
                element: <ProductDetail/>
            },
            {
                path: 'cart',
                element: <Cart />,
            },
            {
                path: 'orderSuccess/:id',
                element: <CreateOrderSuccess />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'favorite',
                element: <Favorite />,
            },
            {
                path: 'todoList',
                element: <ToDoList/>,
            }
        ]
    },
    {
        path: 'login',
        element: <Login />,
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                path: 'product',
                element: <AdminProduct />,
            },
            {
                path: 'order',
                element: <AdminOrder />,
            },
            {
                path: 'order/:id',
                element: <AdminSingleOrder />,
            },
            {
                path: 'coupon',
                element: <AdminCoupon />,
            },

        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
])
export default router;