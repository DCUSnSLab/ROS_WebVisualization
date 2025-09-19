// 메인 화면 레이아웃
import React from "react";
import './MainLayout.css';
import Header from './MainHeader';
import Footer from './MainFooter';

type Props = React.PropsWithChildren<{
    sidebarTop? : React.ReactNode;
    sidebarBottom? : React.ReactNode;
    dropdownContent? : React.ReactNode;
    name? : React.ReactNode;
}>

const MainLayout: React.FC<Props> = ({children, sidebarTop, sidebarBottom, name, dropdownContent}) => {
    return (
        <div className='layout'>
            <Header name={name} dropdownContent={dropdownContent}/>
            <main className='main'>
                <div className='main-grid'>
                    <div className='side-bar-grid'>
                        <aside className='side-bar-topic'>
                            <h6 className='side-title'>Topic</h6>
                            {sidebarTop}
                        </aside>
                        <aside className='side-bar-vehicle'>
                            <h6 className='side-title'>Vehicle Status</h6>
                            {sidebarBottom}
                        </aside>
                    </div>

                    <section className='content'>
                        {children}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;