"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Shirt,
  BarChart3,
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
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function HomePage() {
  const router = useRouter();
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [monthlySalesChart, setMonthlySalesChart] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSalesData(data || []);
      calculateMetrics(data || []);
      calculateMonthlySales(data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (data) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let total = 0;
    let monthlyTotal = 0;
    let monthlyCount = 0;

    data.forEach((sale) => {
      const saleAmount = parseFloat(sale.total_amount) || 0;
      total += saleAmount;

      const saleDate = new Date(sale.created_at);
      if (
        saleDate.getMonth() === currentMonth &&
        saleDate.getFullYear() === currentYear
      ) {
        monthlyTotal += saleAmount;
        monthlyCount++;
      }
    });

    setTotalSales(total);
    setMonthlyProfit(monthlyTotal);
    setTotalOrders(monthlyCount);
  };

  const calculateMonthlySales = (data) => {
    const currentYear = new Date().getFullYear();
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const monthlySales = monthNames.map((month, index) => {
      let sales = 0;
      let profit = 0;
      let loss = 0;

      data.forEach((sale) => {
        const saleDate = new Date(sale.created_at);
        if (
          saleDate.getMonth() === index &&
          saleDate.getFullYear() === currentYear
        ) {
          const amount = parseFloat(sale.total_amount) || 0;
          sales += amount;
          profit += amount * 0.3; // 30% profit estimate
          loss += amount * 0.05; // 5% loss estimate
        }
      });

      return { month, sales, profit, loss };
    });

    setMonthlySalesChart(monthlySales);
  };

  const stats = [
    {
      title: "Total Sales",
      value: loading ? "Loading..." : `Rs. ${totalSales.toLocaleString()}`,
      change: "+12%",
      changeType: "positive",
      icon: TrendingUp,
      clickable: true,
      path: "/sales",
    },
    {
      title: "Monthly Sales",
      value: loading ? "Loading..." : `Rs. ${monthlyProfit.toLocaleString()}`,
      change: "+9%",
      changeType: "positive",
      icon: TrendingUp,
      clickable: false,
    },
    {
      title: "Monthly Orders",
      value: loading ? "Loading..." : totalOrders.toString(),
      change: "+5%",
      changeType: "positive",
      icon: ShoppingBag,
      clickable: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-8 p-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-purple-800">
            Mandira Fancy Store
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.title}
              onClick={() => stat.clickable && router.push(stat.path)}
              className={`border border-blue-100 bg-white rounded-lg shadow-lg p-6 ${
                stat.clickable ? "cursor-pointer hover:shadow-xl hover:border-blue-300 transition-all" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <stat.icon className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.changeType === "positive" ? (
                  <TrendingUp className="w-3 h-3 text-blue-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-xs ${stat.changeType === "positive" ? "text-blue-600" : "text-red-600"}`}>
                  {stat.change} from last month
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 grid-cols-1">
          <div className="space-y-6">
            {/* LINE CHART */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">
                Monthly Sales, Profit & Loss (Rs.)
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={loading ? [] : monthlySalesChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
                    <Legend />
                    <Line dataKey="sales" stroke="#3b82f6" strokeWidth={2} name="Sales" />
                    <Line dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit" />
                    <Line dataKey="loss" stroke="#ef4444" strokeWidth={2} name="Loss" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BAR CHART */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">
                Monthly Sales Overview (Rs.)
              </h2>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={loading ? [] : monthlySalesChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sales" />
                    <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <a href="/inventory">
                  <button className="h-20 w-full border border-blue-300 rounded-lg flex flex-col items-center justify-center hover:bg-blue-50 transition">
                    <Shirt className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-blue-600">Manage Inventory</span>
                  </button>
                </a>
                <a href="/sales">
                  <button className="h-20 w-full border border-blue-300 rounded-lg flex flex-col items-center justify-center hover:bg-blue-50 transition">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-blue-600">View Sales</span>
                  </button>
                </a>
                <a href="/instore">
                  <button className="h-20 w-full border border-blue-300 rounded-lg flex flex-col items-center justify-center hover:bg-blue-50 transition">
                    <ShoppingBag className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-blue-600">In-Store</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}