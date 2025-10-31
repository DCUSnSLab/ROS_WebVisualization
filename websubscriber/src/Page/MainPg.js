// 메인페이지(개인)

import MainLayout from "../Component/layout/MainLayout/MainLayout";
import DropdownPg from '../Component/Dropdown/DropdownPg';
import React, {useState} from "react";


function MainPg() {

    return (
        <div>
            <MainLayout name={"이름"} dropdownContent={<DropdownPg />}></MainLayout>
        </div>
    );
}

export default MainPg;