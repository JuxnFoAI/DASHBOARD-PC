import { useEffect, useRef, useState, type RefObject } from "react";
import { playTaskComplete } from "@/lib/motion.ts";
import type { Task } from "../types/index.ts";
import { useMoveTask } from "./useMoveTask.ts";

export function useCompleteTask(
  task: Task,
  rowRef: RefObject<HTMLLIElement | null>,
) {
  const { errorMessage, move } = useMoveTask(task.id);
  const cancelMotionRef = useRef<(() => void) | null>(null);
  const pendingCompleteRef = useRef(false);
  const moveRef = useRef(move);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    moveRef.current = move;
  }, [move]);

  const cancelMotion = () => {
    pendingCompleteRef.current = false;
    cancelMotionRef.current?.();
    cancelMotionRef.current = null;
  };

  useEffect(() => {
    return () => {
      const shouldPersist = pendingCompleteRef.current;
      cancelMotionRef.current?.();
      if (shouldPersist) {
        moveRef.current("done");
      }
    };
  }, []);

  const setCompleted = (isCompleted: boolean) => {
    cancelMotion();

    if (!isCompleted) {
      setIsCompleting(false);
      move("doing");
      return;
    }

    if (task.status === "done") {
      return;
    }

    setIsCompleting(true);

    const persistDone = () => {
      pendingCompleteRef.current = false;
      if (!move("done")) {
        setIsCompleting(false);
      }
    };

    const row = rowRef.current;
    if (row === null) {
      persistDone();
      return;
    }

    pendingCompleteRef.current = true;
    cancelMotionRef.current = playTaskComplete(row, persistDone);
  };

  return {
    cancelMotion,
    errorMessage,
    isCompleted: task.status === "done" || isCompleting,
    move,
    setCompleted,
  };
}
