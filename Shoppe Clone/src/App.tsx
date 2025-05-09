import { useContext, useEffect } from 'react';
import useRouteElements from './useRouteElements';
import { ToastContainer } from 'react-toastify';
import { localStorageEventTarget } from './utils/auth';
import { AppContext } from './contexts/app.context';
function App() {
    const routeElements = useRouteElements();
    const { reset } = useContext(AppContext)
    useEffect(() => {
        localStorageEventTarget.addEventListener('clearLS', reset)
    }, [])
    return (
        <div>
            {routeElements}
            <ToastContainer />
        </div>
    );
}

export default App;
