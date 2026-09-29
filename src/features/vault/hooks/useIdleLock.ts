import { useEffect } from "react";
import { HIDDEN_LOCK_MS, IDLE_LOCK_MS } from "../vaultConstants.ts";
import { useVaultStore } from "../store/index.ts";

const ACTIVITY_EVENTS = ["pointerdown", "keydown", "scroll"] as const;

export function useIdleLock(isArmed: boolean): void {
  const lock = useVaultStore((state) => state.lock);

  useEffect(() => {
    if (!isArmed) {
      return;
    }

    let idleTimer = window.setTimeout(lock, IDLE_LOCK_MS);
    let hiddenTimer: number | null = null;

    const bumpIdle = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(lock, IDLE_LOCK_MS);
    };

    const onVisibility = () => {
      if (document.hidden) {
        hiddenTimer = window.setTimeout(lock, HIDDEN_LOCK_MS);
        return;
      }

      if (hiddenTimer !== null) {
        window.clearTimeout(hiddenTimer);
        hiddenTimer = null;
      }

      bumpIdle();
    };

    for (const name of ACTIVITY_EVENTS) {
      window.addEventListener(name, bumpIdle);
    }

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(idleTimer);
      if (hiddenTimer !== null) {
        window.clearTimeout(hiddenTimer);
      }

      for (const name of ACTIVITY_EVENTS) {
        window.removeEventListener(name, bumpIdle);
      }

      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isArmed, lock]);
}
