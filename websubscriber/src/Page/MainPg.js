import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DropdownPg from "../Component/Dropdown/DropdownPg";
import MainLayout from "../Component/layout/MainLayout/MainLayout";

function MainPg() {
    const dispatch = useDispatch();
    const infoBoxVisible = useSelector((state) => state.infoBox.visible);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                infoBoxVisible &&
                !document.getElementById("info-box")?.contains(event.target)
            ) {
                // Keep outside-click behavior disabled for now.
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dispatch, infoBoxVisible]);

    return (
        <div>
            <MainLayout name={"user"} dropdownContent={<DropdownPg />} />
        </div>
    );
}

export default MainPg;
