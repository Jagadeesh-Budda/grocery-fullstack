import React, { useEffect, useState } from "react";

/**
 * Calculate animation delay based on index for staggered entry.
 * @param {number} index
 * @returns {number} delay in ms
 */
function getStaggerDelay(index) {
  return index * 80;
}

function ActionCard({
  title,
  description,
  cta,
  onClick,
  rightSlot,
  icon,
  iconClassName = "bg-slate-100/80 text-slate-600",
  index = 0,
}) {
  const [mounted, setMounted] = useState(false);

  // Staggered mount animation
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), getStaggerDelay(index));
    return () => clearTimeout(timer);
  }, [index]);

  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const animationClass = prefersReducedMotion
    ? ""
    : "transition-all duration-300 ease-out";

  const visibilityClass = mounted
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-3";

  return (
    <div
      className={`
        min-w-[280px] flex-1 rounded-2xl p-5
        border border-white/50
        bg-white/60 backdrop-blur-xl
        shadow-[0_4px_24px_rgba(0,0,0,0.04)]
        hover:bg-white/75 hover:shadow-[0_6px_28px_rgba(0,0,0,0.06)]
        ${animationClass}
        ${visibilityClass}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          {icon ? (
            <div
              className={
                "grid h-10 w-10 place-items-center rounded-xl shrink-0 " +
                iconClassName
              }
            >
              {icon}
            </div>
          ) : null}

          <div className="min-w-0">
            <p className="text-xs font-bold tracking-wide uppercase text-slate-900">
              {title}
            </p>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
        </div>

        {rightSlot}
      </div>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 w-full rounded-full bg-emerald-700 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
      >
        {cta}
      </button>
    </div>
  );
}

export default function QuickActions({ actions }) {
  return (
    <section aria-label="Quick actions">
      <div className="hidden md:grid grid-cols-3 gap-4">
        {actions.map((a, index) => (
          <ActionCard
            key={a.key}
            title={a.title}
            description={a.description}
            cta={a.cta}
            onClick={a.onClick}
            rightSlot={a.rightSlot}
            icon={a.icon}
            iconClassName={a.iconClassName}
            index={index}
          />
        ))}
      </div>

      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scroll-smooth">
          {actions.map((a, index) => (
            <ActionCard
              key={a.key}
              title={a.title}
              description={a.description}
              cta={a.cta}
              onClick={a.onClick}
              rightSlot={a.rightSlot}
              icon={a.icon}
              iconClassName={a.iconClassName}
              index={index}
            />
          ))}
          <div className="w-2 shrink-0" />
        </div>
      </div>
    </section>
  );
}
