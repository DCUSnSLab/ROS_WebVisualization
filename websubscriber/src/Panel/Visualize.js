'use client';
import ImageLR from "../Component/ImageLR";
import PCL from "../Component/PCL";
import React, {useEffect, useRef, useState} from "react";
import './Visualize.css';
import VehicleReactChart from "../Component/VehicleReactChart";
import AllTopicSub from "./AllTopicSub";


export default function Visualize(){

    return(
        <div className="visualize_back"  style={{display: "table"}}>
            <div style={{display: "table-cell-group"}}>
                <div style={{display: "table-cell", width: "20%"}}>
                    <AllTopicSub/>
                </div>
                <div style={{display: "table-row-group", width: "80%"}}>
                    <div style={{display: 'table-cell-group'}}>
                        <div style={{display: "table-cell", width: "auto"}}>
                            <ImageLR/>
                        </div>
                        <div style={{display: "table-cell", width: "auto"}}>
                            <PCL/>
                        </div>
                    </div>
                    <div style={{display: "table-row", width: "70%"}}>
                        {/*<VehicleReactChart/>*/}
                    </div>
                </div>
            </div>
        </div>
    );
}