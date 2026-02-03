import React from "react";

export default function HeroSection({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  imageSrc,
  imageAlt = "",
}) {
  return (
    <section
      className={
        "rounded-2xl border border-slate-200/70 bg-white/60 backdrop-blur-xl bg-gradient-to-br from-emerald-50/70 via-sky-50/60 to-lime-50/70 p-6 sm:p-8 shadow-sm shadow-black/5 dark:border-slate-700/60 dark:bg-slate-950/35 dark:from-emerald-400/10 dark:via-sky-400/10 dark:to-lime-400/10 dark:shadow-black/30"
      }
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-base sm:text-lg text-slate-700 max-w-xl dark:text-slate-200">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {primaryAction ? (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:focus-visible:ring-emerald-300/60"
              >
                {primaryAction.icon}
                {primaryAction.label}
              </button>
            ) : null}

            {secondaryAction ? (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200/70 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 dark:bg-slate-900/40 dark:text-slate-100 dark:ring-slate-700/70 dark:hover:bg-slate-900/55 dark:focus-visible:ring-emerald-300/40"
              >
                {secondaryAction.icon}
                {secondaryAction.label}
              </button>
            ) : null}
          </div>
        </div>

        {imageSrc ? (
          <div className="flex justify-center md:justify-end">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full max-w-[460px] h-auto object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
