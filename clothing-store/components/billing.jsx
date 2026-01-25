"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Banknote, CheckCircle, ArrowLeft } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Billing() {
  const router = useRouter();
  const { cartItems, calculateTotal, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cashAmount, setCashAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Calculate totals
  const instoreTotal = calculateTotal(cartItems.instore);
  const onlineTotal = calculateTotal(cartItems.online);
  const subtotal = instoreTotal + onlineTotal;
  const vat = subtotal * 0.13; // 13% VAT
  const grandTotal = subtotal + vat;

  // Record sale to database
  const recordSale = async () => {
    try {
      const allItems = [...cartItems.instore, ...cartItems.online];
      
      // Determine source (if both, mark as 'mixed', otherwise use the one with items)
      let source = 'mixed';
      if (cartItems.instore.length > 0 && cartItems.online.length === 0) {
        source = 'instore';
      } else if (cartItems.online.length > 0 && cartItems.instore.length === 0) {
        source = 'online';
      }

      const { error } = await supabase.from("sales").insert({
        customer_name: customerName || "Guest",
        customer_phone: customerPhone || null,
        total_amount: grandTotal,
        total_items: allItems.reduce((sum, item) => sum + item.quantity, 0),
        source: source,
        payment_method: "Cash",
        items: allItems, // Store cart items as JSON
      });

      if (error) throw error;
      
      console.log("Sale recorded successfully!");
      return true;
    } catch (error) {
      console.error("Error recording sale:", error);
      alert("Error recording sale: " + error.message);
      return false;
    }
  };

  // Handle cash payment
  const handleCashPayment = async () => {
    const cash = parseFloat(cashAmount);
    
    if (!cash || cash < grandTotal) {
      alert(`Please enter at least Rs. ${grandTotal.toFixed(2)}`);
      return;
    }

    // Record the sale
    const saleRecorded = await recordSale();
    
    if (saleRecorded) {
      setPaymentStatus("paid");
      // Clear the cart after successful payment
      setTimeout(() => {
        clearCart();
      }, 1000);
    }
  };

  // Calculate change
  const calculateChange = () => {
    const cash = parseFloat(cashAmount);
    if (cash && cash >= grandTotal) {
      return cash - grandTotal;
    }
    return 0;
  };

  // Print invoice
  const handlePrint = () => {
    const content = document.getElementById("invoice-print").innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Invoice - Mandira Fancy Store</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f3f4f6; }
            .text-right { text-align: right; }
            .text-center { text-center; }
            .font-bold { font-weight: bold; }
            .total-section { margin-top: 20px; text-align: right; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
    win.close();
  };

  // Success view after payment
  if (paymentStatus === "paid") {
    const change = calculateChange();
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white p-8 shadow-2xl rounded-2xl">
          <div className="text-center mb-6">
            <CheckCircle className="mx-auto text-green-600 w-16 h-16" />
            <h2 className="text-3xl font-bold mt-3 text-gray-900">Payment Successful!</h2>
            <p className="text-gray-500 mt-1">Paid via Cash</p>
          </div>

          <div id="invoice-print">
            <h3 className="text-2xl font-bold text-center mb-2">Mandira Fancy Store</h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              Date: {new Date().toLocaleString()}
            </p>

            {customerName && (
              <div className="mb-4">
                <p className="text-sm"><strong>Customer:</strong> {customerName}</p>
                {customerPhone && <p className="text-sm"><strong>Phone:</strong> {customerPhone}</p>}
              </div>
            )}

            <table className="w-full border rounded overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {[...cartItems.instore, ...cartItems.online].map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{item.title}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">Rs. {item.price.toFixed(2)}</td>
                    <td className="p-2 text-right">Rs. {(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="total-section mt-6 space-y-2">
              <p className="text-gray-700">Subtotal: <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span></p>
              <p className="text-gray-700">VAT (13%): <span className="font-semibold">Rs. {vat.toFixed(2)}</span></p>
              <p className="text-xl font-bold text-gray-900 border-t pt-2">
                Grand Total: Rs. {grandTotal.toFixed(2)}
              </p>
              <p className="text-gray-700 mt-4">Cash Paid: <span className="font-semibold">Rs. {parseFloat(cashAmount).toFixed(2)}</span></p>
              {change > 0 && (
                <p className="text-green-600 font-bold">Change: Rs. {change.toFixed(2)}</p>
              )}
            </div>

            <div className="footer text-sm text-gray-500">
              Thank you for shopping at <strong>Mandira Fancy Store</strong>! 🙏
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handlePrint}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Print Invoice
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main billing view
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => router.push("/cart")}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Payment</h1>
        </div>

        <div className="bg-white p-8 shadow-2xl rounded-2xl">
          {/* Order Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (13%):</span>
                <span>Rs. {vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                <span>Grand Total:</span>
                <span>Rs. {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          {!paymentMethod && (
            <div>
              <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
              <div className="grid gap-4">
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className="border-2 border-gray-200 p-5 rounded-xl flex items-center gap-4 hover:border-emerald-500 hover:bg-emerald-50 transition"
                >
                  <Banknote className="text-emerald-600 w-8 h-8" />
                  <div className="text-left">
                    <p className="font-semibold text-lg">Cash Payment</p>
                    <p className="text-sm text-gray-500">Accept cash from customer</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Cash Payment Form */}
          {paymentMethod === "cash" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Cash Payment Details</h2>
              
              {/* Customer Info (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              {/* Cash Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cash Amount Received *
                </label>
                <input
                  type="number"
                  placeholder={`Enter amount (Min: Rs. ${grandTotal.toFixed(2)})`}
                  className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  min={grandTotal}
                  step="0.01"
                />
              </div>

              {/* Change Display */}
              {cashAmount && parseFloat(cashAmount) >= grandTotal && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-green-800 font-semibold">
                    Change to Return: Rs. {calculateChange().toFixed(2)}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setPaymentMethod(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition"
                >
                  Back
                </button>
                <button
                  onClick={handleCashPayment}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition"
                >
                  Complete Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}