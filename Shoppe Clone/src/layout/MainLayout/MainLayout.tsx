// MainLayout.tsx
import Footer from 'src/components/Footer';
import Header from 'src/components/Header';
import { Suspense } from 'react';
import Skeleton from 'src/pages/Skeleton';



interface Props {
    children?: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex-1 min-h-[700px]'>
                <Suspense fallback={<Skeleton />}>
                    {children}
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
