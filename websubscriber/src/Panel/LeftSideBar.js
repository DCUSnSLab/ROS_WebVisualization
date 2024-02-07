import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import {Menu, MenuItem, ProSidebarProvider, Sidebar, useProSidebar} from "react-pro-sidebar";


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
            <MenuItem icon={<HomeOutlinedIcon />}>Home</MenuItem>
            <MenuItem icon={<PeopleOutlinedIcon />}>Team</MenuItem>
            <MenuItem icon={<ContactsOutlinedIcon />}>Contacts</MenuItem>
            <MenuItem icon={<ReceiptOutlinedIcon />}>Profile</MenuItem>
            <MenuItem icon={<HelpOutlineOutlinedIcon />}>FAQ</MenuItem>
            {/*<MenuItem icon={<CalendarTodayOutlinedIcon />}>Calendar</MenuItem>*/}
        </Menu>
      </Sidebar>
    </div>
    );
}

export default LeftSideBar;