import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import {Menu, MenuItem, ProSidebarProvider, Sidebar, useProSidebar} from "react-pro-sidebar";
import VehicleStatus from "../Component/vehicleStatus";
import React, {useEffect, useState} from "react";
import AllTopicSub from "./AllTopicSub";
import CheckBoxState from "./CheckBoxState";
import GaugeChart from 'react-gauge-chart'

function LeftSideBar(){
  const [currentPercent, setCurrentPercent] = useState();
  const [arcs, setArcs] = useState([0.5, 0.3, 0.2])

    useEffect(() => {
       const timer = setTimeout(() => {
          setCurrentPercent(Math.random());
          setArcs([0.1, 0.5, 0.4])
            }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const chartStyle = {
        height: 250,
	}

    return(
        <div id="app" style={{ height: "30vh", display: "flex", width: "20vw"}}>
            <GaugeChart
                id="gauge-chart7"
                style={chartStyle}
                percent={currentPercent}
                animDelay={0}
            />
        </div>
    );
}

export default LeftSideBar;