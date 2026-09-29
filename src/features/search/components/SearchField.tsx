import type { KeyboardEvent } from "react";

type SearchFieldProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

const FIELD_ID = "task-search-query";

export function SearchField({ query, onQueryChange }: SearchFieldProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Escape" || query === "") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    onQueryChange("");
  };

  return (
    <div className="px-4 pt-4 pb-3">
      <label htmlFor={FIELD_ID} className="sr-only">
        Buscar por título o nota
      </label>
      <input
        id={FIELD_ID}
        type="search"
        value={query}
        autoComplete="off"
        autoFocus
        placeholder="Buscar por título o nota"
        onChange={(event) => {
          onQueryChange(event.target.value);
        }}
        onKeyDown={onKeyDown}
        className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg"
      />
    </div>
  );
}
