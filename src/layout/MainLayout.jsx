import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Loading from '../components/common/Loading';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    const loading = useSelector(state => state.home.loading);

    return (
        <div className="main-layout">
            {loading && <Loading />}
            <Header />
            <main className="main-content px-4 py-6">
                <Outlet /> {/* Đây là nơi các route con được render */}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
