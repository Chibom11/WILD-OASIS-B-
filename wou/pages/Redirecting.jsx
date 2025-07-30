import React from 'react';

function Redirecting() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-700">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
      <p className="text-xl font-medium">Redirecting...</p>
    </div>
  );
}

export default Redirecting;
