import React from "react";
import PropTypes from "prop-types";

export default function SidebarItem({ 
  icon: Icon, 
  label, 
  active = false, 
  collapsed = false, 
  onClick,
  variant = "default" 
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center transition-all duration-200 group
        ${collapsed ? "justify-center px-0" : "px-3"}
        ${variant === "logout" 
          ? "text-red-400 hover:bg-red-500/20" 
          : active 
            ? "bg-emerald-500/80 text-white font-bold shadow-lg shadow-emerald-500/20" 
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }
        py-3 rounded-2xl
      `}
      title={collapsed ? label : ""}
    >
      <div className={`flex items-center justify-center shrink-0 ${collapsed ? "" : "mr-3"}`}>
        <Icon size={20} />
      </div>
      
      {!collapsed && (
        <span className="text-sm truncate whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
}

SidebarItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  collapsed: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["default", "logout"]),
};
