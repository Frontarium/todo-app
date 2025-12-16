import { Routes, Route, Navigate } from "react-router-dom";
import { TasksPage } from "./TasksPage";
import { AnalyticsPage } from "./AnalyticsPage";
import { ArchivePage } from "./ArchivePage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tasks" replace />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/archive" element={<ArchivePage />} />
      <Route path="*" element={<div style={{ padding: 18 }}>404</div>} />
    </Routes>
  );
}
