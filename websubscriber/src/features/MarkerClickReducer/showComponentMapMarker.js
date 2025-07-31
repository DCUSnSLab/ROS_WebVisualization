
// 원래 하던 방식과 비교
// export const IpServer = createSlice({
//     name: 'IpServer',
//     initialState: {
//       // VisualizeSystemAddress: 'ws://203.250.33.143:9090'
//       VisualizeSystemAddress: ''
//     },
//     reducers: {
//         addServer: (state, action) => {
//           state.VisualizeSystemAddress = action.payload;
//       }
//     }
// })

// action type setting
const SHOW_COMPONENT_ON_MARKER_CLICK = 'SHOW_COMPONENT_ON_MARKER_CLICK';
const HIDE_COMPONENT = 'HIDE_COMPONENT';

// show component if mapmarker click true
export const showComponentOnMarkerClick = (markerData) => ({
  type: SHOW_COMPONENT_ON_MARKER_CLICK,
  payload: markerData,
});

// hideComponent if mapmarker click false
export const hideComponent = (markerData) => ({
  type: HIDE_COMPONENT,
  payload: markerData,
});



// initialState
const initialState = {
    isComponentVisible : false, // component visible status
    activeMarkerData : null // marker status
}

// reducer
export const markerClickReducer = (state = initialState, action) => {
    switch (action.type){
        case SHOW_COMPONENT_ON_MARKER_CLICK:
            return {
                ...state,
                isComponentVisible: action.payload,
            };
        case HIDE_COMPONENT:
            return{
                ...state,
                isComponentVisible: action.payload,
            };
        default:
            return state;
    }
}