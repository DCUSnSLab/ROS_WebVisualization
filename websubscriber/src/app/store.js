import {configureStore, createStore} from '@reduxjs/toolkit'
import {publishedTopicSlice} from "../features/PublishedTopics/PublishedTopicSlice";
import {PanelSlice} from "../features/Panel/PanelSlice";
import {IpServer} from "../features/IPserver/IpServer";

export const store = configureStore({
  reducer: {
    TopicList: publishedTopicSlice.reducer,
    PanelList: PanelSlice.reducer,
    ipServer: IpServer.reducer
  }
})
