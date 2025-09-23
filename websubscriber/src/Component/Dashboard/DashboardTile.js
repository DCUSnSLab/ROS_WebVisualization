// 대시보드 정보 출력 공간 컴포넌트

import './css/DashboardTile.css';

const DashboardTile = ({children, className =''}) => {
    return(
        <div className={`dash-box ${className}`}>
            {children}
        </div>
    );
}

export default DashboardTile;