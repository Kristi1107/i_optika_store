// src/app/components/Header.tsx
"use client"

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">i Optika</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/products?category=eyeglasses" className="text-black hover:text-indigo-600">
              EyeGlasses
            </Link>
            <Link href="/products?category=sunglasses" className="text-black hover:text-indigo-600">
              Sunglasses
            </Link>
            <Link href="/products?category=contact-lenses" className="text-black hover:text-indigo-600">
              Contact Lenses
            </Link>
            <Link href="/products?category=accessories" className="text-black hover:text-indigo-600">
              Accessories
            </Link>
          </nav>

          {/* Right Menu (Search, Cart, Account) */}
          <div className="flex items-center space-x-4">
            <button className="text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            
            <Link href="/cart" className="text-black relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs">
                  {itemCount}
                </span>
              )}
            </Link>
            
            <button className="text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </button>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-black"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/products?category=eyeglasses" 
                className="text-black hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                EyeGlasses
              </Link>
              <Link 
                href="/products?category=sunglasses" 
                className="text-black hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sunglasses
              </Link>
              <Link 
                href="/products?category=contact-lenses" 
                className="text-black hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Lenses
              </Link>
              <Link 
                href="/products?category=accessories" 
                className="text-black hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accessories
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}