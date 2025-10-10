// 대시보드 페이지

import React from "react";
import '../css/bashboard.css';
import DashboardTile from "../Component/Dashboard/DashboardTile";
import {Link} from "react-router-dom";
import DashboardChart from "../Component/Dashboard/DashboardChart";

function Dashboard() {
    return(
        <div className='dashboard'>
            <h1 className="header">Dashboard</h1>
            <Link to='/main' className='next'>Next ></Link>

                <div className='box-size'>
                        <DashboardTile>User
                                <p className='item'>이름(ID)</p>
                        </DashboardTile>
                </div>

                <div className='box-size'>
                        <DashboardTile>Number of registered vehicles
                                <p className='item'>사용자가 가지고 있는 차량 수</p>
                        </DashboardTile>
                </div>

                <div className='box-size'>
                        <DashboardTile>Number of joined groups
                                <p className='item'>사용자가 가입한 그룹 수</p>
                        </DashboardTile>
                </div>

            <DashboardTile className="notice">Notice</DashboardTile>
            <DashboardTile >Usage Time Slot
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


