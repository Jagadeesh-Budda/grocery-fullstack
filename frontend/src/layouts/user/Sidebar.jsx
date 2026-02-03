import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { sidebarConfig } from "./sidebar.config";
import SidebarItem from "./SidebarItem";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ 
  collapsed, 
  onCategorySelect, 
  activeCategory 
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleAction = async (item) => {
    if (item.action === "focus-search") {
      const searchInput = document.querySelector('input[placeholder*="Search"]');
      if (searchInput) {
        searchInput.focus();
      }
    } else if (item.action === "logout") {
      await logout();
      navigate("/login");
    } else if (item.action === "running-low") {
      navigate("/groceries/categories");
    } else if (item.categoryId) {
      onCategorySelect && onCategorySelect(item.categoryId);
      if (location.pathname !== "/groceries") {
        navigate("/groceries");
      }
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <aside 
      className={`
        fixed left-0 top-16 bottom-0 z-40 hidden lg:flex flex-col
        bg-[rgba(255,255,255,0.10)] backdrop-blur-[15px] backdrop-saturate-[160%] border-r border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)]
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[72px]" : "w-[240px]"}
      `}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar">
        {/* Top Section */}
        <div className="mb-6">
          {sidebarConfig.top.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              onClick={() => handleAction(item)}
            />
          ))}
        </div>

        {/* Categories Section */}
        <div className="mb-6">
          {!collapsed && (
            <h3 className="px-3 text-[11px] font-bold text-white/50 uppercase tracking-wider mb-2">
              Categories
            </h3>
          )}
          <div className="space-y-1">
            {sidebarConfig.categories.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
                active={activeCategory === item.categoryId}
                onClick={() => handleAction(item)}
              />
            ))}
          </div>
        </div>

        {/* Smart Section */}
        <div className="mb-6">
          <div className="space-y-1">
            {sidebarConfig.smart.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
                onClick={() => handleAction(item)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/30">
        <div className="space-y-1">
          {sidebarConfig.bottom.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              variant={item.action === "logout" ? "logout" : "default"}
              active={location.pathname === item.path}
              onClick={() => handleAction(item)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onCategorySelect: PropTypes.func,
  activeCategory: PropTypes.string,
};
