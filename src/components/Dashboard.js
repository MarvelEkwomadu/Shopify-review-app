import React from 'react';
import { ShoppingBag, LogOut } from 'lucide-react';

const Dashboard = ({ user, setCurrentPage, setUser }) => {
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full inline-block mb-4">
          <ShoppingBag className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome, {user?.name || "User"} 👋
        </h1>
        <p className="text-gray-600 mt-2">You are now logged in to your Shopify Review App dashboard.</p>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
