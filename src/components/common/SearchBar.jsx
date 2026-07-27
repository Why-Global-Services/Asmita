import { useState } from "react";
export default function SearchBar({
  onSearch,
  onChange,
  onFocus,
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
      className={`flex w-full max-w-xs overflow-hidden rounded-md border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-[#d69aeb] ${className}`}
      onSubmit={submit}>
      <input
        className="min-w-0 flex-1 px-3 py-2 text-sm outline-none"
        value={value}
        onChange={change}
        onFocus={onFocus}
        placeholder={placeholder}
      />
      <button
        className="px-3 text-xl text-[#79259c] hover:bg-[#faf4fc]"
        aria-label="Search">
        ⌕
      </button>
    </form>
  );
}
