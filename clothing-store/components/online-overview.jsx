'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';

export default function OnlineOverview() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('new-arrivals');
  const [loading, setLoading] = useState(true);

  // Fetch products from FakeStore API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://fakestoreapi.com/products/category/men\'s clothing');
        const menProducts = await response.json();
        
        const response2 = await fetch('https://fakestoreapi.com/products/category/women\'s clothing');
        const womenProducts = await response2.json();
        
        const response3 = await fetch('https://fakestoreapi.com/products/category/jewelery');
        const accessories = await response3.json();

        // Combine and categorize products
        const allProducts = [
          ...menProducts.map(p => ({ ...p, category: 'men', gender: 'Men' })),
          ...womenProducts.map(p => ({ ...p, category: 'women', gender: 'Women' })),
          ...accessories.slice(0, 4).map(p => ({ ...p, category: 'kids', gender: 'Kids' }))
        ];

        // Add sale flag to some random products
        const productsWithSale = allProducts.map(p => ({
          ...p,
          onSale: Math.random() > 0.7,
          discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0
        }));

        setProducts(productsWithSale);
        setFilteredProducts(productsWithSale); // Show all as "New Arrivals" by default
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on category
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    
    if (category === 'new-arrivals') {
      setFilteredProducts(products);
    } else if (category === 'sale') {
      setFilteredProducts(products.filter(p => p.onSale));
    } else {
      setFilteredProducts(products.filter(p => p.category === category));
    }
  };

  const handleAddToCart = (product) => {
    // Add your cart logic here
    console.log('Added to cart:', product);
    alert(`${product.title} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Babita Online Store
          </h1>
          
          {/* Category Navigation */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => handleCategoryChange('new-arrivals')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === 'new-arrivals'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => handleCategoryChange('men')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === 'men'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Men
            </button>
            <button
              onClick={() => handleCategoryChange('women')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === 'women'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Women
            </button>
            <button
              onClick={() => handleCategoryChange('kids')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === 'kids'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Kids
            </button>
            <button
              onClick={() => handleCategoryChange('sale')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === 'sale'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              Sale
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {activeCategory === 'new-arrivals' && 'New Arrivals'}
              {activeCategory === 'men' && 'Men\'s Collection'}
              {activeCategory === 'women' && 'Women\'s Collection'}
              {activeCategory === 'kids' && 'Kids Collection'}
              {activeCategory === 'sale' && 'On Sale'}
            </h2>
            
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
                          ${product.onSale 
                            ? (product.price * (1 - product.discount / 100)).toFixed(2)
                            : product.price.toFixed(2)
                          }
                        </p>
                        {product.onSale && (
                          <p className="text-sm text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        title="Add to Cart"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No products found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}