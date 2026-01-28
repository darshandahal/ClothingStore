"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Banknote, CheckCircle, ArrowLeft } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Script from "next/script";

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
  const [paidMethod, setPaidMethod] = useState("");
  const [cryptoLoaded, setCryptoLoaded] = useState(false);
  const [savedCartItems, setSavedCartItems] = useState({ instore: [], online: [] });

  // Calculate totals
  const instoreTotal = calculateTotal(cartItems.instore);
  const onlineTotal = calculateTotal(cartItems.online);
  const subtotal = instoreTotal + onlineTotal;
  const vat = subtotal * 0.13;
  const grandTotal = subtotal + vat;

  // Check for eSewa success/failure on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const esewaStatus = urlParams.get("status");
    const transactionUuid = urlParams.get("transaction_uuid");
    
    if (esewaStatus === "success" && transactionUuid) {
      // Load saved cart data from sessionStorage
      const savedCart = sessionStorage.getItem("pendingEsewaCart");
      const savedCustomer = sessionStorage.getItem("pendingEsewaCustomer");
      
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        setSavedCartItems(cartData);
        
        if (savedCustomer) {
          const customerData = JSON.parse(savedCustomer);
          setCustomerName(customerData.name || "");
          setCustomerPhone(customerData.phone || "");
        }
        
        handleEsewaSuccess(cartData);
        
        // Clean up
        sessionStorage.removeItem("pendingEsewaCart");
        sessionStorage.removeItem("pendingEsewaCustomer");
      }
    } else if (esewaStatus === "failure") {
      alert("eSewa payment was cancelled or failed. Please try again.");
      // Clean up
      sessionStorage.removeItem("pendingEsewaCart");
      sessionStorage.removeItem("pendingEsewaCustomer");
      window.history.replaceState({}, "", "/billing");
    }
  }, []);

  // Record sale to database
  const recordSale = async (method, items) => {
    try {
      const allItems = items ? [...items.instore, ...items.online] : [...cartItems.instore, ...cartItems.online];
      
      let source = 'mixed';
      if (items) {
        if (items.instore.length > 0 && items.online.length === 0) {
          source = 'instore';
        } else if (items.online.length > 0 && items.instore.length === 0) {
          source = 'online';
        }
      } else {
        if (cartItems.instore.length > 0 && cartItems.online.length === 0) {
          source = 'instore';
        } else if (cartItems.online.length > 0 && cartItems.instore.length === 0) {
          source = 'online';
        }
      }

      // Prepare sale data
      const saleData = {
        customer_name: customerName || "Guest",
        total_amount: grandTotal,
        total_items: allItems.reduce((sum, item) => sum + item.quantity, 0),
        source: source,
        payment_method: method,
        items: allItems,
      };

      if (customerPhone) {
        saleData.customer_phone = customerPhone;
      }

      const { error } = await supabase.from("sales").insert(saleData);
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

    // Save cart items before clearing
    setSavedCartItems({
      instore: [...cartItems.instore],
      online: [...cartItems.online]
    });

    const saleRecorded = await recordSale("Cash", null);
    if (saleRecorded) {
      setPaidMethod("Cash");
      setPaymentStatus("paid");
      clearCart();
    }
  };

  // Handle eSewa success
  const handleEsewaSuccess = async (cartData) => {
    const saleRecorded = await recordSale("eSewa", cartData);
    if (saleRecorded) {
      setPaidMethod("eSewa");
      setPaymentStatus("paid");
      
      // Clear the actual cart
      clearCart();
      
      // Clean URL
      window.history.replaceState({}, "", "/billing");
    }
  };

  // Handle eSewa payment
  const handleEsewaPayment = () => {
    if (!window.CryptoJS) {
      alert("Payment system is loading. Please try again in a moment.");
      return;
    }

    // Save cart and customer data to sessionStorage before redirect
    const cartToSave = {
      instore: [...cartItems.instore],
      online: [...cartItems.online]
    };
    sessionStorage.setItem("pendingEsewaCart", JSON.stringify(cartToSave));
    
    if (customerName || customerPhone) {
      sessionStorage.setItem("pendingEsewaCustomer", JSON.stringify({
        name: customerName,
        phone: customerPhone
      }));
    }

    const amount = subtotal.toFixed(2);
    const tax_amount = vat.toFixed(2);
    const total_amount = grandTotal.toFixed(2);
    const transaction_uuid = "TXN-" + Date.now();
    const product_code = "EPAYTEST";

    // Create message string for signature
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const secret = "8gBm/:&EnhH.1/q";

    // Generate HMAC SHA256 signature
    const hash = window.CryptoJS.HmacSHA256(message, secret);
    const signature = window.CryptoJS.enc.Base64.stringify(hash);

    console.log("=== eSewa Payment Debug ===");
    console.log("Total Amount:", total_amount);
    console.log("Transaction UUID:", transaction_uuid);
    console.log("Signature:", signature);
    console.log("==========================");

    // Create form
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    const fields = {
      amount: amount,
      tax_amount: tax_amount,
      total_amount: total_amount,
      transaction_uuid: transaction_uuid,
      product_code: product_code,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${window.location.origin}/billing?status=success&transaction_uuid=${transaction_uuid}`,
      failure_url: `${window.location.origin}/billing?status=failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: signature,
    };

    Object.keys(fields).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
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
    
    // Check if popup was blocked
    if (!win || win.closed || typeof win.closed === 'undefined') {
      // Fallback: print current page
      alert("Pop-up blocked! Please allow pop-ups for this site. Printing current page...");
      window.print();
      return;
    }
    
    win.document.write(`
      <html>
        <head>
          <title>Invoice - Mandira Fancy Store</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            h3 { text-align: center; margin-bottom: 5px; }
            .text-center { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .text-right { text-align: right; }
            .total-section { margin-top: 20px; }
            .total-section p { margin: 5px 0; text-align: right; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #333; color: #666; font-size: 14px; }
            .customer-info { margin-bottom: 15px; font-size: 14px; }
            .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
            @media print { body { padding: 10px; } }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${content}
        </body>
      </html>
    `);
    win.document.close();
  };

  // Success view after payment
  if (paymentStatus === "paid") {
    const change = paidMethod === "Cash" ? calculateChange() : 0;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"
          strategy="afterInteractive"
        />
        
        <div className="max-w-3xl mx-auto bg-white p-8 shadow-2xl rounded-2xl">
          <div className="text-center mb-6">
            <CheckCircle className="mx-auto text-green-600 w-16 h-16" />
            <h2 className="text-3xl font-bold mt-3 text-gray-900">Payment Successful!</h2>
            <p className="text-gray-500 mt-1">Paid via {paidMethod}</p>
          </div>

          <div id="invoice-print">
            <h3 className="text-2xl font-bold text-center mb-2">Mandira Fancy Store</h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              Invoice Date: {new Date().toLocaleString()}
            </p>

            {customerName && (
              <div className="customer-info mb-4 border-b pb-3">
                <p className="text-sm"><strong>Customer:</strong> {customerName}</p>
                {customerPhone && <p className="text-sm"><strong>Phone:</strong> {customerPhone}</p>}
                <p className="text-sm"><strong>Payment Method:</strong> {paidMethod}</p>
              </div>
            )}

            <table className="w-full border rounded overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Item</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {[...savedCartItems.instore, ...savedCartItems.online].map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{item.title}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">Rs. {item.price.toFixed(2)}</td>
                    <td className="p-3 text-right">Rs. {(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="total-section mt-6">
              <p className="text-gray-700">Subtotal: <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span></p>
              <p className="text-gray-700">VAT (13%): <span className="font-semibold">Rs. {vat.toFixed(2)}</span></p>
              <p className="grand-total text-xl text-gray-900">
                Grand Total: Rs. {grandTotal.toFixed(2)}
              </p>
              {paidMethod === "Cash" && (
                <>
                  <p className="text-gray-700 mt-4">Cash Paid: <span className="font-semibold">Rs. {parseFloat(cashAmount).toFixed(2)}</span></p>
                  {change > 0 && (
                    <p className="text-green-600 font-bold">Change: Rs. {change.toFixed(2)}</p>
                  )}
                </>
              )}
            </div>

            <div className="footer text-sm text-gray-500">
              Thank you for shopping at <strong>Mandira Fancy Store</strong>! 🙏<br/>
              Please visit again!
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handlePrint}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
            >
              🖨️ Print Invoice
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
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"
        strategy="afterInteractive"
        onLoad={() => setCryptoLoaded(true)}
      />

      <div className="max-w-3xl mx-auto">
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

                <button
                  onClick={() => setPaymentMethod("esewa")}
                  className="border-2 border-gray-200 p-5 rounded-xl flex items-center gap-4 hover:border-green-500 hover:bg-green-50 transition"
                >
                 
                  <div className="text-left">
                    <p className="font-semibold text-lg">Pay with eSewa</p>
                    <p className="text-sm text-gray-500">Secure online payment</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {paymentMethod === "cash" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Cash Payment Details</h2>

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

              {cashAmount && parseFloat(cashAmount) >= grandTotal && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-green-800 font-semibold">
                    Change to Return: Rs. {calculateChange().toFixed(2)}
                  </p>
                </div>
              )}

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

          {paymentMethod === "esewa" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">eSewa Payment</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">You will be redirected to eSewa to complete the payment</p>
                <p className="text-lg font-bold text-green-800">Amount: Rs. {grandTotal.toFixed(2)}</p>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setPaymentMethod(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition"
                >
                  Back
                </button>
                <button
                  onClick={handleEsewaPayment}
                  disabled={!cryptoLoaded}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition disabled:bg-gray-400"
                >
                  {cryptoLoaded ? "Pay with eSewa" : "Loading..."}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

