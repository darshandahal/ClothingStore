"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Calendar,
  Tag,
  Shirt,
  Gift,
  BarChart3,
} from "lucide-react";
import { Calendar as UiCalendar } from "@/components/ui/calendar";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const stats = [
  { title: "Total Sales", value: "$245K", change: "+12%", changeType: "positive", icon: DollarSign },
  { title: "Monthly Profit", value: "$58K", change: "+9%", changeType: "positive", icon: TrendingUp },
  { title: "Orders", value: "1,203", change: "+5%", changeType: "positive", icon: ShoppingBag },
  { title: "Active Discounts", value: "12", change: "-1%", changeType: "negative", icon: Tag },
];

const chartData = [
  { type: "Casual Wear", sales: 400 },
  { type: "Formal Wear", sales: 300 },
  { type: "Kids Wear", sales: 200 },
  { type: "Winter Wear", sales: 350 },
  { type: "Traditional", sales: 250 },
  { type: "Accessories", sales: 180 },
];

const upcomingEvents = [
  { id: 1, title: "Winter Collection Launch", date: "Nov 25, 2025", time: "10:00 AM" },
  { id: 2, title: "Black Friday Sale", date: "Nov 29, 2025", time: "All Day" },
  { id: 3, title: "Christmas Sale Prep", date: "Dec 10, 2025", time: "9:00 AM" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image 
          src="/dashboard.jpg" 
          alt="Dashboard Background" 
          fill 
          className="object-cover" 
          priority 
        />
        {/* Light overlay for better readability */}
        <div className="absolute inset-0 bg-white/70"></div>
      </div>

      <div className="space-y-8 p-6 relative z-10">
        {/* ==== PAGE HEADER ==== */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-purple-800">Mandira Fancy Store</h1>
          <Button variant="outline" size="sm" className="border-blue-500 text-blue-600 bg-white/80">
            <Calendar className="w-4 h-4 mr-2" />
            This Month
          </Button>
        </div>

        {/* ==== STATS ==== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-blue-100 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <stat.icon className="w-4 h-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp
                    className={`w-3 h-3 ${stat.changeType === "positive" ? "text-blue-500" : "text-red-500"}`}
                  />
                  <span
                    className={`text-xs ${
                      stat.changeType === "positive" ? "text-blue-600" : "text-red-600"
                    }`}
                  >
                    {stat.change} from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ==== DASHBOARD CONTENT ==== */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-[65%_35%]">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* BAR CHART */}
            <Card className="h-[420px] border-blue-100 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-blue-800">Sales by Category</CardTitle>
                <select defaultValue="Monthly" className="text-sm border rounded-md px-2 py-1 bg-white">
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Yearly</option>
                </select>
              </CardHeader>
              <CardContent className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* QUICK ACTIONS */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-white/80 w-full border-blue-300 hover:bg-blue-50">
                    <Shirt className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-blue-600">Add Product</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-white/80 w-full border-blue-300 hover:bg-blue-50">
                    <Gift className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-blue-600">Add Offer</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-white/80 w-full border-blue-300 hover:bg-blue-50">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-blue-600">View Sales</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2 bg-white/80 w-full border-blue-300 hover:bg-blue-50">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-blue-600">Events</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-800">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <UiCalendar mode="single" selected={undefined} className="w-full" />
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">{event.title}</h4>
                      <p className="text-xs text-blue-600 mt-1">
                        {event.date} at {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}