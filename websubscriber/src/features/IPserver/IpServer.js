import { createSlice } from '@reduxjs/toolkit'
import * as ROSLIB from "roslib";

export const IpServer = createSlice({
    name: 'IpServer',
    initialState: {
      // VisualizeSystemAddress: 'ws://203.250.33.143:9090'
      // VisualizeSystemAddress: ''
      VisualizeSystemAddress: 'ws://127.0.0.1:9090'
    },
    reducers: {
        addServer: (state, action) => {
          state.VisualizeSystemAddress = action.payload;
      }
    }
})
export const {addServer} = IpServer.actions;

export default IpServer.reducer