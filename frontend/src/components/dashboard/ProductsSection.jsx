import React from "react";
import { Link } from "react-router-dom";

import CategoryTabs from "./CategoryTabs";

export default function ProductsSection({
  title,
  subtitle,
  categories,
  activeCategory,
  onCategoryChange,
  rightLink,
  children,
}) {
  return (
    <section aria-label={title}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>

            {rightLink ? (
              <Link
                to={rightLink.to}
                className="shrink-0 text-sm font-semibold text-emerald-700 hover:text-emerald-800 sm:hidden"
              >
                {rightLink.label} →
              </Link>
            ) : null}
          </div>

          {subtitle ? (
            <p className="mt-0.5 text-sm text-slate-600">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {categories?.length ? (
            <CategoryTabs
              categories={categories}
              active={activeCategory}
              onChange={onCategoryChange}
            />
          ) : null}

          {rightLink ? (
            <Link
              to={rightLink.to}
              className="hidden sm:flex items-center gap-1 shrink-0 whitespace-nowrap text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              {rightLink.label} →
            </Link>
          ) : null}
        </div>
      </div>

      {children}
    </section>
  );
}
