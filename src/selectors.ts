import type { RootState } from "./store";

export const selectTaskFilters = (s: RootState) => s.taskFilters;
