import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import { taskFiltersReducer } from "./slice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    taskFilters: taskFiltersReducer,
  },
  middleware: (gDM) => gDM().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
