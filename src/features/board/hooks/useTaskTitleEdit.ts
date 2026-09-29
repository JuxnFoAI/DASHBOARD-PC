import { useEffect, useRef, useState, type KeyboardEvent } from "react";

export function useTaskTitleEdit(
  title: string,
  onTitleSubmit: (title: string) => boolean,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const skipBlurRef = useRef(false);
  const [draft, setDraft] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  if (!isEditing && draft !== title) {
    setDraft(title);
  }

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  const save = () => {
    if (skipBlurRef.current) {
      skipBlurRef.current = false;
      return;
    }

    if (draft.trim() === title) {
      setIsEditing(false);
      return;
    }

    if (onTitleSubmit(draft)) {
      setIsEditing(false);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      save();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      skipBlurRef.current = true;
      setDraft(title);
      setIsEditing(false);
    }
  };

  return {
    draft,
    inputRef,
    isEditing,
    onBlur: save,
    onChange: setDraft,
    onKeyDown,
    startEdit: () => {
      setIsEditing(true);
    },
  };
}
