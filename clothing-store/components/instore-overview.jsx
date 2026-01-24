"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@supabase/supabase-js";
import Footer from "@/components/Footer";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function InStoreInventory() {
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

      // Filter products that are available in-store
      const instoreProducts = (data || [])
        .filter((item) => item.available_in?.includes("instore"))
        .map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          image: item.photo_url,
          category: item.category,
          stock: item.quantity,
          stockStatus: item.stock_status,
          onSale: false, // You can add sale logic if needed
          discount: 0,
        }));

      setProducts(instoreProducts);
      setFilteredProducts(instoreProducts);
      setLoading(false);
    } catch (err) {
      console.error("Error loading products:", err);
      alert("Error loading products: " + err.message);
      setLoading(false);
    }
  };

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

  const handleAddToCart = async (product) => {
    try {
      // Check current stock before adding to cart
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

      // Decrease quantity in inventory
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
      addToCart(product, "instore");
      alert(`"${product.title}" added to cart! Stock updated.`);

      // Refresh products
      fetchProducts();
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error: " + error.message);
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
          <p className="text-sm text-gray-600 mt-1">
            Products synced from main inventory
          </p>

          <div className="flex gap-4 mt-4 flex-wrap">
            {[
              { id: "new-arrivals", label: "New Arrivals" },
              { id: "women", label: "Women" },
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
            <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-600 border-r-transparent mx-auto"></div>
            <p className="mt-4 text-white bg-black/50 inline-block px-4 py-2 rounded">
              Loading inventory...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/90 rounded-lg">
            <p className="text-gray-600 text-lg">
              No products found in this category.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Add products to inventory and mark them as available in-store.
            </p>
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
                      <p className="text-lg font-bold">Rs. {product.price}</p>

                      <p className="text-sm text-gray-700 font-medium mt-1">
                        {product.stock <= 0
                          ? "❌ Out of Stock"
                          : product.stock <= 5
                          ? "⚠️ Low Stock"
                          : product.stock <= 15
                          ? "🟡 Medium"
                          : "🟢 In Stock"}
                      </p>
                    </div>

                    {/* CART BUTTON */}
                    <button
                      className={`p-2 rounded-full shadow-md transition ${
                        product.stock <= 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      title={
                        product.stock <= 0
                          ? "Out of stock"
                          : "Add to cart"
                      }
                    >
                      🛒
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* FOOTER */}
            <Footer />
    </div>
  );
}