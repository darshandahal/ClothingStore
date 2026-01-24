"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Banknote, Printer, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import Footer from "@/components/Footer";

/* ================= CONSTANTS ================= */
const USD_TO_NPR = 141.61;
const VAT_PERCENTAGE = 13;

/* ================= COMPONENT ================= */
export default function Billing() {
  const { cartItems, calculateTotal } = useCart();

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cashAmount, setCashAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paidMethod, setPaidMethod] = useState("");

  // Generate a unique transaction UUID for eSewa
  const transactionUUID = uuidv4();

  /* ================= TOTALS ================= */
  const totalUSD =
    calculateTotal(cartItems.instore) +
    calculateTotal(cartItems.online);

  const totalNPR = totalUSD * USD_TO_NPR;
  const vat = totalNPR * (VAT_PERCENTAGE / 100);
  const grandTotal = totalNPR + vat;

  /* ================= SAVE INVOICE ================= */
  const saveInvoiceToSupabase = async (method) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("invoices").insert({
      user_id: user.id,
      payment_method: method,
      subtotal: totalNPR,
      vat,
      total: grandTotal,
      items: {
        instore: cartItems.instore,
        online: cartItems.online,
      },
    });
  };

  /* ================= CASH ================= */
  const handleCashPayment = async () => {
    const cash = parseFloat(cashAmount);
    if (!cash || cash < grandTotal) {
      alert(`Enter at least Rs. ${grandTotal.toFixed(2)}`);
      return;
    }
    await saveInvoiceToSupabase("Cash");
    setPaidMethod("Cash");
    setPaymentStatus("paid");
  };

  /* ================= ESEWA ================= */
  const handleEsewaPayment = async () => {
    // For testing: you may save the invoice here too, real verification comes after redirect
    await saveInvoiceToSupabase("eSewa");
    setPaidMethod("eSewa");
    setPaymentStatus("paid");
  };

  /* ================= PRINT ================= */
  const handlePrint = () => {
    const content = document.getElementById("invoice-print").innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`<html><body>${content}</body></html>`);
    win.document.close();
    win.print();
    win.close();
  };

  /* ================= PAID VIEW ================= */
  if (paymentStatus === "paid") {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto bg-white p-8 shadow-2xl rounded-2xl">

          <div className="text-center mb-6">
            <CheckCircle className="mx-auto text-green-600 w-16 h-16" />
            <h2 className="text-3xl font-bold mt-3">Payment Successful</h2>
            <p className="text-gray-500 mt-1">Paid via {paidMethod}</p>
          </div>

          <div id="invoice-print">
            <h3 className="text-2xl font-bold text-center mb-4">
              Mandira Fancy Store
            </h3>

            <table className="w-full border rounded overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {[...cartItems.instore, ...cartItems.online].map((i) => (
                  <tr key={i.id} className="border-t">
                    <td className="p-2">{i.title}</td>
                    <td className="p-2 text-center">{i.quantity}</td>
                    <td className="p-2 text-right">
                      Rs. {(i.price * i.quantity * USD_TO_NPR).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 text-right space-y-1">
              <p>Subtotal: Rs. {totalNPR.toFixed(2)}</p>
              <p>VAT (13%): Rs. {vat.toFixed(2)}</p>
              <p className="font-bold text-lg">
                Total: Rs. {grandTotal.toFixed(2)}
              </p>
            </div>

            <div className="text-center text-sm text-gray-500 mt-8 border-t pt-4">
              🙏 Thank you for visiting <strong>Mandira Fancy Store</strong>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="mt-6 w-full bg-purple-600 text-white py-3 rounded-xl font-semibold"
          >
            Print Invoice
          </button>
        </div>
      </div>
    );
  }

  /* ================= PAYMENT VIEW ================= */
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-2xl rounded-2xl">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Billing & Payment
        </h2>

        {!paymentMethod && (
          <div className="grid gap-4">
            {/* CASH */}
            <button
              onClick={() => setPaymentMethod("cash")}
              className="border p-5 rounded-xl flex items-center gap-4 hover:shadow-md transition"
            >
              <Banknote className="text-emerald-600" />
              <div>
                <p className="font-semibold">Cash Payment</p>
                <p className="text-sm text-gray-500">Accept cash from customer</p>
              </div>
            </button>

            {/* ESEWA */}
            <button
              onClick={() => setPaymentMethod("esewa")}
              className="border p-5 rounded-xl flex items-center gap-4 hover:shadow-md transition"
            >
              <Image
                src="/esewa-live.png"
                alt="eSewa Logo"
                width={100}
                height={100}
              />
              <div>
                <p className="font-semibold">Pay with eSewa</p>
                <p className="text-sm text-gray-500">Scan QR to pay</p>
              </div>
            </button>
          </div>
        )}

        {/* ================= CASH ================= */}
        {paymentMethod === "cash" && (
          <div className="mt-6 space-y-4">
            <input
              type="number"
              placeholder="Enter cash amount"
              className="border p-3 w-full rounded-lg"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
            />
            <button
              onClick={handleCashPayment}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold"
            >
              Complete Cash Payment
            </button>
          </div>
        )}

        {/* ================= ESEWA ================= */}
        {paymentMethod === "esewa" && (
          <div className="mt-8 flex flex-col items-center text-center">

            <Image
              src="/esewa-live.png"
              alt="eSewa Logo"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />

            <h3 className="text-xl font-semibold mb-1">
              Pay with eSewa
            </h3>

            <p className="text-gray-500 mb-4">
              You will be redirected to eSewa to complete the payment
            </p>

            <form
              action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
              method="POST"
              className="w-full max-w-sm space-y-3"
            >
              <input type="hidden" name="amount" value={totalNPR.toFixed(2)} />
              <input type="hidden" name="tax_amount" value={vat.toFixed(2)} />
              <input type="hidden" name="total_amount" value={grandTotal.toFixed(2)} />

              <input type="hidden" name="product_code" value="EPAYTEST" />
          

              {/* For testing, signature can be skipped. Production: generate server-side */}
              {/* <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
              <input type="hidden" name="signature" value={signature} /> */}

              <input type="hidden" name="success_url" value="http://localhost:3000/esewa-success" />
              <input type="hidden" name="failure_url" value="http://localhost:3000/esewa-failure" />

              <button
                type="submit"
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
              >
                Pay via eSewa
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}
