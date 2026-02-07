import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminDashboard, getAdminOrders } from "../services/adminapi";
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import Card from "../common/Card"; 
import Badge from "../common/Badge";// Ensure this path to your new Card is correct

function statusVariant(status) {
  switch (status) {
    case "DELIVERED":
      return "success";
    case "SHIPPED":
    case "CONFIRMED":
      return "info";
    case "PACKED":
    case "CREATED":
    case "PENDING":
      return "warning";
    case "CANCELLED":
      return "danger";
    default:
      return "default";
  }
}

function formatMoney(amount) {
  if (amount == null) return "—";
  const value = typeof amount === "number" ? amount : Number(amount);
  if (Number.isNaN(value)) return String(amount);
  return value.toLocaleString(undefined, { style: "currency", currency: "INR" });
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalSales: 0,
    totalIncome: 0,
    totalVisitors: 0,
    salesGrowthPercent: 0,
    incomeGrowth: "+0%", // Added for visual trend
    visitorGrowth: "+0%",
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const [statsLoading, setStatsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ordersError, setOrdersError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadDashboard = async () => {
      setError(false);
      setOrdersError(false);
      setStatsLoading(true);
      setOrdersLoading(true);
      try {
      } finally {
        // Individual requests manage their own loading flags.
      }

      // Stats should render as soon as available.
      try {
        const data = await fetchAdminDashboard();
        if (isMounted && data) {
          setStats({
            totalSales: data.totalSales ?? 0,
            totalIncome: data.totalIncome ?? 0,
            totalVisitors: data.totalVisitors ?? 0,
            salesGrowthPercent: data.salesGrowthPercent ? `+${data.salesGrowthPercent}%` : "+0%",
            incomeGrowth: "+12.5%",
            visitorGrowth: "-2.4%",
          });
        }
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setStatsLoading(false);
      }

      // Recent orders should not block stats rendering.
      try {
        const ordersPage = await getAdminOrders({ page: 0, size: 5 });
        if (isMounted) {
          setRecentOrders(ordersPage?.content ?? []);
        }
      } catch (err) {
        if (isMounted) setOrdersError(true);
      } finally {
        if (isMounted) setOrdersLoading(false);
      }
    };

    loadDashboard();
    return () => { isMounted = false; };
  }, []);

  // Professional Skeleton Loader
  if (statsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl3"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl3 p-8 text-center">
        <h2 className="text-lg font-bold text-red-800">Dashboard Unavailable</h2>
        <p className="text-sm text-red-600 mt-2">We're having trouble connecting to the backend. Please try again later.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* 1. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          title="Total Sales" 
          icon={ShoppingBag} 
          trend={stats.salesGrowthPercent}
          subtitle="Updated just now"
        >
          {stats.totalSales.toLocaleString()}
        </Card>

        <Card 
          title="Total Income" 
          icon={DollarSign} 
          trend={stats.incomeGrowth}
          subtitle="Net revenue"
        >
          ₹{stats.totalIncome.toLocaleString()}
        </Card>

        <Card 
          title="Total Visitors" 
          icon={Users} 
          trend={stats.visitorGrowth}
          subtitle="Unique sessions"
        >
          {stats.totalVisitors.toLocaleString()}
        </Card>
      </div>

      {/* 2. Future Section: Recent Orders Table */}
      {/* Recent Orders Section */}
<div className="bg-white rounded-xl3 border border-gray-100 shadow-card overflow-hidden mt-8">
  <div className="p-6 border-b border-gray-50 flex justify-between items-center">
    <h2 className="text-lg font-bold text-grocery-heading">Recent Orders</h2>
    <button
      onClick={() => navigate("/admin/orders")}
      className="text-sm font-semibold text-grocery-primary hover:underline"
    >
      View All
    </button>
  </div>
  
<div className="overflow-x-auto">
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className="bg-gray-50/50 text-grocery-body text-xs uppercase tracking-wider">
        <th className="px-6 py-4 font-bold">Order ID</th>
        <th className="px-6 py-4 font-bold">Customer</th>
        <th className="px-6 py-4 font-bold">Status</th>
        <th className="px-6 py-4 font-bold">Amount</th>
      </tr>
    </thead>
    {/* Clean, single tbody starts here */}
    <tbody className="divide-y divide-gray-50 text-sm">
      {ordersLoading ? (
        [...Array(5)].map((_, idx) => (
          <tr key={idx} className="animate-pulse">
            <td className="px-6 py-4">
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </td>
            <td className="px-6 py-4">
              <div className="h-5 w-24 bg-gray-200 rounded" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </td>
          </tr>
        ))
      ) : ordersError ? (
        <tr>
          <td className="px-6 py-6 text-grocery-body" colSpan={4}>
            Failed to load recent orders.
          </td>
        </tr>
      ) : recentOrders.length === 0 ? (
        <tr>
          <td className="px-6 py-6 text-grocery-body" colSpan={4}>
            No recent orders.
          </td>
        </tr>
      ) : (
        recentOrders.map((order) => (
          <tr
            key={order.orderId}
            className="hover:bg-gray-50/50 transition-colors cursor-pointer"
            onClick={() => navigate(`/admin/orders/${order.orderId}`)}
          >
            <td className="px-6 py-4 font-medium text-grocery-heading">#{order.orderId}</td>
            <td className="px-6 py-4 text-grocery-body">{order.userEmail || "—"}</td>
            <td className="px-6 py-4">
              <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
            </td>
            <td className="px-6 py-4 font-bold text-grocery-heading">{formatMoney(order.totalAmount)}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
</div>    </div>
  );
}