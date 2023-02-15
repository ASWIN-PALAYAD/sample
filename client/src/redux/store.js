import { configureStore,combineReducers } from "@reduxjs/toolkit";
import alertSlice from "./alertsSlice";
import userSllice from "./userSllice";

const rootReducer = combineReducers({
    alerts : alertSlice,
    users : userSllice
});

const store = configureStore({
    reducer : rootReducer
});

export default store;