// setting 페이지 (개인)
import React from 'react';
import SettingTab from '../Component/Setting/SettingTab';
import Individual from '../Component/Setting/Individual';
import Vehicle from  '../Component/Setting/Vehicle';
import LoggingTopic from "../Component/Setting/LoggingTopic";

function Setting() {
    return (
        <div>
            <SettingTab
                tab1Name ={'Individual'}
                tab2Name ={'Vehicle'}
                tab3Name ={'LoggingTopic'}
                tab1 ={<Individual/>}
                tab2 ={<Vehicle vehicleText={'Group'} title={'Vehicle registration'}/>}
                tab3 ={<LoggingTopic/>}
                exit = '/main'
            ></SettingTab>
        </div>
    );
}

export default Setting;