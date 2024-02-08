import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import {Menu, MenuItem, ProSidebarProvider, Sidebar, useProSidebar} from "react-pro-sidebar";
import VehicleStatus from "../Component/vehicleStatus";
import React from "react";
import AllTopicSub from "./AllTopicSub";


function LeftSideBar(){

    const { collapseSidebar } = useProSidebar();

    return(
    <div id="app" style={({ height: "100vh" }, { display: "flex" })}>
      <Sidebar style={{ height: "100vh" }}>
        <Menu>
          <MenuItem
            onClick={() => {
              collapseSidebar();
            }}
            icon={<MenuOutlinedIcon/>}
            style={{ textAlign: "center" }}
          >
            {" "}
            <h2>MENU</h2>
          </MenuItem>
        </Menu>
          <div className="vehicle">
                <VehicleStatus/>
            </div>
          {/*<div className="topicAll">*/}
          {/*      <AllTopicSub/>*/}
          {/*  </div>*/}
      </Sidebar>
    </div>
    );
}

export default LeftSideBar;