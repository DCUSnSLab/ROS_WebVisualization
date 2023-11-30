import VehicleStatus from "../Component/vehicleStatus";
import ImageLR from "../Component/ImageLR";
import PCL from "../Component/PCL";
import React from "react";


export default function Visualize(){
    return(
        <div>
            <h3>Visualize</h3>
            <VehicleStatus/>
            <ImageLR/>
            <PCL/>
        </div>
    );
}