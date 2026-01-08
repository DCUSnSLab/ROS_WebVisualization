import { createSlice } from '@reduxjs/toolkit'

// reducer
export const publishedTopicSlice = createSlice({
  name: 'TopicList',
    initialState: {
      // Storing topics per vehicle
      topicsByVehicle: { 
        // [vehicleId]: { topic: [], type: [], gps: '' }
      },
      // List of topics currently being visualized
      checkedTopics: [ 
        // { vehicleId: string, topic: string, id: string }
      ],
      chartData: {}, // Could also be keyed by vizId
      selectedTopics: {}, // May also need refactoring
      vehicleMovingStatus : '', // May need to be per-vehicle
    },
    reducers: {
      // Updates the list of available topics for a specific vehicle
      updateTopicsForVehicle: (state, action) => {
        const { vehicleId, topics } = action.payload;
        state.topicsByVehicle[vehicleId] = topics;
      },
      // Adds a topic to the list of visualized topics
      addCheckedTopic: (state, action) => {
        const { vehicleId, topic } = action.payload;
        const vizId = `${vehicleId}#${topic}`; // Create a unique ID for this visualization
        const existing = state.checkedTopics.find(t => t.id === vizId);
        if (!existing) {
          state.checkedTopics.push({ vehicleId, topic, id: vizId });
        }
      },
      // Removes a topic from the list
      removeCheckedTopic: (state, action) => {
        const { vizId } = action.payload; // Remove by the unique visualization ID
        state.checkedTopics = state.checkedTopics.filter(t => t.id !== vizId);
      },
      updateWebPageStatus: (state, action) => {
        state.loggingStatus = action.payload;
      }
    }
})
export const {
  updateTopicsForVehicle,
  addCheckedTopic,
  removeCheckedTopic,
  updateWebPageStatus,
  } = publishedTopicSlice.actions;

export default publishedTopicSlice.reducer