import { useLayoutEffect, useRef } from "react";

export function useChartLoad<T extends HTMLElement>(
  play: (root: HTMLElement) => () => void,
) {
  const rootRef = useRef<T>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    return play(root);
  }, [play]);

  return rootRef;
}
