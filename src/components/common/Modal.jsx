import { useEffect } from "react";

export default function Modal({ open, onClose, children }) {
  useEffect(() => {
    const key = (e) => e.key === "Escape" && onClose?.();

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", key);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", key);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#211027]/55 p-3 sm:p-4"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        className="relative my-auto w-full max-w-2xl rounded-xl bg-white p-5 shadow-2xl sm:p-6"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-2xl text-slate-500 transition-colors hover:bg-[#faf4fc] hover:text-[#79259c]"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        {children}
      </section>
    </div>
  );
}