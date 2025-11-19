"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}