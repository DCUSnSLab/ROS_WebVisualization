import { createSlice } from '@reduxjs/toolkit'
import {useSelector} from "react-redux";

export const PanelSlice = createSlice({
    name: 'PanelList',
    initialState: {
        PanelList: []
        },
    reducers: {
        addPanel: (state, action) => {
            state.PanelList.push(action.payload)
        },
        deletePanel: (state, action) => {
            const id = action.payload;
            const index = state.PanelList.findIndex(panel => {
                console.log('panel :', panel, 'panel.id :', panel.id, ' id :',id)
                return panel.id === id
            });
            state.PanelList.splice(index, 1);
            console.log(state.PanelList.splice(index, 1))
        }
    }
})

export const {addPanel, deletePanel, updatedPanel} = PanelSlice.actions;

export default PanelSlice.reducer