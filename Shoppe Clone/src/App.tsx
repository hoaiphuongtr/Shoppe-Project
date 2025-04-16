import useRouteElements from './useRouteElements';

function App() {
    const routeElements = useRouteElements();
    return <div className='fill-orange'>{routeElements}</div>;
}

export default App;
