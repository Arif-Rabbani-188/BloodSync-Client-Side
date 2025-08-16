import React from "react";

const sizeMap = {
  sm: { box: "h-8 w-8", border: "border-4" },
  md: { box: "h-12 w-12", border: "border-4" },
  lg: { box: "h-16 w-16", border: "border-8" },
  xl: { box: "h-20 w-20", border: "border-8" },
};

const Loader = ({ size = "lg", overlay = false, message }) => {
  const s = sizeMap[size] || sizeMap.lg;

  const spinner = (
    <div
      className={`rounded-full ${s.box} ${s.border} animate-spin`}
      style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-primary)" }}
    />
  );

  if (overlay) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center z-50"
        style={{ background: "var(--color-surface)", opacity: 0.6 }}
      >
        <div className="flex flex-col items-center gap-3">
          {spinner}
          {message ? <div className="text-sm text-[var(--color-muted)]">{message}</div> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        {spinner}
        {message ? <div className="text-sm text-[var(--color-muted)]">{message}</div> : null}
      </div>
    </div>
  );
};

export default Loader;
