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
      selectedTopics: {}
    },
    reducers: {
       updatedTopic: (state, action) => {
          state.topics.topic = action.payload;
      },
      checkedTopic: (state, action) => {
        state.checkedTopics.topic = action.payload;
      },
      addServer: (state, action) => {
        state.servers.push(action.payload);
      }
    }
})

// action
export const {checkedTopic, addServer, setCurrentServerId, updatedTopic, setSelectedTopic} = publishedTopicSlice.actions;

export default publishedTopicSlice.reducer