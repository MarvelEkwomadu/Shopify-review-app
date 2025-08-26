import React, { useState, useRef } from 'react';
import { Star, Camera, Video, Search, Award, ThumbsUp, ShoppingBag, Mail, Lock, ShoppingCart, Check, User, Eye, EyeOff } from 'lucide-react';
import './App.css';

const ShopifyReviewApp = () => {
  const [currentPage, setCurrentPage] = useState('shopify-dashboard');
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [signupErrors, setSignupErrors] = useState({});
  const [activeTab, setActiveTab] = useState('reviews');
  const [newReview, setNewReview] = useState({ rating: 5, text: '', mediaType: null, mediaFile: null });
  const [userPoints, setUserPoints] = useState(245);
  const fileInputRef = useRef(null);

  const reviews = {
    1: [{
      id: 1, user: 'Sarah M.', rating: 5, date: '2024-08-15',
      text: 'Amazing quality! The fabric feels premium.',
      mediaType: 'video', verified: true, helpful: 23, points: 50, aiScore: 9.2
    }],
    2: [{
      id: 2, user: 'Emma L.', rating: 5, date: '2024-08-08',
      text: 'Perfect for workouts! Great quality.',
      mediaType: 'image', verified: true, helpful: 31, points: 60, aiScore: 9.5
    }],
    3: [{
      id: 3, user: 'Maya R.', rating: 5, date: '2024-08-12',
      text: 'My skin has never felt better! The organic ingredients really work.',
      mediaType: 'image', verified: true, helpful: 19, points: 50, aiScore: 9.4
    }],
    4: [{
      id: 4, user: 'Alex K.', rating: 4, date: '2024-08-10',
      text: 'Good fitness tracker, battery life could be better.',
      mediaType: null, verified: true, helpful: 15, points: 20, aiScore: 8.7
    }],
    5: [{
      id: 5, user: 'Jordan P.', rating: 5, date: '2024-08-14',
      text: 'Best keyboard I have ever used for gaming! The switches are perfect.',
      mediaType: 'video', verified: true, helpful: 42, points: 80, aiScore: 9.8
    }],
    6: [{
      id: 6, user: 'Michael T.', rating: 5, date: '2024-08-11',
      text: 'Beautiful leather quality. Gets better with age!',
      mediaType: 'image', verified: true, helpful: 28, points: 50, aiScore: 9.6
    }]
  };

  const products = [
    { id: 1, name: 'Premium Cotton T-Shirt', price: '$29.99', originalPrice: '$39.99', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', overallRating: 4.8, totalReviews: 127, aiTrustScore: 9.1, category: 'Clothing' },
    { id: 2, name: 'Wireless Bluetooth Earbuds', price: '$79.99', originalPrice: '$99.99', image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop', overallRating: 4.6, totalReviews: 203, aiTrustScore: 8.9, category: 'Electronics' },
    { id: 3, name: 'Organic Skincare Set', price: '$45.99', originalPrice: '$59.99', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', overallRating: 4.9, totalReviews: 89, aiTrustScore: 9.4, category: 'Beauty' },
    { id: 4, name: 'Fitness Tracker Watch', price: '$129.99', originalPrice: '$179.99', image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop', overallRating: 4.5, totalReviews: 156, aiTrustScore: 8.7, category: 'Electronics' },
    { id: 5, name: 'Gaming Mechanical Keyboard', price: '$89.99', originalPrice: '$119.99', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop', overallRating: 4.7, totalReviews: 94, aiTrustScore: 9.2, category: 'Electronics' },
    { id: 6, name: 'Luxury Leather Wallet', price: '$49.99', originalPrice: '$69.99', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', overallRating: 4.9, totalReviews: 178, aiTrustScore: 9.6, category: 'Accessories' },
    { id: 7, name: 'Aromatherapy Candle Set', price: '$24.99', originalPrice: '$34.99', image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=400&fit=crop', overallRating: 4.6, totalReviews: 67, aiTrustScore: 8.8, category: 'Home & Garden' },
    { id: 8, name: 'Professional Coffee Grinder', price: '$159.99', originalPrice: '$199.99', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', overallRating: 4.8, totalReviews: 142, aiTrustScore: 9.3, category: 'Kitchen' }
  ];

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 3000);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price.replace('$', '')) * item.quantity), 0).toFixed(2);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLoginForm = () => {
    const errors = {};
    
    if (!loginForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(loginForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!loginForm.password.trim()) {
      errors.password = 'Password is required';
    } else if (loginForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignupForm = () => {
    const errors = {};
    
    if (!signupForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!signupForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(signupForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!signupForm.password.trim()) {
      errors.password = 'Password is required';
    } else if (signupForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    
    if (!signupForm.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (signupForm.password !== signupForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login form submitted', loginForm); // Debug log
    if (validateLoginForm()) {
      console.log('Validation passed, setting user and page'); // Debug log
      setUser({ name: loginForm.email.split('@')[0], email: loginForm.email });
      setCurrentPage('dashboard');
      setLoginErrors({});
    } else {
      console.log('Validation failed', loginErrors); // Debug log
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log('Signup form submitted', signupForm); // Debug log
    if (validateSignupForm()) {
      console.log('Signup validation passed'); // Debug log
      setUser({ name: signupForm.name, email: signupForm.email });
      setCurrentPage('dashboard');
      setSignupErrors({});
    } else {
      console.log('Signup validation failed', signupErrors); // Debug log
    }
  };

  const renderStars = (rating, interactive = false, onRate = null, size = 'w-5 h-5') => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  // Main Shopify Storefront (Complete Shopping Experience)
  if (currentPage === 'shopify-dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-pink-50">
        {/* Store Header */}
        <div className="bg-white shadow-lg border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-r from-green-500 to-pink-500 rounded-xl">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-pink-600 bg-clip-text text-transparent">
                    VibeMarket
                  </h1>
                  <span className="text-sm text-gray-600">Your Premium Shopping Destination</span>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <button className="text-gray-700 hover:text-green-600 font-medium">All Products</button>
                <button className="text-gray-700 hover:text-green-600 font-medium">Categories</button>
                <button className="text-gray-700 hover:text-green-600 font-medium">My Orders</button>
                <button className="text-gray-700 hover:text-green-600 font-medium">Account</button>
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-green-600 cursor-pointer" />
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 py-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Summer Sale - Up to 50% Off!</h2>
          <p className="text-xl mb-6">Free shipping on orders over $50</p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transform hover:scale-105 transition-all">
            Shop Sale Now
          </button>
        </div>

        {/* Product Categories */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-2">📱</div>
              <h4 className="font-semibold">Electronics</h4>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-2">👕</div>
              <h4 className="font-semibold">Clothing</h4>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-2">🏠</div>
              <h4 className="font-semibold">Home & Garden</h4>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-2">💄</div>
              <h4 className="font-semibold">Beauty</h4>
            </div>
          </div>
        </div>

        {/* Featured Products with Full Shopping Features */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Featured Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Wireless Bluetooth Earbuds', price: '$79.99', originalPrice: '$99.99', image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop', rating: 4.8, reviews: 203, inStock: true },
              { name: 'Premium Cotton T-Shirt', price: '$29.99', originalPrice: '$39.99', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop', rating: 4.9, reviews: 127, inStock: true },
              { name: 'Fitness Tracker Watch', price: '$129.99', originalPrice: '$179.99', image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=300&fit=crop', rating: 4.7, reviews: 156, inStock: false },
              { name: 'Gaming Mechanical Keyboard', price: '$89.99', originalPrice: '$119.99', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop', rating: 4.6, reviews: 94, inStock: true },
              { name: 'Luxury Leather Wallet', price: '$49.99', originalPrice: '$69.99', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.9, reviews: 178, inStock: true },
              { name: 'Aromatherapy Candle Set', price: '$24.99', originalPrice: '$34.99', image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=400&fit=crop', rating: 4.6, reviews: 67, inStock: true },
              { name: 'Professional Coffee Grinder', price: '$159.99', originalPrice: '$199.99', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', rating: 4.8, reviews: 142, inStock: true },
              { name: 'Organic Skincare Set', price: '$45.99', originalPrice: '$59.99', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', rating: 4.9, reviews: 89, inStock: true }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">Out of Stock</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    SALE
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl font-bold text-green-600">{product.price}</span>
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  </div>
                  <div className="flex items-center mb-3">
                    {renderStars(Math.floor(product.rating), false, null, 'w-4 h-4')}
                    <span className="ml-1 text-sm text-gray-500">({product.reviews} reviews)</span>
                  </div>
                  <button 
                    className={`w-full py-2 rounded-lg font-medium transition-all ${
                      product.inStock 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Service & Info */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl mb-4">🚚</div>
                <h4 className="font-bold mb-2">Free Shipping</h4>
                <p className="text-gray-600">On orders over $50</p>
              </div>
              <div>
                <div className="text-3xl mb-4">🔒</div>
                <h4 className="font-bold mb-2">Secure Payment</h4>
                <p className="text-gray-600">SSL encrypted checkout</p>
              </div>
              <div>
                <div className="text-3xl mb-4">↩️</div>
                <h4 className="font-bold mb-2">Easy Returns</h4>
                <p className="text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Review System Link - Subtle at Bottom */}
        <div className="bg-gray-100 py-8 border-t">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Want to share your experience?</h4>
            <p className="text-gray-600 mb-4">Join our review community and help other customers make informed decisions</p>
            <button
              onClick={() => setCurrentPage('review-setup')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Access Review System
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-6">
              <div>
                <h5 className="font-bold mb-3">VibeMarket</h5>
                <p className="text-gray-400 text-sm">Your trusted shopping destination for premium products</p>
              </div>
              <div>
                <h5 className="font-bold mb-3">Customer Service</h5>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>Contact Us</li>
                  <li>FAQ</li>
                  <li>Shipping Info</li>
                  <li>Returns</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold mb-3">Account</h5>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>My Orders</li>
                  <li>Track Package</li>
                  <li>Wishlist</li>
                  <li>Account Settings</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold mb-3">Connect</h5>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>Newsletter</li>
                  <li>Social Media</li>
                  <li>Blog</li>
                  <li>Reviews</li>
                </ul>
              </div>
            </div>
            <div className="text-center text-gray-400 text-sm pt-6 border-t border-gray-700">
              © 2024 VibeMarket. All rights reserved. Powered by Shopify.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Review Setup (was Login Page)
  if (currentPage === 'review-setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full inline-block mb-4">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Shopify Review App
            </h1>
            <p className="text-gray-600 mt-2">Authentic reviews with visual proof</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="email"
                  className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 ${
                    loginErrors.email ? 'border-red-500' : 'border-purple-200'
                  }`}
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={(e) => {
                    setLoginForm({...loginForm, email: e.target.value});
                    if (loginErrors.email) setLoginErrors({...loginErrors, email: ''});
                  }}
                  required
                />
              </div>
              {loginErrors.email && (
                <p className="mt-1 text-sm text-red-600">{loginErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-xs text-gray-500">(minimum 8 characters)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 ${
                    loginErrors.password ? 'border-red-500' : 'border-purple-200'
                  }`}
                  placeholder="Enter your password (min 8 characters)"
                  value={loginForm.password}
                  onChange={(e) => {
                    setLoginForm({...loginForm, password: e.target.value});
                    if (loginErrors.password) setLoginErrors({...loginErrors, password: ''});
                  }}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {loginErrors.password && (
                <p className="mt-1 text-sm text-red-600">{loginErrors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button className="text-purple-600 font-medium" onClick={() => setCurrentPage('review-signup')}>
                Sign up
              </button>
            </p>
          </div>

          <div className="mt-6 text-xs text-gray-500 text-center bg-yellow-100 p-2 rounded-lg">
            Demo: Use any email and password to login
          </div>
        </div>
      </div>
    );
  }

  // Review Signup Page
  if (currentPage === 'review-signup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full inline-block mb-4">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Join Our Community
            </h1>
            <p className="text-gray-600 mt-2">Start earning points for reviews!</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                <input
                  type="text"
                  className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 ${
                    signupErrors.name ? 'border-red-500' : 'border-green-200'
                  }`}
                  placeholder="Enter your full name"
                  value={signupForm.name}
                  onChange={(e) => {
                    setSignupForm({...signupForm, name: e.target.value});
                    if (signupErrors.name) setSignupErrors({...signupErrors, name: ''});
                  }}
                  required
                />
              </div>
              {signupErrors.name && (
                <p className="mt-1 text-sm text-red-600">{signupErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                <input
                  type="email"
                  className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 ${
                    signupErrors.email ? 'border-red-500' : 'border-green-200'
                  }`}
                  placeholder="Enter your email"
                  value={signupForm.email}
                  onChange={(e) => {
                    setSignupForm({...signupForm, email: e.target.value});
                    if (signupErrors.email) setSignupErrors({...signupErrors, email: ''});
                  }}
                  required
                />
              </div>
              {signupErrors.email && (
                <p className="mt-1 text-sm text-red-600">{signupErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-xs text-gray-500">(minimum 8 characters)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                <input
                  type="password"
                  className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 ${
                    signupErrors.password ? 'border-red-500' : 'border-green-200'
                  }`}
                  placeholder="Create a password (min 8 characters)"
                  value={signupForm.password}
                  onChange={(e) => {
                    setSignupForm({...signupForm, password: e.target.value});
                    if (signupErrors.password) setSignupErrors({...signupErrors, password: ''});
                  }}
                  required
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
                <p className={`text-xs ${signupForm.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                  {signupForm.password.length}/8 characters
                </p>
              </div>
              {signupErrors.password && (
                <p className="mt-1 text-sm text-red-600">{signupErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                <input
                  type="password"
                  className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 ${
                    signupErrors.confirmPassword ? 'border-red-500' : 'border-green-200'
                  }`}
                  placeholder="Confirm your password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => {
                    setSignupForm({...signupForm, confirmPassword: e.target.value});
                    if (signupErrors.confirmPassword) setSignupErrors({...signupErrors, confirmPassword: ''});
                  }}
                  required
                />
              </div>
              {signupErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{signupErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button className="text-green-600 font-medium" onClick={() => setCurrentPage('review-setup')}>
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Page
  if (currentPage === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {showCartNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-bounce">
            <Check className="w-5 h-5" />
            <span>Added to cart!</span>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-purple-100">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Shopify Review App
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-2 rounded-full">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="font-bold text-yellow-800">{userPoints} Points</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-full">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-800">${getCartTotal()}</span>
                {getCartItemCount() > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">Hi, {user.name}!</p>
                  <button
                    className="text-sm text-gray-500 hover:text-gray-700"
                    onClick={() => { 
                      setUser(null); 
                      setCurrentPage('shopify-dashboard'); 
                      setCart([]); 
                      setLoginForm({ email: '', password: '' });
                      setSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
                      setLoginErrors({});
                      setSignupErrors({});
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="products-section">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Find Products to Review
            </h2>
            <p className="text-gray-600 text-lg">Search for products and share your authentic reviews to earn points</p>
          </div>

          <div className="max-w-2xl mx-auto mb-8 px-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-purple-400" />
              <input
                type="text"
                className="w-full pl-14 pr-4 py-4 border-2 border-purple-200 rounded-2xl text-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/70 backdrop-blur-sm shadow-lg"
                placeholder="Search products, brands, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="products-grid-container px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden border border-white/20"
                >
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 
                      className="font-bold text-gray-900 mb-2 text-lg cursor-pointer hover:text-purple-600"
                      onClick={() => { setSelectedProduct(product); setCurrentPage('product'); setActiveTab('reviews'); }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{product.price}</p>
                        <p className="text-sm text-gray-500 line-through">{product.originalPrice}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-1">
                          {renderStars(Math.floor(product.overallRating), false, null, 'w-4 h-4')}
                          <span className="ml-1 text-sm text-gray-600">({product.totalReviews})</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        AI Trust: {product.aiTrustScore}/10
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        className="flex-1 text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium"
                        onClick={() => { setSelectedProduct(product); setCurrentPage('product'); setActiveTab('reviews'); }}
                      >
                        View & Review
                      </button>
                      <button 
                        className="flex-1 text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium flex items-center justify-center space-x-1"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-xl">No products found matching "{searchQuery}"</p>
                <button
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Product Page
  if (currentPage === 'product' && selectedProduct) {
    const productReviews = reviews[selectedProduct.id] || [];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {showCartNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-bounce">
            <Check className="w-5 h-5" />
            <span>Added to cart!</span>
          </div>
        )}

        <div className="max-w-6xl mx-auto p-6">
          <button
            className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium"
            onClick={() => setCurrentPage('dashboard')}
          >
            ← Back to Products
          </button>

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-6 border border-white/20">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-64 object-cover rounded-lg shadow-md" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{selectedProduct.name}</h2>
                <div className="flex items-center space-x-4 mb-4">
                  <p className="text-3xl font-bold text-green-600">{selectedProduct.price}</p>
                  <p className="text-xl text-gray-500 line-through">{selectedProduct.originalPrice}</p>
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {renderStars(Math.floor(selectedProduct.overallRating))}
                    <span className="ml-2 text-lg font-semibold">{selectedProduct.overallRating}</span>
                  </div>
                  <span className="text-gray-500">({selectedProduct.totalReviews} reviews)</span>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-900">AI Trust Score</span>
                    <span className="text-2xl font-bold text-blue-600">{selectedProduct.aiTrustScore}/10</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">Based on authenticity analysis of all reviews</p>
                </div>

                <button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105"
                  onClick={() => addToCart(selectedProduct)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
            <div className="border-b">
              <div className="flex space-x-8 px-6">
                {[
                  { id: 'reviews', label: 'Reviews', count: productReviews.length },
                  { id: 'write', label: 'Write Review', count: null }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label} {tab.count !== null && `(${tab.count})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {productReviews.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg mb-4">No reviews yet for this product</p>
                      <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => setActiveTab('write')}
                      >
                        Be the first to review!
                      </button>
                    </div>
                  ) : (
                    productReviews.map((review) => (
                      <div key={review.id} className="border-b pb-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {review.user[0]}
                            </div>
                            <div>
                              <p className="font-semibold">{review.user}</p>
                              <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                            {review.verified && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="flex items-center mb-1">
                              {renderStars(review.rating)}
                            </div>
                            <div className="text-sm text-blue-600 font-medium">
                              AI Score: {review.aiScore}/10
                            </div>
                            <div className="text-xs text-gray-500">
                              +{review.points} points earned
                            </div>
                          </div>
                        </div>

                        {review.mediaType && (
                          <div className="mb-4">
                            <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                              {review.mediaType === 'video' ? (
                                <Video className="w-12 h-12 text-purple-500" />
                              ) : (
                                <Camera className="w-12 h-12 text-purple-500" />
                              )}
                              <span className="ml-2 text-purple-600 font-medium">
                                {review.mediaType === 'video' ? 'Video Review' : 'Photo Review'}
                              </span>
                            </div>
                          </div>
                        )}

                        <p className="text-gray-700 mb-4">{review.text}</p>

                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">Helpful ({review.helpful})</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'write' && (
                <div className="max-w-2xl">
                  <h3 className="text-xl font-semibold mb-4">Write a Review for {selectedProduct.name}</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      {renderStars(newReview.rating, true, (rating) => 
                        setNewReview({ ...newReview, rating })
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Add Photos/Video (Earn More Points!)</label>
                      <div className="flex space-x-4">
                        <button
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          onClick={() => {
                            setNewReview({ ...newReview, mediaType: 'image' });
                            if (fileInputRef.current) fileInputRef.current.click();
                          }}
                        >
                          <Camera className="w-4 h-4" />
                          <span>Photo (+30 pts)</span>
                        </button>
                        <button
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          onClick={() => {
                            setNewReview({ ...newReview, mediaType: 'video' });
                            if (fileInputRef.current) fileInputRef.current.click();
                          }}
                        >
                          <Video className="w-4 h-4" />
                          <span>Video (+60 pts)</span>
                        </button>
                      </div>
                      
                      {newReview.mediaFile && (
                        <div className="mt-4">
                          <img src={newReview.mediaFile} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Review</label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                        rows="4"
                        placeholder="Share your experience with this product..."
                        value={newReview.text}
                        onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                      />
                    </div>

                    <button
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                      onClick={() => {
                        if (newReview.text.trim()) {
                          const pointsEarned = newReview.mediaType === 'video' ? 60 : newReview.mediaType === 'image' ? 30 : 20;
                          setUserPoints(userPoints + pointsEarned);
                          setNewReview({ rating: 5, text: '', mediaType: null, mediaFile: null });
                          alert(`Review submitted! You earned ${pointsEarned} points!`);
                        }
                      }}
                    >
                      Submit Review
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setNewReview({ ...newReview, mediaFile: URL.createObjectURL(file) });
                      }
                    }}
                    accept="image/*,video/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ShopifyReviewApp;