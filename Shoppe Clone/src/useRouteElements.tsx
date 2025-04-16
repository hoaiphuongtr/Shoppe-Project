import { useRoutes } from 'react-router-dom';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import Register from './pages/Register';

export default function useRouteElements() {
    const routeElements = useRoutes([
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/',
            element: <ProductList />
        },
        {
            path: '/register',
            element: <Register />
        }
    ]);
    return routeElements;
}
