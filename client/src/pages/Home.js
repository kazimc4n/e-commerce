import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Atez Software Technologies
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-8">
            E-commerce Platform
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Modern, full-stack e-commerce platform built with Node.js, PostgreSQL, and React.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Backend API</h3>
              <p className="text-gray-600">Node.js + Express + PostgreSQL</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Frontend</h3>
              <p className="text-gray-600">React + Tailwind CSS</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">DevOps</h3>
              <p className="text-gray-600">Docker + Nginx</p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">API Status</h3>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md inline-block">
              Server is running on port 3001
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 