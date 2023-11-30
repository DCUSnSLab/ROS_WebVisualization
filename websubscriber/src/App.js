import React, {useEffect, useState} from 'react';
import Kakaomap from "./Component/kakaomap";
import {Menu, MenuItem, Sidebar, SubMenu} from "react-pro-sidebar";

import * as ROSLIB from "roslib";
import {Link} from "react-router-dom";

const ros = new ROSLIB.Ros({
        url : 'ws://localhost:9090'
});

const App = () => {
    ros.on('error', function (error) {
        console.log(error);
        document.getElementById('header').style.backgroundColor = "#f03737";
    });
    ros.on('connection', function () {
        console.log('Connection made!');
        document.getElementById('header').style.backgroundColor = "#07a666";
    });
    ros.on('close', function () {
        console.log('Connection closed.');
        document.getElementById('header').style.backgroundColor = "#a0a0a0";
    });

    const listener = new ROSLIB.Topic({
        ros: ros,
        name: "/scvVehiclePub",
        messageType: "std_msgs/String"
    });

    const [scvVehicle, setScvVehicle] = useState();

    useEffect(() => {
        listener.subscribe((message) => {
            console.log(message)
            setScvVehicle(message.data)
        });
    }, []);


      const [toggled, setToggled] = React.useState(false);
    return (
        <div>
          <div id="header" style={{width: "100%", height: "5rem", textAlign: "center",fontSize: "50px"}}>Rosbridge Connection Check</div>
            <div style={{ display: 'flex', height: '100%', minHeight: '400px' }}>
            <Sidebar onBackdropClick={() => setToggled(false)} toggled={toggled} breakPoint="always">
              <Menu>
                  <Link to="/visualize" target="_blank" style={{textDecoration: "none", color: "black"}}><MenuItem> SCV </MenuItem></Link>
              </Menu>
            </Sidebar>
            <main style={{ display: 'flex', padding: 10, width: "10rem"}}>
              <div>
                <button style={{width: "8rem", height: "3rem", fontSize: "1.5rem"}} className="sb_button" onClick={() => setToggled(!toggled)}>
                  Vehicle
                </button>
              </div>
            </main>
          </div>
            {/*<img src={Daram} height="500px" width="530px"/>*/}
            <Kakaomap/>
        </div>
    );
}


export default App;