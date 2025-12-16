import { useMemo, useState } from "react";
import { useAppSelector } from "./hooks";
import { selectTaskFilters } from "./selectors";
import {
  useAddTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "./taskApi";
import type { Task } from "./types";
import { inPeriod } from "./date";
import { makeId } from "./id";
import { TasksToolbar } from "./TasksToolbar";
import { TaskFormModal } from "./TaskFormModal";

export function TasksPage() {
  const f = useAppSelector(selectTaskFilters);

  const { data, isLoading, isError } = useGetTasksQuery({
    archived: false,
    status: f.status,
    q: f.q,
    sort: f.sort,
    order: f.order,
  });

  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [openCreate, setOpenCreate] = useState(false);
  const [edit, setEdit] = useState<Task | null>(null);

  const tasks = data ?? [];

  const filteredByPeriod = useMemo(() => {
    return tasks.filter((t) => inPeriod(t.createdAt, f.period));
  }, [tasks, f.period]);

  async function handleCreate(v: { title: string; description?: string }) {
    const now = new Date().toISOString();
    const t: Task = {
      id: makeId("t"),
      title: v.title,
      description: v.description ?? "",
      status: "todo",
      archived: false,
      createdAt: now,
      updatedAt: now,
      doneAt: null,
      archivedAt: null,
    };
    await addTask(t).unwrap();
  }

  async function handleEditSave(v: { title: string; description?: string }) {
    if (!edit) return;
    await updateTask({
      id: edit.id,
      patch: {
        title: v.title,
        description: v.description ?? "",
        updatedAt: new Date().toISOString(),
      },
    }).unwrap();
  }

  async function toggleDone(t: Task) {
    const next = t.status === "done" ? "todo" : "done";
    await updateTask({
      id: t.id,
      patch: {
        status: next,
        doneAt: next === "done" ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      },
    }).unwrap();
  }

  async function archive(t: Task) {
    await updateTask({
      id: t.id,
      patch: {
        archived: true,
        archivedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }).unwrap();
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0 }}>Задачи</h2>
        <button
          style={{
            height: 40,
            padding: "0 12px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,.12)",
            background: "#fff",
            cursor: "pointer",
          }}
          onClick={() => setOpenCreate(true)}
        >
          + Добавить
        </button>
      </div>

      <TasksToolbar />

      {isLoading && <div>Загрузка...</div>}
      {isError && <div>Ошибка</div>}

      {!isLoading && !isError && (
        <div style={{ display: "grid", gap: 10 }}>
          {filteredByPeriod.length === 0 ? (
            <div
              style={{
                padding: 14,
                background: "#fff",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,.08)",
                opacity: 0.75,
              }}
            >
              Нет задач по выбранным фильтрам
            </div>
          ) : (
            filteredByPeriod.map((t) => (
              <div
                key={t.id}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,.08)",
                  padding: 12,
                  display: "grid",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div style={{ fontWeight: 900 }}>
                    {t.status === "done" ? "✅ " : "📝 "}
                    {t.title}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button onClick={() => toggleDone(t)} style={btn()}>
                      {t.status === "done" ? "Снять выполнено" : "Выполнено"}
                    </button>
                    <button
                      onClick={() => {
                        setEdit(t);
                      }}
                      style={btn()}
                    >
                      Редактировать
                    </button>
                    <button onClick={() => archive(t)} style={btn()}>
                      В архив
                    </button>
                    <button
                      onClick={() => deleteTask(t.id)}
                      style={btnDanger()}
                    >
                      Удалить
                    </button>
                  </div>
                </div>

                {t.description && (
                  <div style={{ opacity: 0.8 }}>{t.description}</div>
                )}
                <div style={{ fontSize: 12, opacity: 0.65 }}>
                  Создано: {new Date(t.createdAt).toLocaleString("ru-RU")} •
                  Обновлено: {new Date(t.updatedAt).toLocaleString("ru-RU")}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <TaskFormModal
        open={openCreate}
        title="Новая задача"
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
      />

      <TaskFormModal
        open={!!edit}
        title="Редактирование"
        initial={
          edit
            ? { title: edit.title, description: edit.description }
            : undefined
        }
        onClose={() => setEdit(null)}
        onSubmit={handleEditSave}
      />
    </div>
  );
}

function btn(): React.CSSProperties {
  return {
    height: 34,
    padding: "0 10px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,.12)",
    background: "#fff",
    cursor: "pointer",
  };
}
function btnDanger(): React.CSSProperties {
  return { ...btn(), borderColor: "rgba(180,35,24,.35)" };
}
