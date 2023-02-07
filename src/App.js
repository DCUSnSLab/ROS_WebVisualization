import React from "react";
import KaKaoMap from "./KaKaomap";
import Marker from "./marker";
import Pcd_data, {MM} from "./pcd_data";

function App() {
  return (
    <div>
        {/*<KaKaoMap/>*/}
        {/*<Marker/>*/}
        <MM/>
        <Pcd_data/>
    </div>
  );
}

export default App;