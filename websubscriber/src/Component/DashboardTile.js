import './DashboardTile.css';

const DashboardTile = ({children, className =''}) => {
    return(
        <div className={`dash-box ${className}`}>
            {children}
        </div>
    );
}

export default DashboardTile;