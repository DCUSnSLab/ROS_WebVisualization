import React from 'react';
import './second.css';
import ImageLR from "../Component/ImageLR";
import Simula from "../Component/PointCloud";

function Second() {
  return(
    <div>
      <h2>Second</h2>
      <Simula/>
      <ImageLR/>
      {/*<div className="down_panel">*/}
      {/*  <div style={{width: '100%', height: 'auto'}}>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )

}

export default Second;
