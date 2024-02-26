import {configureStore} from '@reduxjs/toolkit'
import {publishedTopicSlice} from "../features/PublishedTopics/PublishedTopicSlice";
import postsSlice from "../features/Post/postsSlice";

export const store = configureStore({
  reducer: {
    TopicList: publishedTopicSlice.reducer,
    posts: postsSlice.reducer
  }
})