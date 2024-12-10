import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth";
import loadingSlice from "./slices/loading";
const store = configureStore({
    reducer: {
        auth: authSlice,
        loading: loadingSlice,
    }
});

export default store;