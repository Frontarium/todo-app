import s from "./ProgressBar.module.scss";

export function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={s.root} aria-label="progress">
      <div className={s.bar} style={{ width: `${v}%` }} />
      <div className={s.text}>{v.toFixed(0)}%</div>
    </div>
  );
}
