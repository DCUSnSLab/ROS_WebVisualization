import {configureStore, createStore} from '@reduxjs/toolkit'
import {publishedTopicSlice} from "../features/PublishedTopics/PublishedTopicSlice";
import {PanelSlice} from "../features/Panel/PanelSlice";
import {IpServer} from "../features/IPserver/IpServer";
import {markerClickReducer} from "../features/MarkerClickReducer/showComponentMapMarker";

export const store = configureStore({
  reducer: {
    TopicList: publishedTopicSlice.reducer,
    PanelList: PanelSlice.reducer,
    ipServerReducer: IpServer.reducer,
    markerDisplayState: markerClickReducer.reducer
  }
})
