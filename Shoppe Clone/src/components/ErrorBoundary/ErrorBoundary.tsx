import { Component, ErrorInfo, ReactNode } from 'react'


interface Props {
    children?: ReactNode
}

interface State {
    hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    }

    public static getDerivedStateFromError(_: Error): State {

        return { hasError: true }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {

        console.error('Uncaught error: ', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <main className='flex h-screen w-full flex-col items-center justify-center'>
                    <h1 className='text-9xl font-extrabold tracking-widest text-gray-900'>500</h1>
                    <div className='absolute rotate-12 rounded bg-orange px-2 text-sm text-white'>Error!</div>
                    <button className='mt-5'>
                        <a
                            href='/'
                            className='active:text-orange-500 group relative inline-block text-sm font-medium text-white focus:outline-none focus:ring shadow-sm'
                        >
                            <span className='absolute inset-0 bg-orange transition-transform group-hover:translate-y-0 group-hover:translate-x-0' />
                            <span className='relative block border border-current px-8 py-3'>
                                <span>Go Home</span>
                            </span>
                        </a>
                    </button>
                </main>
            )
        }

        return this.props.children
    }
}
