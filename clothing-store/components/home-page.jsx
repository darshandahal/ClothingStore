"use client";

import { useState } from "react";
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Tag,
  Shirt,
  Gift,
  BarChart3,
  Calendar,
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

/* ==== STATS DATA ==== */
const stats = [
  {
    title: "Total Sales",
    value: "Rs. 245K",
    change: "+12%",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    title: "Monthly Profit",
    value: "Rs. 58K",
    change: "+9%",
    changeType: "positive",
    icon: TrendingUp,
  },
  {
    title: "Orders",
    value: "1,203",
    change: "+5%",
    changeType: "positive",
    icon: ShoppingBag,
  },
  {
    title: "Active Discounts",
    value: "12",
    change: "-1%",
    changeType: "negative",
    icon: Tag,
  },
];

/* ==== BAR CHART DATA ==== */
const chartData = [
  { type: "Casual Wear", sales: 400 },
  { type: "Formal Wear", sales: 300 },
  { type: "Winter Wear", sales: 350 },
  { type: "Traditional", sales: 250 },
  { type: "Accessories", sales: 180 },
];

/* ==== LINE CHART DATA ==== */
const monthlySalesProfitLoss = [
  { month: "Jan", sales: 45000, profit: 12000, loss: 2000 },
  { month: "Feb", sales: 52000, profit: 15000, loss: 1500 },
  { month: "Mar", sales: 48000, profit: 13500, loss: 2500 },
  { month: "Apr", sales: 61000, profit: 18000, loss: 1000 },
  { month: "May", sales: 55000, profit: 16000, loss: 1800 },
  { month: "Jun", sales: 67000, profit: 20000, loss: 900 },
  { month: "Jul", sales: 59000, profit: 17500, loss: 1200 },
  { month: "Aug", sales: 72000, profit: 22000, loss: 800 },
  { month: "Sep", sales: 68000, profit: 19500, loss: 1100 },
  { month: "Oct", sales: 75000, profit: 23000, loss: 700 },
  { month: "Nov", sales: 82000, profit: 25000, loss: 600 },
  { month: "Dec", sales: 90000, profit: 28000, loss: 500 },
];

/* ==== EVENTS ==== */
const upcomingEvents = [
  {
    id: 1,
    title: "Winter Collection Launch",
    date: "Nov 25, 2025",
    time: "10:00 AM",
  },
  {
    id: 2,
    title: "Black Friday Sale",
    date: "Nov 29, 2025",
    time: "All Day",
  },
  {
    id: 3,
    title: "Christmas Sale Prep",
    date: "Dec 10, 2025",
    time: "9:00 AM",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-8 p-6">

        {/* ==== PAGE TITLE ==== */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-purple-800">
            Mandira Fancy Store
          </h1>
        </div>

        {/* ==== STATS ==== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="border border-blue-100 bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <stat.icon className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {stat.changeType === "positive" ? (
                  <TrendingUp className="w-3 h-3 text-blue-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span
                  className={`text-xs ${
                    stat.changeType === "positive"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change} from last month
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ==== MAIN CONTENT ==== */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-[65%_35%]">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* LINE CHART */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">
                Monthly Sales, Profit & Loss (Rs.)
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlySalesProfitLoss}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
                    <Line dataKey="profit" stroke="#10b981" strokeWidth={2} />
                    <Line dataKey="loss" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BAR CHART */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">
                Sales by Category
              </h2>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a href="/inventory">
                  <button className="h-20 w-full border border-blue-300 rounded-lg flex flex-col items-center justify-center hover:bg-blue-50">
                    <Shirt className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-blue-600">Add Product</span>
                  </button>
                </a>
                <button className="h-20 w-full border border-blue-300 rounded-lg flex flex-col items-center justify-center hover:bg-blue-50">
                  <Gift className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-blue-600">Add Offer</span>
                </button>
                <button className="h-20 w-full border border-blue-300 rounded-lg flex flex-col items-center justify-center hover:bg-blue-50">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-blue-600">View Sales</span>
                </button>
                <button className="h-20 w-full border border-blue-300 rounded-lg flex flex-col items-center justify-center hover:bg-blue-50">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-blue-600">Events</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-4">
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800">
                    {event.title}
                  </h4>
                  <p className="text-xs text-blue-600 mt-1">
                    {event.date} at {event.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
