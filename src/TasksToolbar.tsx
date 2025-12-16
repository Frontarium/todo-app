import { useAppDispatch, useAppSelector } from "./hooks";
import { selectTaskFilters } from "./selectors";
import { taskFiltersActions } from "./slice";
import s from "./TasksToolbar.module.scss";

export function TasksToolbar() {
  const dispatch = useAppDispatch();
  const f = useAppSelector(selectTaskFilters);

  return (
    <div className={s.root}>
      <input
        className={s.search}
        value={f.q}
        onChange={(e) => dispatch(taskFiltersActions.setQ(e.target.value))}
        placeholder="Поиск по задачам..."
      />

      <select
        className={s.select}
        value={f.status}
        onChange={(e) =>
          dispatch(taskFiltersActions.setStatus(e.target.value as any))
        }
      >
        <option value="all">Все</option>
        <option value="todo">Активные</option>
        <option value="done">Выполненные</option>
      </select>

      <select
        className={s.select}
        value={f.period}
        onChange={(e) =>
          dispatch(taskFiltersActions.setPeriod(e.target.value as any))
        }
      >
        <option value="all">За всё время</option>
        <option value="day">День</option>
        <option value="week">Неделя</option>
        <option value="month">Месяц</option>
      </select>

      <select
        className={s.select}
        value={f.sort}
        onChange={(e) =>
          dispatch(taskFiltersActions.setSort(e.target.value as any))
        }
      >
        <option value="createdAt">Создано</option>
        <option value="updatedAt">Обновлено</option>
        <option value="title">Название</option>
      </select>

      <select
        className={s.select}
        value={f.order}
        onChange={(e) =>
          dispatch(taskFiltersActions.setOrder(e.target.value as any))
        }
      >
        <option value="desc">DESC</option>
        <option value="asc">ASC</option>
      </select>

      <button
        className={s.btn}
        type="button"
        onClick={() => dispatch(taskFiltersActions.resetFilters())}
      >
        Сброс
      </button>
    </div>
  );
}
