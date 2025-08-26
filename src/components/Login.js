import React from 'react';

function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-3xl font-bold text-purple-600 mb-6">Login</h2>
      <form className="flex flex-col gap-4 w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
        <input type="email" placeholder="Email" className="p-3 border rounded" />
        <input type="password" placeholder="Password" className="p-3 border rounded" />
        <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover-scale-105 hover-shadow-xl transition-all">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
