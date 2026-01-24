"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@supabase/supabase-js";
import Footer from "@/components/Footer";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function OnlineOverview() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("new-arrivals");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Fetch products from Supabase inventory
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filter products available online
      const onlineProducts = (data || [])
        .filter((item) => item.available_in?.includes("online"))
        .map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          image: item.photo_url,
          category: item.category,
          stock: item.quantity,
          stockStatus: item.stock_status,
          onSale: false,
          discount: 0,
        }));

      setProducts(onlineProducts);
      setFilteredProducts(onlineProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Error loading products: " + error.message);
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);

    if (category === "new-arrivals") {
      setFilteredProducts(products);
    } else if (category === "sale") {
      setFilteredProducts(products.filter((p) => p.onSale));
    } else {
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  };

  const handleAddToCart = async (product) => {
    try {
      // Check current stock
      const { data, error } = await supabase
        .from("inventory")
        .select("quantity")
        .eq("id", product.id)
        .single();

      if (error) throw error;

      if (data.quantity <= 0) {
        alert("This product is out of stock!");
        return;
      }

      // Update stock in inventory
      const { error: updateError } = await supabase
        .from("inventory")
        .update({
          quantity: data.quantity - 1,
          stock_status:
            data.quantity - 1 <= 5
              ? "Low"
              : data.quantity - 1 <= 15
              ? "Medium"
              : "In Stock",
          updated_at: new Date().toISOString(),
        })
        .eq("id", product.id);

      if (updateError) throw updateError;

      // Add to cart
      addToCart(product, "online");
      alert(`${product.title} added to cart! Stock updated.`);

      // Refresh products
      fetchProducts();
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: "url(/online.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <div className="bg-white/90 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mandira's Fancy Online Store
          </h1>
          <p className="text-sm text-gray-600">
            Products synced from main inventory
          </p>

          {/* Category Navigation */}
          <div className="flex gap-4 flex-wrap mt-4">
            {["new-arrivals", "women", "sale"].map((category) => {
              const isActive = activeCategory === category;
              let bg = isActive
                ? category === "sale"
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white"
                : category === "sale"
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300";

              let label =
                category === "new-arrivals"
                  ? "New Arrivals"
                  : category === "women"
                  ? "Women"
                  : "Sale";

              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${bg}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-white bg-black/50 inline-block px-4 py-2 rounded">
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/90 rounded-lg">
            <p className="text-gray-600 text-lg">
              No products found in this category.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Add products to inventory and mark them as available online.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
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
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1">
                      {product.title}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        Rs.{" "}
                        {product.onSale
                          ? (product.price * (1 - product.discount / 100)).toFixed(
                              2
                            )
                          : product.price.toFixed(2)}
                      </p>
                      {product.onSale && (
                        <p className="text-sm text-gray-500 line-through">
                          Rs. {product.price.toFixed(2)}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        {product.stock <= 0
                          ? "❌ Out of Stock"
                          : product.stock <= 5
                          ? "⚠️ Low Stock"
                          : product.stock <= 15
                          ? "🟡 Medium Stock"
                          : "🟢 In Stock"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className={`p-3 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                        product.stock <= 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                      title={product.stock <= 0 ? "Out of stock" : "Add to Cart"}
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
