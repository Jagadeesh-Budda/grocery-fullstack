import React, { useEffect, useState } from "react";
import { fetchAdminDashboard } from "../services/adminapi";
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import Card from "../common/Card"; 
import Badge from "../common/Badge";// Ensure this path to your new Card is correct

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalIncome: 0,
    totalVisitors: 0,
    salesGrowthPercent: 0,
    incomeGrowth: "+0%", // Added for visual trend
    visitorGrowth: "+0%",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboard()
      .then((data) => {
        setStats({
          totalSales: data.totalSales ?? 0,
          totalIncome: data.totalIncome ?? 0,
          totalVisitors: data.totalVisitors ?? 0,
          salesGrowthPercent: data.salesGrowthPercent ? `+${data.salesGrowthPercent}%` : "+0%",
          incomeGrowth: "+12.5%", // These could come from your API later
          visitorGrowth: "-2.4%",
        });
      })
      .catch((err) => console.error("Dashboard load failed", err))
      .finally(() => setLoading(false));
  }, []);

  // Professional Skeleton Loader
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl3"></div>
        ))}
      </div>
    );
  }
const orders = [
  { id: "#ORD-7721", customer: "Rahul Sharma", status: "success", statusText: "Paid", amount: "₹1,240" },
  { id: "#ORD-7722", customer: "Anjali Gupta", status: "warning", statusText: "Pending", amount: "₹850" },
  { id: "#ORD-7723", customer: "Vivek Kumar", status: "danger", statusText: "Cancelled", amount: "₹420" },
  { id: "#ORD-7724", customer: "Priya Singh", status: "success", statusText: "Paid", amount: "₹2,100" },
];
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
    <button className="text-sm font-semibold text-grocery-primary hover:underline">View All</button>
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
      {orders.map((order) => (
        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
          <td className="px-6 py-4 font-medium text-grocery-heading">{order.id}</td>
          <td className="px-6 py-4 text-grocery-body">{order.customer}</td>
          <td className="px-6 py-4">
            <Badge variant={order.status}>{order.statusText}</Badge>
          </td>
          <td className="px-6 py-4 font-bold text-grocery-heading">{order.amount}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>    </div>
  );
}