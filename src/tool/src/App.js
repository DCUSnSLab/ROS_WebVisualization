import React from 'react';
import {Link, Outlet} from "react-router-dom";
import './App.css';

function App() {

  return(
    <div>
    <div id="topnav">
      <Link to="first">
        First
      </Link>
      <Link to="second">
        Second
      </Link>
    </div>
      <Outlet/>
    </div>
  )
}

export default App
