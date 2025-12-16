import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import s from "./TaskFormModal.module.scss";
import { taskSchema, type TaskFormShape } from "./schema";

export function TaskFormModal({
  open,
  title,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  initial?: TaskFormShape;
  onClose: () => void;
  onSubmit: (v: TaskFormShape) => Promise<void> | void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TaskFormShape>({
    defaultValues: initial ?? { title: "", description: "" },
    resolver: yupResolver(taskSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (open) reset(initial ?? { title: "", description: "" });
  }, [open, initial, reset]);

  if (!open) return null;

  return (
    <div className={s.backdrop} role="dialog" aria-modal="true">
      <div className={s.modal}>
        <div className={s.head}>
          <div className={s.hTitle}>{title}</div>
          <button className={s.iconBtn} type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form
          className={s.form}
          onSubmit={handleSubmit(async (v) => {
            await onSubmit(v);
            onClose();
          })}
        >
          <label className={s.field}>
            <span className={s.label}>Название</span>
            <input className={s.input} {...register("title")} />
            {errors.title?.message && (
              <span className={s.err}>{errors.title.message}</span>
            )}
          </label>

          <label className={s.field}>
            <span className={s.label}>Описание</span>
            <textarea className={s.textarea} {...register("description")} />
            {errors.description?.message && (
              <span className={s.err}>{errors.description.message}</span>
            )}
          </label>

          <div className={s.actions}>
            <button className={s.btnGhost} type="button" onClick={onClose}>
              Отмена
            </button>
            <button
              className={s.btnPrimary}
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Сохраняю..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
