import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";

export function useTaskNoteEdit(
  note: string,
  onNoteSubmit: (note: string) => boolean,
) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const skipBlurRef = useRef(false);
  const [draft, setDraft] = useState(note);
  const [isEditing, setIsEditing] = useState(false);

  syncClosedDraft(isEditing, draft, note, setDraft);
  useNoteFocus(isEditing, inputRef);

  const save = () => {
    commitNoteDraft(draft, note, onNoteSubmit, setIsEditing, skipBlurRef);
  };

  const cancel = () => {
    cancelNoteEdit(note, setDraft, setIsEditing, skipBlurRef);
  };

  return {
    draft,
    inputRef,
    isEditing,
    onBlur: save,
    onChange: setDraft,
    onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => {
      onNoteKeyDown(event, save, cancel);
    },
    startEdit: () => {
      setIsEditing(true);
    },
  };
}

function syncClosedDraft(
  isEditing: boolean,
  draft: string,
  note: string,
  setDraft: (note: string) => void,
): void {
  if (!isEditing && draft !== note) {
    setDraft(note);
  }
}

function useNoteFocus(
  isEditing: boolean,
  inputRef: RefObject<HTMLTextAreaElement | null>,
): void {
  useEffect(() => {
    if (!isEditing) {
      return;
    }

    inputRef.current?.focus();
  }, [inputRef, isEditing]);
}

function commitNoteDraft(
  draft: string,
  note: string,
  onNoteSubmit: (note: string) => boolean,
  setIsEditing: (isEditing: boolean) => void,
  skipBlurRef: { current: boolean },
): void {
  if (skipBlurRef.current) {
    skipBlurRef.current = false;
    return;
  }

  if (draft.trim() === note) {
    setIsEditing(false);
    return;
  }

  if (onNoteSubmit(draft)) {
    setIsEditing(false);
  }
}

function cancelNoteEdit(
  note: string,
  setDraft: (note: string) => void,
  setIsEditing: (isEditing: boolean) => void,
  skipBlurRef: { current: boolean },
): void {
  skipBlurRef.current = true;
  setDraft(note);
  setIsEditing(false);
}

function onNoteKeyDown(
  event: KeyboardEvent<HTMLTextAreaElement>,
  save: () => void,
  cancel: () => void,
): void {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    save();
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    cancel();
  }
}
