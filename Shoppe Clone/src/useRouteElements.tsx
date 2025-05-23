import { useContext, lazy, Suspense } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import RegisterLayout from './layout/RegisterLayout';
import MainLayout from './layout/MainLayout';
import { AppContext } from './contexts/app.context';
import { path } from './components/constants/path';
import CartLayout from './layout/CartLayout';

const Login = lazy(() => import('./pages/Login'))
const Profile = lazy(() => import('./pages/Profile'))
const ProductList = lazy(() => import('./pages/ProductList'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const UserLayout = lazy(() => import('./pages/User/layouts/UserLayout'))
const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword'))
const HistoryPurchase = lazy(() => import('./pages/User/pages/HistoryPurchase'))
const NotFound = lazy(() => import('./pages/NotFound'))
function ProtectedRoute() {
    const { isAuthenticated } = useContext(AppContext);
    return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
}
function RejectedRoute() {
    const { isAuthenticated } = useContext(AppContext);
    return !isAuthenticated ? <Outlet /> : <Navigate to='' />;
}
export default function useRouteElements() {
    const routeElements = useRoutes([
        {
            path: '',
            element: <ProtectedRoute />,
            children: [
                {
                    path: path.cart,
                    element: (
                        <CartLayout>
                            <Suspense>
                                <Cart />
                            </Suspense>
                        </CartLayout>
                    )
                },
                {
                    path: path.user,
                    element: (
                        <MainLayout>
                            <Suspense>
                                <UserLayout />
                            </Suspense>
                        </MainLayout>
                    ),
                    children: [

                        {
                            path: path.profile,
                            element: (
                                <Suspense>
                                    <Profile />
                                </Suspense>
                            )
                        },

                        {
                            path: path.changePassword,
                            element: (
                                <Suspense>
                                    <ChangePassword />
                                </Suspense>
                            )
                        },
                        {
                            path: path.historyPurchase,
                            element: (<Suspense>
                                <HistoryPurchase />
                            </Suspense>)
                        }
                    ]
                }
            ]
        },
        {
            path: '',
            element: <RejectedRoute />,
            children: [
                {
                    path: '',
                    element: <RegisterLayout />,
                    children: [
                        {
                            path: path.login,
                            element: (
                                <Suspense>
                                    <Login />
                                </Suspense>
                            )
                        },
                        {
                            path: path.register,
                            element: (
                                <Suspense>
                                    <Register />
                                </Suspense>
                            )
                        }
                    ]
                }
            ]
        },
        {
            path: path.home,
            index: true,
            element: (
                <MainLayout>
                    <Suspense>
                        <ProductList />
                    </Suspense>
                </MainLayout>
            )
        }
        ,
        {
            path: path.productDetail,
            element: (
                <MainLayout>
                    <Suspense>
                        <ProductDetail />
                    </Suspense>
                </MainLayout>
            )
        },
        {
            path: path.notFound,
            element: (
                <MainLayout>
                    <Suspense>
                        <NotFound />
                    </Suspense>
                </MainLayout>
            )
        }
    ]);
    return routeElements;
}
