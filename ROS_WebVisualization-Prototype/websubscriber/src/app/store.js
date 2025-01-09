import {configureStore, createStore} from '@reduxjs/toolkit'
import {publishedTopicSlice} from "../../../../ROS_WebVisualization-Prototype/ROS_WebVisualization-Prototype/websubscriber/src/features/PublishedTopics/PublishedTopicSlice";
import {PanelSlice} from "../../../../ROS_WebVisualization-Prototype/ROS_WebVisualization-Prototype/websubscriber/src/features/Panel/PanelSlice";
import {IpServer} from "../../../../ROS_WebVisualization-Prototype/ROS_WebVisualization-Prototype/websubscriber/src/features/IPserver/IpServer";
import {markerClickReducer} from "../../../../ROS_WebVisualization-Prototype/ROS_WebVisualization-Prototype/websubscriber/src/features/MarkerClickReducer/showComponentMapMarker";

export const store = configureStore({
  reducer: {
    TopicList: publishedTopicSlice.reducer,
    PanelList: PanelSlice.reducer,
    ipServerReducer: IpServer.reducer,
    markerDisplayState: markerClickReducer.reducer
  }
})
