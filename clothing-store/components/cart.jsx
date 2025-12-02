'use client';

import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, calculateTotal } = useCart();

  const CartSection = ({ title, items, source }) => {
    const total = calculateTotal(items);

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600">No items in {title.toLowerCase()}</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0">
                    <img
                      src={item.image || item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {source === 'instore' && `Stock: ${item.stock}`}
                    </p>

                    {/* Price Info */}
                    <div className="mt-2">
                      {item.onSale ? (
                        <div className="flex gap-2 items-center">
                          <span className="text-lg font-bold text-green-600">
                            ${(item.price * (1 - (item.discount || 0) / 100)).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            {item.discount}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col gap-3 items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id, source)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Remove"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="flex items-center gap-2 border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, source, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, source, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Subtotal</p>
                      <p className="text-lg font-bold">
                        ${(
                          (item.onSale
                            ? item.price * (1 - (item.discount || 0) / 100)
                            : item.price) * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Section Total */}
            <div className="border-t pt-4">
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Subtotal ({items.length} items):</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const inStoreTotal = calculateTotal(cartItems.instore);
  const onlineTotal = calculateTotal(cartItems.online);
  const grandTotal = inStoreTotal + onlineTotal;
  const totalItems = cartItems.instore.length + cartItems.online.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
          </p>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {totalItems === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingCart className="mx-auto mb-4 text-gray-400" size={64} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600">Start shopping to add items to your cart!</p>
          </div>
        ) : (
          <>
            {cartItems.instore.length > 0 && (
              <CartSection
                title="In-Store Products"
                items={cartItems.instore}
                source="instore"
              />
            )}

            {cartItems.online.length > 0 && (
              <CartSection
                title="Online Products"
                items={cartItems.online}
                source="online"
              />
            )}

            {/* Order Summary */}
            <div className="flex justify-end">
              <div className="bg-white rounded-lg shadow-md p-6 w-96">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  {cartItems.instore.length > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>In-Store Subtotal:</span>
                      <span className="font-semibold">${inStoreTotal.toFixed(2)}</span>
                    </div>
                  )}

                  {cartItems.online.length > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Online Subtotal:</span>
                      <span className="font-semibold">${onlineTotal.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Grand Total:</span>
                    <span className="text-blue-600">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button onClick={() => router.push('/billing')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                  Proceed to Billing
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
