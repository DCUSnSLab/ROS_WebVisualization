import {configureStore} from '@reduxjs/toolkit'
import {publishedTopicSlice} from "../features/PublishedTopics/PublishedTopicSlice";
import {PanelSlice} from "../features/Panel/PanelSlice";
import {markerClickReducer} from "../features/MarkerClickReducer/showComponentMapMarker";
import { infoBoxSlice } from '../features/infobox/infoBoxSlice';

export const store = configureStore({
  reducer: {
    TopicList: publishedTopicSlice.reducer,
    PanelList: PanelSlice.reducer,
    markerDisplayState: markerClickReducer.reducer,
    infoBox: infoBoxSlice.reducer,
  }
})
