import { useState } from 'react';

type Props = {
  onSubmit: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
};

export default function SearchBar({ onSubmit, placeholder, defaultValue }: Props) {
  const [value, setValue] = useState(defaultValue ?? '');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = value.trim();
        if (v) onSubmit(v);
      }}
      className="flex items-center gap-2 rounded-md border border-line bg-paper-deep px-3 py-2"
    >
      <span className="text-sepia text-sm">⌕</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? 'Search by title or ISBN'}
        className="flex-1 bg-transparent text-ink placeholder:text-sepia-light outline-none text-sm"
        autoCorrect="off"
        autoCapitalize="off"
        inputMode="search"
      />
      <button
        type="submit"
        className="rounded-md bg-burgundy px-3 py-1 text-xs font-semibold text-paper-light"
      >
        Search
      </button>
    </form>
  );
}
