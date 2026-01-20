import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    visible: false,
    position: { x: 0, y: 0 },
    vehicle: null,
};

export const infoBoxSlice = createSlice({
    name: 'infoBox',
    initialState,
    reducers: {
        showInfoBox: (state, action) => {
            state.visible = true;
            state.position = { x: action.payload.x, y: action.payload.y };
            state.vehicle = action.payload.vehicle;
        },
        hideInfoBox: (state) => {
            state.visible = false;
            state.vehicle = null;
        },
    },
});

export const { showInfoBox, hideInfoBox } = infoBoxSlice.actions;

export default infoBoxSlice.reducer;

