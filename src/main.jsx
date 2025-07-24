import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import router from './routes/router.jsx';
import store from './redux/store.js'; // 你自己的 Redux store
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../src/assets/styles/main.scss'; 

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
