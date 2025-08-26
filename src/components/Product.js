import React, { useState, useRef } from 'react';
import { 
  Star, Camera, Video, ThumbsUp, ShoppingCart, Check, Award 
} from 'lucide-react';

const Product = ({ selectedProduct, setCurrentPage, cart, setCart }) => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [newReview, setNewReview] = useState({ 
    rating: 5, 
    text: '', 
    mediaType: null, 
    mediaFile: null 
  });
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [userPoints, setUserPoints] = useState(245);
  const fileInputRef = useRef(null);

  const reviews = {
    1: [{
      id: 1, 
      user: 'Sarah M.', 
      rating: 5, 
      date: '2024-08-15',
      text: 'Amazing quality! The fabric feels premium.',
      mediaType: 'video', 
      verified: true, 
      helpful: 23, 
      points: 50, 
      aiScore: 9.2
    }],
    2: [{
      id: 2, 
      user: 'Emma L.', 
      rating: 5, 
      date: '2024-08-08',
      text: 'Perfect for workouts! Great quality.',
      mediaType: 'image', 
      verified: true, 
      helpful: 31, 
      points: 60, 
      aiScore: 9.5
    }]
  };

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

  const productReviews = reviews[selectedProduct.id] || [];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Cart Notification */}
      {showCartNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-bounce">
          <Check className="w-5 h-5" />
          <span>Added to cart! 🛒</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6">
        {/* Back Button */}
        <button
          className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium"
          onClick={() => setCurrentPage('dashboard')}
        >
          ← Back to Products
        </button>

        {/* Product Section */}
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
                Add to Cart 🛒
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
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
                        alert(`🎉 Review submitted! You earned ${pointsEarned} points!`);
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
};

export default Product;