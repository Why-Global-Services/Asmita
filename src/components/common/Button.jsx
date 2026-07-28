const variants = {
  primary:
    "bg-[#79259c] text-white hover:bg-[#621b80] shadow-sm",
  outline:
    "border border-[#79259c] bg-white text-[#79259c] hover:bg-[#faf4fc]",
  ghost:
    "bg-transparent text-[#79259c] hover:bg-[#faf4fc]",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`
        inline-flex
        min-h-[44px]
        items-center
        justify-center
        rounded-md
        px-4
        py-2.5
        text-sm
        font-bold
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-[#c578e0]
        focus:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-60
        sm:px-5
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}