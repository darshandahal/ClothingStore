// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import {
//   LayoutDashboard,
//   ShoppingBag,
//   ShoppingCart,
//   Home,
//   Package,
//   Globe,
//   Settings,
// } from "lucide-react"

// const navigation = [
//   { name: "Home", href: "/home", icon: Home },
//   { name: "In-Store", href: "/instore", icon: ShoppingBag },
//   { name: "Online", href: "/online", icon: Globe },
//   { name: "Cart", href: "/cart", icon: ShoppingCart },
//   { name: "Billing", href: "/billing", icon: LayoutDashboard },
//   { name: "Inventory", href: "/inventory", icon: Package },
// ]

// export function Sidebar() {
//   const pathname = usePathname()

//   return (
//     <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
//       {/* Logo */}
//       <div className="p-6 h-18 border-b border-gray-200">
//         <div className="flex items-center gap-2">
//           <div className="text-lg font-semibold text-gray-900 tracking-tight">
//             Clothing<span style={{ color: "#2EB36D" }}>Store</span>
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-4">
//         <ul className="space-y-1">
//           {navigation.map((item) => {
//             const isActive = item.href === "/" ? pathname === "/" : (pathname === item.href || pathname.startsWith(`${item.href}/`))
//             return (
//               <li key={item.name}>
//                 <Link
//                   href={item.href}
//                   className={cn(
//                     "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
//                     isActive ? "bg-green-50 text-green-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
//                   )}
//                 >
//                   <item.icon className="w-5 h-5" />
//                   {item.name}
//                   {isActive && (
//                     <div className="absolute right-55 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-l" />
//                   )}
//                 </Link>
//               </li>
//             )
//           })}
//         </ul>
//       </nav>
//     </div>
//   )
// }