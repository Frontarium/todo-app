import { useMemo } from "react";
import { useAppSelector } from "./hooks";
import { selectTaskFilters } from "./selectors";
import { useGetTasksQuery } from "./taskApi";
import { inPeriod } from "./date";
import { TasksToolbar } from "./TasksToolbar";
import { ProgressBar } from "./ProgressBar";

export function AnalyticsPage() {
  const f = useAppSelector(selectTaskFilters);

  // Аналитика: смотрим НЕ архив
  const { data, isLoading, isError } = useGetTasksQuery({
    archived: false,
    status: "all",
    q: f.q,
    sort: "createdAt",
    order: "desc",
  });

  const tasks = data ?? [];

  const stats = useMemo(() => {
    const inRange = tasks.filter((t) => inPeriod(t.createdAt, f.period));
    const total = inRange.length;
    const done = inRange.filter((t) => t.status === "done").length;
    const todo = total - done;
    const percent = total === 0 ? 0 : (done / total) * 100;

    // простая “ленивая” метрика: чем больше todo — тем хуже :)
    const laziness = total === 0 ? 0 : (todo / total) * 100;

    return { total, done, todo, percent, laziness };
  }, [tasks, f.period]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Аналитика</h2>

      <TasksToolbar />

      {isLoading && <div>Загрузка...</div>}
      {isError && <div>Ошибка</div>}

      {!isLoading && !isError && (
        <div style={{ display: "grid", gap: 12 }}>
          <Card title="Сводка">
            <Row label="Всего задач" value={stats.total} />
            <Row label="Выполнено" value={stats.done} />
            <Row label="Активных" value={stats.todo} />
          </Card>

          <Card title="Прогресс">
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Процент выполнения за период
              </div>
              <ProgressBar value={stats.percent} />
            </div>
          </Card>

          <Card title="Индекс лени">
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Чем выше — тем больше невыполненных задач
              </div>
              <ProgressBar value={stats.laziness} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,.08)",
        padding: 14,
        display: "grid",
        gap: 10,
      }}
    >
      <div style={{ fontWeight: 900 }}>{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
      <div style={{ opacity: 0.75 }}>{label}</div>
      <div style={{ fontWeight: 900 }}>{value}</div>
    </div>
  );
}
