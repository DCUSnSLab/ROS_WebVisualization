// 메인페이지(개인)

import MainLayout from "../Component/layout/MainLayout/MainLayout";
import DropdownPg from '../Component/Dropdown/DropdownPg';
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfoBox from "../Component/layout/DataViewerLayout/InfoBox";
import { hideInfoBox } from "../features/infobox/infoBoxSlice";


function MainPg() {
    const dispatch = useDispatch();
    const infoBoxVisible = useSelector((state) => state.infoBox.visible);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (infoBoxVisible && !document.getElementById('info-box')?.contains(event.target)) {
                dispatch(hideInfoBox());
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [infoBoxVisible, dispatch]);


    return (
        <div>
            <MainLayout name={"이름"} dropdownContent={<DropdownPg />} />
            <InfoBox />
        </div>
    );
}

export default MainPg;