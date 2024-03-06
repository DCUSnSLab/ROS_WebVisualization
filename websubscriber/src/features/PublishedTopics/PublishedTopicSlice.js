import { createSlice } from '@reduxjs/toolkit'
import {useSelector} from "react-redux";

// reducer
export const publishedTopicSlice = createSlice({
  name: 'TopicList',
    initialState: {
      topics: {
        topic: [],
        type: []
      },
      checkedTopics: {
        topic: []
      },
      selectedTopics: {},
    },
    reducers: {
       updatedTopic: (state, action) => {
          state.topics.topic = action.payload;
      },
      checkedTopic: (state, action) => {
        state.checkedTopics.topic = action.payload;
      },
      setSelectedTopic: (state, action) => {
        state.selectedTopics[action.payload.id] = action.payload.topic;
      }
    }
})

// action
export const {checkedTopic, updatedTopic, setSelectedTopic} = publishedTopicSlice.actions;

export default publishedTopicSlice.reducer