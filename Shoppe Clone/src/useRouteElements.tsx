import { useRoutes } from 'react-router-dom';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import Register from './pages/Register';
import RegisterLayout from './layout/RegisterLayout';

export default function useRouteElements() {
    const routeElements = useRoutes([
        {
            path: '/login',
            element: (
                <RegisterLayout>
                    <Login />
                </RegisterLayout>
            )
        },
        {
            path: '/',
            element: <ProductList />
        },
        {
            path: '/register',
            element: (
                <RegisterLayout>
                    <Register />
                </RegisterLayout>
            )
        }
    ]);
    return routeElements;
}
