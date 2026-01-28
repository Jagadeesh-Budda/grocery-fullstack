import React, { useState, useEffect } from "react";
// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderBar
        onToggleSidebar={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      /> 
      
      <div className="flex flex-1 relative">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          activeCategory={activeCategory}
          onCategorySelect={(id) => setActiveCategory(id)}
        />
        
        <main 
          className={`
            flex-1 transition-all duration-300 ease-in-out p-6 bg-[#F8FAFB]
            ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[240px]"}
          `}
        >
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet
              context={{
                activeCategory,
                setActiveCategory,
                searchTerm,
                setSearchTerm,
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}