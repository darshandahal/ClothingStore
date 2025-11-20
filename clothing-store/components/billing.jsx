'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, CreditCard, Banknote, Wallet } from 'lucide-react';

const USD_TO_NPR = 141.61;
const VAT_PERCENTAGE = 13;

export default function Billing() {
  const { cartItems, calculateTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });
  const [cashForm, setCashForm] = useState({
    cashAmount: ''
  });
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);

  const inStoreTotal = calculateTotal(cartItems.instore);
  const onlineTotal = calculateTotal(cartItems.online);
  const totalUSD = inStoreTotal + onlineTotal;
  const totalNPR = totalUSD * USD_TO_NPR;
  const vat = totalNPR * (VAT_PERCENTAGE / 100);
  const grandTotalNPR = totalNPR + vat;

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCashChange = (e) => {
    setCashForm({
      cashAmount: e.target.value
    });
  };

  const handleCardPayment = () => {
    if (!cardForm.cardNumber || !cardForm.cardholderName || !cardForm.expiryDate || !cardForm.cvv) {
      alert('Please fill all card details');
      return;
    }
    console.log('Card Payment Processed:', cardForm);
    setPaymentStatus('paid');
  };

  const handleCashPayment = () => {
    const cash = parseFloat(cashForm.cashAmount);
    if (!cash || cash < grandTotalNPR) {
      alert(`Please enter amount greater than or equal to Rs. ${grandTotalNPR.toFixed(2)}`);
      return;
    }
    const change = cash - grandTotalNPR;
    console.log('Cash Payment Processed. Change:', change);
    setPaymentStatus('paid');
  };

  const handleOnlinePayment = () => {
    console.log('Online Payment initiated with Nepal Bank Limited');
    setPaymentStatus('paid');
  };

  const resetPayment = () => {
    setPaymentMethod(null);
    setPaymentStatus(null);
    setCardForm({ cardNumber: '', cardholderName: '', expiryDate: '', cvv: '' });
    setCashForm({ cashAmount: '' });
    setShowBankDetails(false);
  };

  const totalItems = cartItems.instore.length + cartItems.online.length;

  if (paymentStatus === 'paid') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Your payment of Rs. {grandTotalNPR.toFixed(2)} has been processed.</p>
          <p className="text-sm text-gray-500 mb-8">Thank you for shopping at Babita Store!</p>
          <button
            onClick={resetPayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        </div>
      </div>

      {/* Billing Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary - Left */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>

              {/* In-Store Items */}
              {cartItems.instore.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">In-Store Products</h3>
                  <div className="space-y-3 border-b pb-4">
                    {cartItems.instore.map(item => (
                      <div key={item.id} className="flex justify-between text-gray-600">
                        <span>{item.title} x {item.quantity}</span>
                        <span>
                          ${(
                            (item.onSale
                              ? item.price * (1 - (item.discount || 0) / 100)
                              : item.price) * item.quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Online Items */}
              {cartItems.online.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Online Products</h3>
                  <div className="space-y-3 border-b pb-4">
                    {cartItems.online.map(item => (
                      <div key={item.id} className="flex justify-between text-gray-600">
                        <span>{item.title} x {item.quantity}</span>
                        <span>
                          ${(
                            (item.onSale
                              ? item.price * (1 - (item.discount || 0) / 100)
                              : item.price) * item.quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Calculation Details - Right */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Amount Details</h3>

              {/* Currency Conversion */}
              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal (USD):</span>
                  <span className="font-semibold">${totalUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Exchange Rate:</span>
                  <span>1 USD = Rs. {USD_TO_NPR}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Subtotal (NPR):</span>
                  <span>Rs. {totalNPR.toFixed(2)}</span>
                </div>
              </div>

              {/* VAT */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>VAT ({VAT_PERCENTAGE}%):</span>
                  <span className="font-semibold">Rs. {vat.toFixed(2)}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between text-2xl font-bold text-gray-900 mb-8">
                <span>Grand Total:</span>
                <span className="text-blue-600">Rs. {grandTotalNPR.toFixed(2)}</span>
              </div>

              <p className="text-sm text-gray-500 text-center mb-4">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in order
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        {!paymentMethod ? (
          <div className="bg-white rounded-lg shadow-md p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setPaymentMethod('card')}
                className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition flex items-center gap-3"
              >
                <CreditCard size={32} className="text-blue-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Debit/Credit Card</p>
                  <p className="text-sm text-gray-500">Visa, Mastercard</p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('cash')}
                className="p-6 border-2 border-gray-300 rounded-lg hover:border-green-600 hover:bg-green-50 transition flex items-center gap-3"
              >
                <Banknote size={32} className="text-green-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Cash Payment</p>
                  <p className="text-sm text-gray-500">Pay at counter</p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('online')}
                className="p-6 border-2 border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition flex items-center gap-3"
              >
                <Wallet size={32} className="text-purple-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Online Transfer</p>
                  <p className="text-sm text-gray-500">Bank transfer</p>
                </div>
              </button>
            </div>
          </div>
        ) : null}

        {/* Card Payment Form */}
        {paymentMethod === 'card' && (
          <div className="bg-white rounded-lg shadow-md p-8 mt-8 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Card Payment</h2>
              <button
                onClick={() => setPaymentMethod(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardForm.cardNumber}
                  onChange={handleCardChange}
                  maxLength="16"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  name="cardholderName"
                  placeholder="John Doe"
                  value={cardForm.cardholderName}
                  onChange={handleCardChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={cardForm.expiryDate}
                    onChange={handleCardChange}
                    maxLength="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={cardForm.cvv}
                    onChange={handleCardChange}
                    maxLength="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="pt-4">
                <p className="text-center text-gray-600 mb-4">Total Amount: <span className="font-bold">Rs. {grandTotalNPR.toFixed(2)}</span></p>
                <button
                  onClick={handleCardPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cash Payment Form */}
        {paymentMethod === 'cash' && (
          <div className="bg-white rounded-lg shadow-md p-8 mt-8 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Cash Payment</h2>
              <button
                onClick={() => setPaymentMethod(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Amount to Pay:</p>
                <p className="text-2xl font-bold text-gray-900">Rs. {grandTotalNPR.toFixed(2)}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Cash Amount</label>
                <input
                  type="number"
                  name="cashAmount"
                  placeholder="Enter amount in Rs."
                  value={cashForm.cashAmount}
                  onChange={handleCashChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {cashForm.cashAmount && parseFloat(cashForm.cashAmount) >= grandTotalNPR && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Change:</p>
                  <p className="text-lg font-bold text-green-600">
                    Rs. {(parseFloat(cashForm.cashAmount) - grandTotalNPR).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setPaymentMethod(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCashPayment}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Pay
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Online Payment */}
        {paymentMethod === 'online' && (
          <div className="bg-white rounded-lg shadow-md p-8 mt-8 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Online Transfer</h2>
              <button
                onClick={() => setPaymentMethod(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {!showBankDetails ? (
              <button
                onClick={() => setShowBankDetails(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                View Bank Details
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Bank Name:</p>
                    <p className="text-lg font-semibold text-gray-900">Nepal Bank Limited</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Number:</p>
                    <p className="text-lg font-semibold text-gray-900">23564789</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Amount to Transfer:</p>
                  <p className="text-2xl font-bold text-purple-600">Rs. {grandTotalNPR.toFixed(2)}</p>
                </div>

                <p className="text-sm text-gray-600 text-center">
                  Please transfer the amount and click Pay after confirmation
                </p>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowBankDetails(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleOnlinePayment}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition-colors"
                  >
                    Pay
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}