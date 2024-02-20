import {configureStore} from '@reduxjs/toolkit'
import {publishedTopicSlice} from "../features/PublishedTopics/PublishedTopicSlice";


export const store = configureStore({
  reducer: {
    TopicList: publishedTopicSlice.reducer
  }
})