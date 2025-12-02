"use client";

import { useState } from "react";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    price: "",
    category: "men",
    photo: null,
    photoSource: "upload",
    photoUrl: "",
  });
  const [activeTab, setActiveTab] = useState("all");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result);
        setFormData((prev) => ({ ...prev, photo: event.target?.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, photoUrl: url }));
    if (url) {
      setPreviewImage(url);
    }
  };

  const handleAddItem = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.quantity ||
      !formData.price
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const newItem = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price),
      category: formData.category,
      image:
        formData.photoSource === "upload"
          ? previewImage
          : formData.photoUrl || "/placeholder.jpg",
      dateAdded: new Date().toLocaleDateString(),
      stock:
        parseInt(formData.quantity) <= 5
          ? "Low"
          : parseInt(formData.quantity) <= 15
            ? "Medium"
            : "In Stock",
    };

    setInventory((prev) => [newItem, ...prev]);
    alert(`"${formData.title}" added to inventory!`);

    setFormData({
      title: "",
      description: "",
      quantity: "",
      price: "",
      category: "men",
      photo: null,
      photoSource: "upload",
      photoUrl: "",
    });
    setPreviewImage(null);
    setShowModal(false);
  };

  const getFilteredInventory = () => {
    if (activeTab === "all") return inventory;
    if (activeTab === "low") return inventory.filter((item) => item.stock === "Low");
    if (activeTab === "medium")
      return inventory.filter((item) => item.stock === "Medium");
    if (activeTab === "in-stock")
      return inventory.filter((item) => item.stock === "In Stock");
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
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <button
              onClick={() => setShowModal(true)}
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
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No items found.</p>
            <button
              onClick={() => setShowModal(true)}
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
                    src={item.image}
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
                        item.stock
                      )}`}
                    >
                      {item.stock}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {item.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Quantity:</span>
                      <span className="font-semibold">{item.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-semibold">${item.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-semibold capitalize">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Added:</span>
                      <span className="font-semibold">{item.dateAdded}</span>
                    </div>
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
                <h2 className="text-2xl font-bold">Add Item to Inventory</h2>
                <button
                  onClick={() => setShowModal(false)}
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
                    Price *
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
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>

              {/* Photo Section */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Photo
                </label>

                <div className="flex gap-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="photoSource"
                      value="upload"
                      checked={formData.photoSource === "upload"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Upload from Device</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="photoSource"
                      value="url"
                      checked={formData.photoSource === "url"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Photo URL</span>
                  </label>
                </div>

                {formData.photoSource === "upload" ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={formData.photoUrl}
                      onChange={handlePhotoUrlChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {previewImage && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-40 w-40 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add Item to Inventory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}