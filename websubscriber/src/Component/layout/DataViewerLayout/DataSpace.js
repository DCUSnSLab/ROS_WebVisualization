import React from "react";
import Kakaomap from "./kakaomap";

function DataSpace({ vehicles, vehiclesData }) {
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <Kakaomap vehicles={vehicles} vehiclesData={vehiclesData} />
        </div>
    );
}

export default DataSpace;
