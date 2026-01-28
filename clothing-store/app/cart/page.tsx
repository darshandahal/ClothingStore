"use client";

import CartPage from "@/components/CartPage";

export default function Cart() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">In-Store Cart</h1>
      <CartPage />
    </div>
  );
}
