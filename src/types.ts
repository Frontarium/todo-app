export type TaskStatus = "todo" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  archived: boolean;

  createdAt: string; // ISO
  updatedAt: string; // ISO
  doneAt: string | null;
  archivedAt: string | null;
};

export type CreateTaskDTO = Pick<Task, "title" | "description">;
export type UpdateTaskDTO = Partial<
  Pick<
    Task,
    | "title"
    | "description"
    | "status"
    | "archived"
    | "doneAt"
    | "archivedAt"
    | "updatedAt"
  >
>;
