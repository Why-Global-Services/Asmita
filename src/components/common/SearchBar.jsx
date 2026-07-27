import { useState } from "react";

export default function SearchBar({
  onSearch,
  onChange,
  onFocus,
  onBlur,
  placeholder = "Search products",
  value: controlledValue,
  className = "",
}) {
  const [internalValue, setInternalValue] = useState("");

  const value = controlledValue ?? internalValue;

  const change = (e) => {
    setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form
      className={`flex w-full max-w-xs overflow-hidden rounded-lg border border-slate-200 bg-white transition focus-within:ring-2 focus-within:ring-[#d69aeb] ${className}`}
      onSubmit={submit}
    >
      <input
        className="min-w-0 flex-1 px-3 py-2.5 text-sm outline-none sm:py-2"
        value={value}
        onChange={change}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
      />

      <button
        type="submit"
        className="flex h-10 w-10 items-center justify-center text-lg text-[#79259c] transition hover:bg-[#faf4fc]"
        aria-label="Search"
      >
        ⌕
      </button>
    </form>
  );
}