import type { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import s from "./AppLayout.module.scss";

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className={s.root}>
      <header className={s.header}>
        <div className={s.brand}>Admin Tasks</div>
        <nav className={s.nav}>
          <NavLink
            to="/tasks"
            className={({ isActive }) => (isActive ? s.active : s.link)}
          >
            Задачи
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) => (isActive ? s.active : s.link)}
          >
            Аналитика
          </NavLink>
          <NavLink
            to="/archive"
            className={({ isActive }) => (isActive ? s.active : s.link)}
          >
            Архив
          </NavLink>
        </nav>
      </header>
      <main className={s.main}>{children}</main>
    </div>
  );
}
