import React, { useEffect, useState } from "react";
import { fetchAdminDashboard } from "../services/adminapi";
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import Card from "../common/Card"; // Ensure this path to your new Card is correct

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/stats", {
          method: "GET",
          credentials: "include",
        });

        // Handle authorization errors gracefully
        if (response.status === 401) {
          setError("Unauthorized: Please log in again");
          setLoading(false);
          return;
        }

        if (response.status === 403) {
          setError("Forbidden: You do not have permission to access this resource");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          setError(`Failed to fetch admin stats: ${response.statusText}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Admin stats fetch error:", err);
        setError("Failed to load dashboard stats. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const statsCards = stats
    ? [
        {
          label: "Total Products",
          value: stats.totalProducts ?? 0,
          change: "Live",
          icon: TrendingUp,
          color: "#10b981",
        },
        {
          label: "Total Categories",
          value: stats.totalCategories ?? 0,
          change: "Live",
          icon: DollarSign,
          color: "#3b82f6",
        },
        {
          label: "Total Users",
          value: stats.totalUsers ?? 0,
          change: "Live",
          icon: Users,
          color: "#8b5cf6",
        },
      ]
    : [];

  // mock data (KEEP AS-IS FOR DEMO)
  const topProducts = [];
  const stockAlerts = [];
  const recentOrders = [];

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-green-600">{stat.change}</p>
              </div>
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <Icon size={24} style={{ color: stat.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Products & Stock Alerts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: 20,
        }}
      >
        <div className="ad-card">
          <h3 className="ad-heading">Top Products</h3>
          <div className="ad-card-scroll">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sales</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((prod) => (
                  <tr key={prod.id}>
                    <td>{prod.name}</td>
                    <td>{prod.sales}</td>
                    <td style={{ fontWeight: 700, color: "#10b981" }}>
                      {prod.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ad-card">
          <h3 className="ad-heading">Stock Alerts</h3>
          {stockAlerts.map((alert) => (
            <div key={alert.id} className="flex gap-3 items-center">
              <AlertCircle size={20} />
              <span>{alert.product}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="ad-card">
        <h3 className="ad-heading">Recent Orders</h3>
        <div className="ad-card-scroll">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.customer}</td>
                  <td>{order.items}</td>
                  <td>{order.amount}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
