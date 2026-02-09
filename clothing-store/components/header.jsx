"use client";

import { ChevronLeft, Menu, ShoppingCart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  // Load cart count from localStorage
  useEffect(() => {
    const cartData = localStorage.getItem("cartItems");
    if (cartData) {
      const parsed = JSON.parse(cartData);
      const total =
        (parsed.instore?.length || 0) +
        (parsed.online?.length || 0);
      setCartCount(total);
    }
  }, []);

  // Go to cart page
  const handleCartClick = () => {
    router.push("/cart"); // 🔗 connected to cart.jsx
  };

  // Logout with confirmation
  const handleLogout = () => {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("authToken");
      router.push("/");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-18 px-6 py-4">
      <div className="flex items-center justify-between">
        
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          
          {/* USER INFO */}
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 bg-green-100">
              <AvatarFallback className="bg-green-100 text-green-600 text-sm font-semibold">
                MG
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium text-gray-900">
                Mandira Gautam
              </div>
              <div className="text-gray-500 text-xs">
                Welcome back!
              </div>
            </div>
          </div>

          {/* ACTION ICONS */}
          <div className="flex items-center gap-3">

            {/* CART */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCartClick}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-green-500 rounded-full flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>

            {/* LOGOUT */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-red-500" />
            </Button>

          </div>
        </div>
      </div>
    </header>
  );
}
