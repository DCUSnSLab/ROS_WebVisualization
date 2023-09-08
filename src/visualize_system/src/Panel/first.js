/* global kakao */
import React, {useEffect, useState} from 'react';
import './first.css';
import Kakaomap from "../Component/Kakaomap";
import Usage from "../Component/Usage";

function First() {

  return(
    <div className="firstContainer">
      <div className="header">
        <h2>First Panel</h2>
        <h3>CPU</h3>
        <h3>MEMORY</h3>
        <Usage/>
      </div>
      <Kakaomap/>
    </div>
  )
}

export default First;
