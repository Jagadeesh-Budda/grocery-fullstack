import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import "./HeaderBar.css";

export default function HeaderBar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "";
const avatarLetter = username
  ? username.charAt(0).toUpperCase()
  : "?";


  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login"; // full reset
  };

  return (
    <header className="hb-root">
      <div className="hb-inner">
        {/* LEFT */}
        <div className="hb-logo">
          <strong>groceRythm</strong>
        </div>

        {/* CENTER */}
        <div className="hb-search">
          <div className="hb-search-box">
            <input
              type="text"
              placeholder="Search products, recipes..."
              className="hb-search-input"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="hb-controls">
          <Link to="/groceries/cart" className="hb-cart-btn">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="hb-cart-badge">{totalItems}</span>
            )}
          </Link>

          <button className="hb-btn">🔔</button>

          <div style={{ position: "relative" }}>
            <button
              className="hb-avatar"
              onClick={() => setOpen(!open)}
            >
              <div className="avatar-circle">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {user?.username}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {user?.role === "ROLE_ADMIN" ? "Admin" : "User"}
                </div>
              </div>
              ▼
            </button>

            {open && (
              <div className="hb-dropdown">
                <div
                  className="hb-dd-item"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
