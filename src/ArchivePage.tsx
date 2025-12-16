import { useState } from "react";
import {
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "./taskApi";
import type { Task } from "./types";

export function ArchivePage() {
  const { data, isLoading, isError } = useGetTasksQuery({
    archived: true,
    status: "all",
    sort: "updatedAt",
    order: "desc",
  });
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [q, setQ] = useState("");

  const items = (data ?? []).filter((t) =>
    q
      ? (t.title + " " + t.description).toLowerCase().includes(q.toLowerCase())
      : true
  );

  async function restore(t: Task) {
    await updateTask({
      id: t.id,
      patch: {
        archived: false,
        archivedAt: null,
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
        <h2 style={{ margin: 0 }}>Архив</h2>
        <input
          style={{
            height: 40,
            padding: "0 12px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,.12)",
          }}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск в архиве..."
        />
      </div>

      {isLoading && <div>Загрузка...</div>}
      {isError && <div>Ошибка</div>}

      {!isLoading && !isError && (
        <div style={{ display: "grid", gap: 10 }}>
          {items.length === 0 ? (
            <div
              style={{
                padding: 14,
                background: "#fff",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,.08)",
                opacity: 0.75,
              }}
            >
              Архив пуст
            </div>
          ) : (
            items.map((t) => (
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
                  <div style={{ fontWeight: 900 }}>{t.title}</div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button onClick={() => restore(t)} style={btn()}>
                      Вернуть
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
                  В архиве с:{" "}
                  {t.archivedAt
                    ? new Date(t.archivedAt).toLocaleString("ru-RU")
                    : "-"}
                </div>
              </div>
            ))
          )}
        </div>
      )}
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
