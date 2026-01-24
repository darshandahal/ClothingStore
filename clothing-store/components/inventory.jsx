"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Footer from "@/components/Footer";
// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    price: "",
    category: "women",
    photoUrl: "",
    availableIn: ["online", "instore"], // New field
  });

  // Fetch inventory from Supabase
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      alert("Error fetching inventory: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (platform) => {
    setFormData((prev) => {
      const availableIn = prev.availableIn.includes(platform)
        ? prev.availableIn.filter((p) => p !== platform)
        : [...prev.availableIn, platform];
      return { ...prev, availableIn };
    });
  };

  const calculateStockStatus = (quantity) => {
    if (quantity <= 5) return "Low";
    if (quantity <= 15) return "Medium";
    return "In Stock";
  };

  const handleAddItem = async () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.quantity ||
      !formData.price ||
      !formData.photoUrl ||
      formData.availableIn.length === 0
    ) {
      alert("Please fill in all required fields and select at least one platform");
      return;
    }

    try {
      const stockStatus = calculateStockStatus(parseInt(formData.quantity));

      if (editingId) {
        // Update existing item
        const { error } = await supabase
          .from("inventory")
          .update({
            title: formData.title,
            description: formData.description,
            quantity: parseInt(formData.quantity),
            price: parseFloat(formData.price),
            category: formData.category,
            photo_url: formData.photoUrl,
            stock_status: stockStatus,
            available_in: formData.availableIn,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
        alert("Item updated successfully!");
        setEditingId(null);
      } else {
        // Add new item
        const { error } = await supabase.from("inventory").insert({
          title: formData.title,
          description: formData.description,
          quantity: parseInt(formData.quantity),
          price: parseFloat(formData.price),
          category: formData.category,
          photo_url: formData.photoUrl,
          stock_status: stockStatus,
          available_in: formData.availableIn,
        });

        if (error) throw error;
        alert(`"${formData.title}" added to inventory!`);
      }

      // Reset form and refresh inventory
      setFormData({
        title: "",
        description: "",
        quantity: "",
        price: "",
        category: "women",
        photoUrl: "",
        availableIn: ["online", "instore"],
      });
      setShowModal(false);
      fetchInventory();
    } catch (error) {
      alert("Error saving item: " + error.message);
    }
  };

  const handleEditItem = (item) => {
    setFormData({
      title: item.title,
      description: item.description,
      quantity: item.quantity.toString(),
      price: item.price.toString(),
      category: item.category,
      photoUrl: item.photo_url,
      availableIn: item.available_in || ["online", "instore"],
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleDeleteItem = async (id, title) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const { error } = await supabase
          .from("inventory")
          .delete()
          .eq("id", id);

        if (error) throw error;
        alert("Item deleted successfully!");
        fetchInventory();
      } catch (error) {
        alert("Error deleting item: " + error.message);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      quantity: "",
      price: "",
      category: "women",
      photoUrl: "",
      availableIn: ["online", "instore"],
    });
  };

  const getFilteredInventory = () => {
    if (activeTab === "all") return inventory;
    if (activeTab === "low") return inventory.filter((item) => item.stock_status === "Low");
    if (activeTab === "medium")
      return inventory.filter((item) => item.stock_status === "Medium");
    if (activeTab === "in-stock")
      return inventory.filter((item) => item.stock_status === "In Stock");
    if (activeTab === "recently-added") return inventory.slice(0, 10);
  };

  const filteredItems = getFilteredInventory();

  const getStockColor = (stock) => {
    if (stock === "Low") return "bg-red-100 text-red-800";
    if (stock === "Medium") return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Inventory Management (Main)</h1>
            <button
              onClick={() => {
                closeModal();
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              + Add to Inventory
            </button>
          </div>

          {/* TABS */}
          <div className="flex gap-3 mt-6 flex-wrap">
            {[
              { id: "all", label: "All Items" },
              { id: "low", label: "⚠️ Low Stock" },
              { id: "medium", label: "🟡 Medium Stock" },
              { id: "in-stock", label: "🟢 In Stock" },
              { id: "recently-added", label: "✨ Recently Added" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INVENTORY GRID */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">Loading inventory...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No items found.</p>
            <button
              onClick={() => {
                closeModal();
                setShowModal(true);
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Image */}
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={item.photo_url || "/placeholder.jpg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold line-clamp-2">
                      {item.title}
                    </h3>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${getStockColor(
                        item.stock_status
                      )}`}
                    >
                      {item.stock_status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {item.description}
                  </p>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Quantity:</span>
                      <span className="font-semibold">{item.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-semibold">Rs. {item.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-semibold capitalize">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Available In:</span>
                      <span className="font-semibold">
                        {item.available_in?.join(", ") || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Added:</span>
                      <span className="font-semibold">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-blue-600 text-white p-6 sticky top-0">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {editingId ? "Edit Item" : "Add Item to Inventory"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-2xl hover:opacity-75"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Quantity & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="women">Women</option>
                </select>
              </div>

              {/* Available In */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available In *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.availableIn.includes("online")}
                      onChange={() => handleAvailabilityChange("online")}
                      className="mr-2"
                    />
                    Online Store
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.availableIn.includes("instore")}
                      onChange={() => handleAvailabilityChange("instore")}
                      className="mr-2"
                    />
                    In-Store
                  </label>
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Photo URL *
                </label>
                <input
                  type="url"
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {editingId ? "Update Item" : "Add Item to Inventory"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
            <Footer />
    </div>
  );
}