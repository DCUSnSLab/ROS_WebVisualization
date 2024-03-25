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
      chartData: [],
      selectedTopics: {},
      vehicleMovingStatus : '',
      webPageStatus: false
    },
    reducers: {
       updatedTopic: (state, action) => {
          state.topics.topic = action.payload;
      },
      checkedTopic: (state, action) => {
        state.checkedTopics.topic = action.payload;
      },
      updateWebPageStatus: (state, action) => {
         state.loggingStatus = action.payload;
      }
    }
})
export const {updateWebPageStatus, checkedTopic, updatedTopic, setSelectedTopic} = publishedTopicSlice.actions;

export default publishedTopicSlice.reducer