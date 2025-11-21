"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function InStoreInventory() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("new-arrivals");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const API = {
    men: [
      "https://dummyjson.com/products/category/mens-shirts",
      "https://dummyjson.com/products/category/mens-shoes",
    ],
    women: [
      "https://dummyjson.com/products/category/womens-dresses",
      "https://dummyjson.com/products/category/womens-shoes",
    ],
    kids: [
      "https://dummyjson.com/products/category/tops",
      "https://dummyjson.com/products/category/sunglasses",
    ],
  };

  const fetchCategory = async (urls, categoryName) => {
    let all = [];
    for (const url of urls) {
      const res = await fetch(url);
      const data = await res.json();
      all = [...all, ...data.products];
    }

    return all.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      image: p.thumbnail,
      category: categoryName,
      stock: Math.floor(Math.random() * 30) + 5,
      onSale: Math.random() > 0.7,
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0,
    }));
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const men = await fetchCategory(API.men, "men");
        const women = await fetchCategory(API.women, "women");
        const kids = await fetchCategory(API.kids, "kids");

        const all = [...men, ...women, ...kids];

        setProducts(all);
        setFilteredProducts(all);
        setLoading(false);
      } catch (err) {
        console.error("Error loading dummy products:", err);
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);

    if (cat === "new-arrivals") {
      setFilteredProducts(products);
    } else if (cat === "sale") {
      setFilteredProducts(products.filter((p) => p.onSale));
    } else {
      setFilteredProducts(products.filter((p) => p.category === cat));
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: "url(/instore.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* HEADER */}
      <div className="bg-white/90 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Mandira's In-Store Inventory</h1>

          <div className="flex gap-4 mt-4 flex-wrap">
            {[
              { id: "new-arrivals", label: "New Arrivals" },
              { id: "men", label: "Men" },
              { id: "women", label: "Women" },
              { id: "kids", label: "Kids" },
              { id: "sale", label: "Sale" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleCategoryChange(btn.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === btn.id
                    ? btn.id === "sale"
                      ? "bg-red-600 text-white"
                      : "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INVENTORY GRID */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-600 border-r-transparent"></div>
            <p className="mt-4">Loading inventory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow rounded-lg overflow-hidden relative"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain p-4"
                  />

                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                    Stock: {product.stock}
                  </span>

                  {product.onSale && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold">${product.price}</p>

                      <p className="text-sm text-gray-700 font-medium mt-1">
                        {product.stock <= 5
                          ? "⚠️ Low Stock"
                          : product.stock <= 15
                          ? "🟡 Medium"
                          : "🟢 In Stock"}
                      </p>
                    </div>

                    {/* CART BUTTON */}
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition"
                      onClick={() => {
                        addToCart(product, "instore");
                        alert(`Added "${product.title}" to cart!`);
                      }}
                    >
                      🛒
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-10 text-gray-600">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}
