import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import CategorySection from '../components/CategorySection';

const API_URL = "http://localhost:5376"

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 600], [0, 120]);
  const yContent = useTransform(scrollY, [0, 600], [0, 60]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products/featured`);
        setFeaturedProducts(response.data.products);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const waveVariants = {
    animate: {
      y: [0, -20, 0],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  if (loading) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-white bg-gray-900"
    >
      Loading...
    </motion.div>
  );

  if (error) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-red-400 bg-gray-900"
    >
      {error}
    </motion.div>
  );

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: yBackground }}
        animate={{
          background: [
            'radial-gradient(circle at 30% 40%, #4b5563 0%, #1e40af 100%)',
            'radial-gradient(circle at 70% 60%, #7c3aed 0%, #1e40af 100%)',
            'radial-gradient(circle at 30% 40%, #4b5563 0%, #1e40af 100%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900 opacity-30"
          variants={waveVariants}
          animate="animate"
        />
      </motion.div>

      <motion.div
        className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto"
        style={{ y: yContent }}
      >
        <motion.section
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight"
            animate={{ scale: [1, 1.03, 1], textShadow: ['0 0 10px rgba(255,255,255,0.3)', '0 0 20px rgba(255,255,255,0.5)', '0 0 10px rgba(255,255,255,0.3)'] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Elevate Your Shopping
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            Discover premium products at irresistible prices!
          </motion.p>
        </motion.section>

        <section className="mb-12 sm:mb-16 lg:mb-20">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 lg:mb-10"
          >
            Featured Products
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <AnimatePresence>
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product, index) => (
                  <motion.div key={product.productId}>
                    <ProductCard product={product} />
                  </motion.div>
                ))
              ) : (
                Array.from({ length: 4 }).map((_, index) => (
                  <motion.div key={index}>
                    <ProductCard
                      product={{
                        productId: index,
                        productName: `Product ${index + 1}`,
                        price: 29.99,
                        description: 'Lorem ipsum dolor sit amet.',
                        quantity: 10,
                        images: ['/images/fallback.jpg'],
                      }}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

        <CategorySection />
      </motion.div>
    </div>
  );
};

export default Home;
