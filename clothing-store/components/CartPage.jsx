"use client";

import { Minus, Plus, Trash2, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    calculateTotal,
    clearCart,
  } = useCart();

  const instoreItems = cartItems.instore || [];
  const total = calculateTotal(instoreItems);

  if (instoreItems.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-600 text-lg">
          🛒 Your in-store cart is empty
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* CART ITEMS */}
      {instoreItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b pb-4"
        >
          {/* Product Info */}
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-20 object-contain border rounded"
            />
            <div>
              <h3 className="font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">
                Rs. {item.price}
              </p>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                updateQuantity(item.id, "instore", item.quantity - 1)
              }
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              <Minus size={16} />
            </button>

            <span className="font-semibold">{item.quantity}</span>

            <button
              onClick={() =>
                updateQuantity(item.id, "instore", item.quantity + 1)
              }
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Price + Remove */}
          <div className="flex items-center gap-4">
            <p className="font-semibold text-gray-800">
              Rs. {(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeFromCart(item.id, "instore")}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      {/* SUMMARY */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t">
        <h2 className="text-xl font-bold text-gray-800">
          Total: Rs. {total.toFixed(2)}
        </h2>

        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Clear Cart
          </button>

          <button
            onClick={() => router.push("/billing")}
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <CreditCard size={18} />
            Proceed to Billing
          </button>
        </div>
      </div>
    </div>
  );
}
