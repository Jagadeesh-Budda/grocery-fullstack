import React from "react";

export default function DashboardFooter() {
  return (
    <footer className="mt-12 border-t border-white/40 pt-6 pb-10">
      <p className="text-sm text-slate-600">
        © {new Date().getFullYear()} FreshCartFlow — UI layout placeholder.
      </p>
    </footer>
  );
}
