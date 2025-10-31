// 메인페이지(그룹)
import MainLayout from "../Component/layout/MainLayout/MainLayout";
import DropdownPgGroup from '../Component/Dropdown/DropdownPgGroup';
import React from "react";

function MainPgGroup() {
    return (
        <div>
            <MainLayout name={"이름(Group)"} dropdownContent={<DropdownPgGroup />}></MainLayout>
        </div>
    );
}

export default MainPgGroup;