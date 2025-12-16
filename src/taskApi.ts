import { baseApi } from "./baseApi";
import type { Task, UpdateTaskDTO } from "./types";

type GetTasksArgs = {
  archived?: boolean;
  status?: "todo" | "done" | "all";
  q?: string;
  sort?: "createdAt" | "updatedAt" | "title";
  order?: "asc" | "desc";
};

export const taskApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<Task[], GetTasksArgs>({
      query: ({
        archived,
        status = "all",
        q,
        sort = "createdAt",
        order = "desc",
      }) => {
        const params = new URLSearchParams();
        if (typeof archived === "boolean")
          params.set("archived", String(archived));
        if (status !== "all") params.set("status", status);
        if (q?.trim()) params.set("q", q.trim());
        params.set("_sort", sort);
        params.set("_order", order);
        return `tasks?${params.toString()}`;
      },
      providesTags: (res) =>
        res
          ? [
              { type: "Tasks" as const, id: "LIST" },
              ...res.map((t) => ({ type: "Tasks" as const, id: t.id })),
            ]
          : [{ type: "Tasks" as const, id: "LIST" }],
    }),

    addTask: build.mutation<Task, Task>({
      query: (body) => ({ url: "tasks", method: "POST", body }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),

    updateTask: build.mutation<Task, { id: string; patch: UpdateTaskDTO }>({
      query: ({ id, patch }) => ({
        url: `tasks/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Tasks", id: arg.id },
        { type: "Tasks", id: "LIST" },
      ],
    }),

    deleteTask: build.mutation<void, string>({
      query: (id) => ({ url: `tasks/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
