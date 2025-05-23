import { useContext, useEffect } from 'react';
import useRouteElements from './useRouteElements';
import { ToastContainer } from 'react-toastify';
import { localStorageEventTarget } from './utils/auth';
import { AppContext } from './contexts/app.context';
import ErrorBoundary from './components/ErrorBoundary';
function App() {
    const routeElements = useRouteElements();
    const { reset } = useContext(AppContext)
    useEffect(() => {
        localStorageEventTarget.addEventListener('clearLS', reset)
        return () => {
            localStorageEventTarget.removeEventListener('clearLS', reset)
        }
    }, [reset])
    return (
        <div>
            <ErrorBoundary>
                {routeElements}
                <ToastContainer />
            </ErrorBoundary>
        </div>
    );
}

export default App;
