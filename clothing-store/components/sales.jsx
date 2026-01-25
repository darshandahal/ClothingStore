"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  ShoppingBag,
  ArrowLeft,
  Package,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Sales() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todaySales, setTodaySales] = useState(0);
  const [monthSales, setMonthSales] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [monthOrders, setMonthOrders] = useState(0);

  // Fetch sales data from Supabase
  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);

      // Fetch all sales records
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSalesData(data || []);
      calculateSalesMetrics(data || []);
    } catch (error) {
      console.error("Error fetching sales:", error);
      alert("Error loading sales data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateSalesMetrics = (data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let todayTotal = 0;
    let todayCount = 0;
    let monthTotal = 0;
    let monthCount = 0;

    data.forEach((sale) => {
      const saleDate = new Date(sale.created_at);
      const saleAmount = parseFloat(sale.total_amount) || 0;

      // Check if sale is from today
      const saleDateOnly = new Date(saleDate);
      saleDateOnly.setHours(0, 0, 0, 0);

      if (saleDateOnly.getTime() === today.getTime()) {
        todayTotal += saleAmount;
        todayCount++;
      }

      // Check if sale is from current month
      if (
        saleDate.getMonth() === currentMonth &&
        saleDate.getFullYear() === currentYear
      ) {
        monthTotal += saleAmount;
        monthCount++;
      }
    });

    setTodaySales(todayTotal);
    setTodayOrders(todayCount);
    setMonthSales(monthTotal);
    setMonthOrders(monthCount);
  };

  // Get daily sales for chart (last 7 days)
  const getDailySalesChart = () => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayData = {
        day: dayName,
        sales: 0,
        orders: 0,
      };

      salesData.forEach((sale) => {
        const saleDate = new Date(sale.created_at);
        saleDate.setHours(0, 0, 0, 0);

        if (saleDate.getTime() === date.getTime()) {
          dayData.sales += parseFloat(sale.total_amount) || 0;
          dayData.orders += 1;
        }
      });

      last7Days.push(dayData);
    }

    return last7Days;
  };

  // Get monthly sales (current year)
  const getMonthlySalesChart = () => {
    const currentYear = new Date().getFullYear();
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    return monthNames.map((month, index) => {
      const monthData = {
        month,
        sales: 0,
        orders: 0,
      };

      salesData.forEach((sale) => {
        const saleDate = new Date(sale.created_at);
        if (
          saleDate.getMonth() === index &&
          saleDate.getFullYear() === currentYear
        ) {
          monthData.sales += parseFloat(sale.total_amount) || 0;
          monthData.orders += 1;
        }
      });

      return monthData;
    });
  };

  const dailyChartData = getDailySalesChart();
  const monthlyChartData = getMonthlySalesChart();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <a href="/">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </a>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Sales Analytics
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Track your daily and monthly sales performance
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-600 border-r-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sales data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Today's Sales */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium opacity-90">Today's Sales</p>
                  <DollarSign className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-3xl font-bold">Rs. {todaySales.toLocaleString()}</p>
                <p className="text-xs opacity-80 mt-1">{new Date().toLocaleDateString()}</p>
              </div>

              {/* Today's Orders */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium opacity-90">Today's Orders</p>
                  <ShoppingBag className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-3xl font-bold">{todayOrders}</p>
                <p className="text-xs opacity-80 mt-1">Total orders today</p>
              </div>

              {/* This Month's Sales */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium opacity-90">This Month's Sales</p>
                  <Calendar className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-3xl font-bold">Rs. {monthSales.toLocaleString()}</p>
                <p className="text-xs opacity-80 mt-1">
                  {new Date().toLocaleDateString("en-US", { month: "long" })}
                </p>
              </div>

              {/* This Month's Orders */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium opacity-90">This Month's Orders</p>
                  <Package className="w-5 h-5 opacity-80" />
                </div>
                <p className="text-3xl font-bold">{monthOrders}</p>
                <p className="text-xs opacity-80 mt-1">Total orders this month</p>
              </div>
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Sales Chart */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Last 7 Days Sales (Rs.)
                </h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
                      <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Sales Chart */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Monthly Sales Trend (Rs.)
                </h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
                      <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* RECENT SALES TABLE */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Sales</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {salesData.slice(0, 10).map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(sale.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                          #{sale.id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {sale.customer_name || "Guest"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {sale.total_items || 0} items
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-semibold text-right">
                          Rs. {parseFloat(sale.total_amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            sale.source === "online" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }`}>
                            {sale.source === "online" ? "Online" : "In-Store"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {salesData.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No sales data available yet.</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Sales will appear here once customers make purchases.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}