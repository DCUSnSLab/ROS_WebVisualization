import React from 'react';
import './second.css';
import Plot from "./Plot";
import ImageLR from "./ImageLR";
import RawMsg from "./RawMsg";
import Simula from "./PointCloud";

function Second() {
  return(
    <div>
      <h2>Second</h2>
      {/*<Simula/>*/}
      {/*<ImageLR/>*/}
      {/*<div className="down_panel">*/}
      {/*  <RawMsg/>*/}
      <Plot/>
      {/*  <div style={{width: '100%', height: 'auto'}}>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )

}

export default React.memo(Second);
