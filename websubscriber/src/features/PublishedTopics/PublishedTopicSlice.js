import { createSlice } from '@reduxjs/toolkit'

// reducer
export const publishedTopicSlice = createSlice({
  name: 'TopicList',
  initialState: {
    topics: {
      topic: [],
      type: []
    },
    CheckedTopics: {
      topic: [],
      type: []
    }
  },
  reducers: {
     updatedTopic: (state, action) => {
        state.topics.topic = action.payload;
    },
    checkedTopic: (state, action) => {
        state.checkedTopics.topic = action.payload;
    }
  }
})

// action
export const {checkedTopic, updatedTopic} = publishedTopicSlice.actions;

export default publishedTopicSlice.reducer