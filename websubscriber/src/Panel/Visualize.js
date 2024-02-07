'use client';
import VehicleStatus from "../Component/vehicleStatus";
import ImageLR from "../Component/ImageLR";
import PCL from "../Component/PCL";
import React from "react";
import VehicleReactChart from "../Component/VehicleReactChart";


export default function Visualize(){
    return(
        <div className="visualize_back">
            <div>
                <VehicleReactChart/>
            </div>
            <div className="vehicle">
                <VehicleStatus/>
            </div>
            <div className="image" >
                <ImageLR/>
            </div>
            <div className="pointcl">
                <PCL/>
            </div>
        </div>
    );
}