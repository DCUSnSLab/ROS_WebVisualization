// setting 페이지 (그룹)
import React from 'react';
import SettingTab from '../Component/Setting/SettingTab';
import Group from '../Component/Setting/Group';
import Vehicle from  '../Component/Setting/Vehicle';
import People from "../Component/Setting/People";

function Setting() {
    return (
        <div>
            <SettingTab
                tab1Name ={'Group'}
                tab2Name ={'Vehicle'}
                tab3Name ={'People'}
                tab1 ={<Group/>}
                tab2 ={<Vehicle/>}
                tab3 ={<People/>}
                exit = '/group/main'
            ></SettingTab>
        </div>
    );
}

export default Setting;