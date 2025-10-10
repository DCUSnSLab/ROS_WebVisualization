// 대시보드 정보 출력 공간 컴포넌트
//children: 출력 공간 이름

import '../../css/DashboardTile.css';

const DashboardTile = ({children, className =''}) => {
    return(
        <div className={`dash-box ${className}`}>
            {children}
        </div>
    );
}

export default DashboardTile;