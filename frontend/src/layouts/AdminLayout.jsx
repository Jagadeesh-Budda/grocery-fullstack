import React from "react";
import HeaderBar from "./HeaderBar";
import PropTypes from "prop-types";

const AdminLayout = ({ title = "Admin", children }) => {
  return (
    <div className="admin-main">
      {/* ✅ Top global header */}
      <HeaderBar />

      {/* ✅ Admin page header */}
      <div className="admin-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
            {title}
          </h1>
          <p
            style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}
            className="admin-subtitle"
          >
            Manage your store
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            style={{
              background: "transparent",
              border: "1px solid var(--soft-border)",
              padding: "8px 10px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            New
          </button>
        </div>
      </div>

      <main className="admin-content">{children}</main>
    </div>
  );
};

AdminLayout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default AdminLayout;
