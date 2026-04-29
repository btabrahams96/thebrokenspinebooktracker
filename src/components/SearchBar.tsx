import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { SearchIcon } from './icons';

type Props = {
  onSubmit: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
  liveValue?: string;
  onChange?: (v: string) => void;
};

export type SearchBarHandle = {
  focus: () => void;
  clear: () => void;
};

const SearchBar = forwardRef<SearchBarHandle, Props>(function SearchBar(
  { onSubmit, placeholder, defaultValue, liveValue, onChange },
  ref
) {
  const [internal, setInternal] = useState(defaultValue ?? '');
  const value = liveValue !== undefined ? liveValue : internal;
  const setValue = (v: string) => {
    if (liveValue !== undefined) onChange?.(v);
    else setInternal(v);
    if (liveValue === undefined) onChange?.(v);
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => setValue('')
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = value.trim();
        if (v) onSubmit(v);
      }}
      className="flex items-center gap-2 rounded-md border border-line bg-paper-deep px-3 py-2 focus-within:border-burgundy"
    >
      <SearchIcon className="h-4 w-4 text-sepia" />
      <input
        ref={inputRef}
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
});

export default SearchBar;
