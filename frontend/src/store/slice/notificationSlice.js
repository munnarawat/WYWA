import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
};
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setInitialNotifications: (state, action) => {
      state.notifications = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
    },
    // new notification from socket;
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },

    // notification read / delete
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => (n._id || n.id) !== action.payload,
      );
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    // all clear notification
    removeAllNotification: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});
export const {
  setInitialNotifications,
  addNotification,
  removeAllNotification,
  removeNotification,
} = notificationSlice.actions;


export default notificationSlice.reducer;