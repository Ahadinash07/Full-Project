import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiShare2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';


const API_URL = "http://localhost:5376";

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, addToCart } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cartMessage, setCartMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productResponse = await axios.get(`${API_URL}/api/products/details/${productId}`);
        if (!productResponse.data.product) {
          throw new Error('Product not found');
        }
        setProduct(productResponse.data.product);
        const relatedResponse = await axios.get(`${API_URL}/api/products/search?category=${productResponse.data.product.category}&limit=4`);
        setRelatedProducts(relatedResponse.data.products || []);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleImageError = (index) => {
    setImageLoadErrors((prev) => ({ ...prev, [index]: true }));
  };

  const navigateImage = (direction) => {
    setSelectedImageIndex((prev) => {
      const allImages = [...(Array.isArray(product.images) ? product.images : []), ...(Array.isArray(product.descriptionImages) ? product.descriptionImages : [])].filter(Boolean);
      if (direction === 'prev') {
        return prev === 0 ? allImages.length - 1 : prev - 1;
      } else {
        return prev === allImages.length - 1 ? 0 : prev + 1;
      }
    });
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => {
      const newQuantity = prev + change;
      const maxQuantity = Math.min(product.quantity, 6);
      if (newQuantity < 1) {
        return 1;
      }
      if (newQuantity > maxQuantity) {
        setCartMessage({
          type: 'warning',
          text: `You can only add up to ${maxQuantity} units of this product.`,
        });
        setTimeout(() => setCartMessage(null), 3000);
        return prev;
      }
      return newQuantity;
    });
  };

  const handleAddToCart = async () => {
    const result = await addToCart(productId, quantity);
    if (result.redirectToLogin) {
      localStorage.setItem('redirectAfterLogin', '/cart');
      navigate('/login');
    } else {
      setCartMessage({ type: result.success ? 'success' : 'error', text: result.message });
      if (result.success) {
        setTimeout(() => navigate('/cart'), 1000);
      }
    }
    setTimeout(() => setCartMessage(null), 3000);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
        <strong>Error:</strong> {error}
        <div className="mt-2">
          <Link to="/" className="text-indigo-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded max-w-md text-center">
        Product not found
        <div className="mt-2">
          <Link to="/" className="text-indigo-600 hover:underline">Browse our products</Link>
        </div>
      </div>
    </div>
  );

  const mainImages = Array.isArray(product.images) ? product.images : [];
  const descImages = Array.isArray(product.descriptionImages) ? product.descriptionImages : [];
  const allImages = [...mainImages, ...descImages].filter(Boolean);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <Link to={`/category/${product.category}`} className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2">
                  {product.category}
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  {product.productName}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {cartMessage && (
          <div className={`mb-4 p-4 rounded-md ${cartMessage.type === 'success' ? 'bg-green-100 text-green-700' : cartMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
            {cartMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg shadow-md overflow-hidden aspect-square">
              {allImages.length > 0 ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImageIndex}
                      src={allImages[selectedImageIndex]}
                      alt={`${product.productName} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-contain p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onError={() => handleImageError(selectedImageIndex)}
                    />
                  </AnimatePresence>
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => navigateImage('prev')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                      >
                        <FiChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>
                      <button
                        onClick={() => navigateImage('next')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                      >
                        <FiChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${selectedImageIndex === index ? 'border-indigo-500' : 'border-transparent'}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(index)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.productName}</h1>
              <div className="mt-2 flex items-center flex-wrap gap-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(24 reviews)</span>
                </div>
                <span className={`text-sm ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-3xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="ml-2 text-lg text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
              )}
              {product.discount && (
                <span className="ml-2 text-sm font-medium text-green-600">{product.discount}% OFF</span>
              )}
            </div>

            <div className="prose max-w-none text-gray-700">
              <p>{product.description}</p>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className="px-3 py-1 border rounded-md text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 font-medium text-lg text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center transition-colors"
                disabled={product.quantity <= 0}
              >
                <FiShoppingCart className="mr-2" />
                {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="flex-1 bg-gray-100 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center transition-colors">
                <FiHeart className="mr-2" />
                Wishlist
              </button>
              <button className="flex-1 bg-white border border-gray-300 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center transition-colors">
                <FiShare2 className="mr-2" />
                Share
              </button>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-lg font-medium text-gray-900">Product Details</h2>
              <div className="mt-4 space-y-4">
                {product.brand && (
                  <div className="flex flex-wrap">
                    <span className="text-gray-500 w-32">Brand</span>
                    <span className="text-gray-900 flex-1">{product.brand}</span>
                  </div>
                )}
                {product.category && (
                  <div className="flex flex-wrap">
                    <span className="text-gray-500 w-32">Category</span>
                    <span className="text-gray-900 flex-1">{product.category}</span>
                  </div>
                )}
                {product.subcategory && (
                  <div className="flex flex-wrap">
                    <span className="text-gray-500 w-32">Subcategory</span>
                    <span className="text-gray-900 flex-1">{product.subcategory}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex flex-wrap">
                    <span className="text-gray-500 w-32">Weight</span>
                    <span className="text-gray-900 flex-1">{product.weight} kg</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex flex-wrap">
                    <span className="text-gray-500 w-32">Dimensions</span>
                    <span className="text-gray-900 flex-1">{product.dimensions}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
