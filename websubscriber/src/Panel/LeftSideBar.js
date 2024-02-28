import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import {Menu, MenuItem, ProSidebarProvider, Sidebar, useProSidebar} from "react-pro-sidebar";
import VehicleStatus from "../Component/vehicleStatus";
import React from "react";
import AllTopicSub from "./AllTopicSub";
import CheckBoxState from "./CheckBoxState";

function LeftSideBar(){

    return(
        <div id="app" style={{ height: "30vh", display: "flex", width: "20vw"}}>
            <VehicleStatus/>
        </div>
    );
}

export default LeftSideBar;