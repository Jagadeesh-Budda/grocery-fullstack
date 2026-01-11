import React from 'react';
import PropTypes from 'prop-types';
import AdminSidebar from './AdminSidebar.jsx';
import { Outlet, useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // adjust path if needed

const AdminLayout = ({ title = "Admin Dashboard", activeTab = 'dashboard' }) => {
  const navigate = useNavigate();

  // ✅ LOGOUT HANDLER (SESSION-BASED)
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout'); // backend session invalidation
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      // UI cleanup
      sessionStorage.clear();
      localStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  return (
      <div className="flex h-screen bg-grocery-bg overflow-hidden">
        {/* AdminSidebar with logout */}
        <AdminSidebar active={activeTab} onLogout={handleLogout} />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* header + content unchanged */}
          <Outlet />
        </main>
      </div>
  );
};

AdminLayout.propTypes = {
  title: PropTypes.string,
  activeTab: PropTypes.string
};

export default AdminLayout;
