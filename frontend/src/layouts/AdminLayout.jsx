import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar'; 
import { Outlet } from 'react-router-dom'; // ✅ Import Outlet

const AdminLayout = ({ title = "Admin Dashboard", activeTab = 'dashboard' }) => {
  return (
    <div className="flex h-screen bg-grocery-bg overflow-hidden">
      {/* 1. Sidebar */}
      <Sidebar active={activeTab} />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Utility Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex-1 max-w-xl">
             <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search products, orders, customers..." 
                  className="w-full bg-gray-50 border-none rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-grocery-primary/20 transition-all outline-none"
                />
             </div>
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-grocery-heading leading-tight">Admin User</p>
                <p className="text-xs text-grocery-body leading-tight">Store Manager</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-grocery-primary/10">
                <img 
                  src="https://ui-avatars.com/api/?name=Admin+User&background=0aad0a&color=fff" 
                  alt="Admin Profile" 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <section className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Title & "New" Button Row */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-grocery-heading tracking-tight">{title}</h1>
                <p className="text-sm text-grocery-body">Manage your store operations and analytics.</p>
              </div>
              <button className="bg-grocery-primary hover:bg-grocery-primaryHover text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-green-100 active:scale-95">
                + New Product
              </button>
            </div>

            {/* ✅ CRITICAL CHANGE: Replace {children} with <Outlet /> */}
            {/* This tells React Router: "Put the sub-page content here" */}
            <Outlet /> 
          </div>
        </section>
      </main>
    </div>
  );
};

AdminLayout.propTypes = {
  title: PropTypes.string,
  activeTab: PropTypes.string
};

export default AdminLayout;