import './DashboardTile.css';

const DashboardTile = ({children, width, height}) => {
    return(
        <div className='dash-box' style={{width, height}}>
            <div className='dash-content'>
                {children}
            </div>
        </div>
    );
}

export default DashboardTile;