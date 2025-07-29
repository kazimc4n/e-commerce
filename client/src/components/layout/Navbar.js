import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Atez E-commerce</h1>
          </div>
          <div className="flex space-x-4">
            <a href="/" className="hover:text-primary-200">Ana Sayfa</a>
            <a href="/products" className="hover:text-primary-200">Ürünler</a>
            <a href="/cart" className="hover:text-primary-200">Sepet</a>
            <a href="/login" className="hover:text-primary-200">Giriş</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 