import { configureStore } from "@reduxjs/toolkit";
import ClickedChannelReducer from "../variable/ClickedChannelSlice";
import UpdateChannelReducer from "../variable/UpdateChannelSlice";
import UpdateChatContextReducer from "../variable/UpdateChatContextSlice";
import WorkSpaceReducer from "../variable/WorkSpaceSlice";
import OnEditProfileReducer from "../variable/OnEditProfileSlice";

export const store = configureStore({
  reducer: {
    ClickedChannel: ClickedChannelReducer,
    UpdateChannel: UpdateChannelReducer,
    UpdateChatContext: UpdateChatContextReducer,
    getMyWorkSpace: WorkSpaceReducer,
    switchOnOff: OnEditProfileReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
