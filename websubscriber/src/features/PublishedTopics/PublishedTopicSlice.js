import { createSlice } from '@reduxjs/toolkit'

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
      // serverIP : 'ws://localhost:9090'
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
      },
      // setServerIP: (state, action) => {
      //    state.serverIP = action.payload
      // }
    }
})

// action
export const {checkedTopic, setServerIP, updatedTopic, setSelectedTopic} = publishedTopicSlice.actions;

export default publishedTopicSlice.reducer