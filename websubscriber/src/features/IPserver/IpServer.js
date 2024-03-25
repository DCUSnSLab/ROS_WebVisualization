import { createSlice } from '@reduxjs/toolkit'

// reducer
export const IpServer = createSlice({
  name: 'IpServer',
    initialState: {
      VisualizeSystemAddress: 'ws://203.250.33.143:9090'
    },
    reducers: {
      addServer: (state, action) => {
        state.VisualizeSystemAddress.push(action.payload);
      }
    }
})
export const {addServer} = IpServer.actions;

export default IpServer.reducer