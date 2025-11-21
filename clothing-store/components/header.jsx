"use client"

import { Bell, ChevronLeft, Menu, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Header() {
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)
  const [cartCount, setCartCount] = useState(0)

  // Navigate to notifications page
  const handleNotificationClick = () => {
    router.push("/app/notifications")
  }

  // Navigate to cart page
  const handleCartClick = () => {
    router.push("/app/cart")
  }

  // Navigate to profile page
  const handleProfileClick = () => {
    router.push("/app/profile")
  }

  return (
    <header className="bg-white border-b border-gray-200 h-18 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-6">
          {/* User Profile Section */}
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 bg-green-100">
              <AvatarFallback className="bg-green-100 text-green-600 text-sm font-semibold">
                BK
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium text-gray-900">Mandira Bhattrai</div>
              <div className="text-gray-500 text-xs">Welcome back!</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Profile Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleProfileClick}
              className="relative"
            >
              <User className="w-5 h-5 text-gray-600" />
            </Button>

            {/* Cart Button with Badge */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCartClick}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-green-500 rounded-full">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>

            {/* Notification Button with Badge */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNotificationClick}
              className="relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}