import type { CSSProperties } from "react";
import { toast } from "sonner";
import type { ExternalToast } from "sonner";
import { cn } from "../lib/cn";

/** How long a toast stays when you do not say otherwise, in milliseconds. */
export const TOAST_DURATION = 5000;

/** How long the result of a task stays after the task is done. */
const TASK_RESULT_DURATION = 3500;

/**
 * Adds the countdown bar to a toast. The bar is drawn in CSS (see `styles.css`,
 * class `toast-countdown`) and runs for the toast's duration, so the toast's
 * real `duration` and the bar's `--toast-duration` must be the same number.
 * This keeps them in sync.
 */
function withCountdown(options: ExternalToast = {}): ExternalToast {
  const duration = options.duration ?? TOAST_DURATION;
  return {
    ...options,
    duration,
    className: cn("toast-countdown", options.className),
    style: { "--toast-duration": `${duration}ms`, ...options.style } as CSSProperties,
  };
}

type TaskMessages<T> = {
  loading: string;
  success: string | ((result: T) => string);
  error: string | ((error: unknown) => string);
  description?: string;
};

/**
 * Use these instead of calling `toast` directly. Each one closes by itself,
 * with a countdown bar that shows how long is left (it pauses while you hover).
 * Call `notify.task()` for work that takes time.
 */
export const notify = {
  message: (title: string, options?: ExternalToast) => toast(title, withCountdown(options)),
  success: (title: string, options?: ExternalToast) => toast.success(title, withCountdown(options)),
  error: (title: string, options?: ExternalToast) => toast.error(title, withCountdown(options)),
  warning: (title: string, options?: ExternalToast) => toast.warning(title, withCountdown(options)),
  info: (title: string, options?: ExternalToast) => toast.info(title, withCountdown(options)),

  /**
   * A toast for work in progress. It cannot be closed or swiped away while the
   * task runs, and shows a moving bar. When the task finishes it turns into a
   * success or error toast, then closes by itself after a short countdown.
   * Returns the task's own result, so you can still `await` it.
   */
  task<T>(task: Promise<T> | (() => Promise<T>), messages: TaskMessages<T>) {
    const noClose: ExternalToast = {
      closeButton: false,
      dismissible: false,
      className: "toast-countdown",
      style: { "--toast-duration": `${TASK_RESULT_DURATION}ms` } as CSSProperties,
      duration: TASK_RESULT_DURATION,
    };

    const outcome = toast.promise(task, {
      loading: messages.loading,
      description: messages.description,
      ...noClose,
      success: (result: T) => ({
        message:
          typeof messages.success === "function" ? messages.success(result) : messages.success,
        ...noClose,
      }),
      error: (error: unknown) => ({
        message: typeof messages.error === "function" ? messages.error(error) : messages.error,
        ...noClose,
      }),
    });

    return outcome.unwrap();
  },
};
