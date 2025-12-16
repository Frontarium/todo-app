import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Period } from "./date";

export type SortKey = "createdAt" | "updatedAt" | "title";
export type Order = "asc" | "desc";
export type StatusFilter = "all" | "todo" | "done";

type State = {
  q: string;
  status: StatusFilter;
  period: Period;
  sort: SortKey;
  order: Order;
};

const initialState: State = {
  q: "",
  status: "all",
  period: "month",
  sort: "createdAt",
  order: "desc",
};

const slice = createSlice({
  name: "taskFilters",
  initialState,
  reducers: {
    setQ(s, a: PayloadAction<string>) {
      s.q = a.payload;
    },
    setStatus(s, a: PayloadAction<StatusFilter>) {
      s.status = a.payload;
    },
    setPeriod(s, a: PayloadAction<Period>) {
      s.period = a.payload;
    },
    setSort(s, a: PayloadAction<SortKey>) {
      s.sort = a.payload;
    },
    setOrder(s, a: PayloadAction<Order>) {
      s.order = a.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const taskFiltersActions = slice.actions;
export const taskFiltersReducer = slice.reducer;
