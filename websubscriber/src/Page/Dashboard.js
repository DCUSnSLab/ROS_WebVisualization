import React from "react";
import './bashboard.css';
import DashboardTile from "../Component/DashboardTile";
import {Link} from "react-router-dom";
import DashboardChart from "../Component/DashboardChart";

function Dashboard() {
    return(
        <div className='dashboard'>
            <h1 className="header">Dashboard</h1>
            <Link to='/test' className='next'>Next ></Link>


            <DashboardTile>User
            <p className='item'>이름(ID)</p>
            </DashboardTile>
            <DashboardTile>Number of registered vehicles
            <p className='item'>사용자가 가지고 있는 차량 수</p>
            </DashboardTile>
            <DashboardTile>Number of joined groups
            <p className='item'>사용자가 가입한 그룹 수</p>
            </DashboardTile>

            <DashboardTile className="notice">Notice</DashboardTile>
            <DashboardTile>Usage Time Slot
            <DashboardChart></DashboardChart>
            </DashboardTile>
            <DashboardTile>Event occurrence Event
            <DashboardChart></DashboardChart>
            </DashboardTile>
            <DashboardTile>Frequently Used Topics
            <DashboardChart></DashboardChart>
            </DashboardTile>
        </div>
    );
}

export default Dashboard;


