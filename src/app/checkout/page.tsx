// src/app/checkout/page.tsx
"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    cardName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  if (items.length === 0 && !formSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-black mb-6">Checkout</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-xl text-black mb-6">Your cart is empty</p>
            <Link href="/products" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h1 className="text-3xl font-bold text-black mb-4">Order Confirmed!</h1>
            <p className="text-lg text-black mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
            <p className="text-md text-black mb-8">
              We've sent a confirmation email to <span className="font-medium">{formData.email}</span>
            </p>
            <Link href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the order to your backend
    console.log('Order submitted:', { formData, items, total: cartTotal });
    
    // Clear the cart
    clearCart();
    
    // Show confirmation
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-black mb-6 border-b pb-2">Customer Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 mb-8">
                <div>
                  <label htmlFor="firstName" className="block text-sm text-black mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm text-black mb-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm text-black mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                  />
                </div>
              </div>
              
              <h2 className="text-lg font-medium text-black mb-6 border-b pb-2">Shipping Address</h2>
              
              <div className="grid grid-cols-1 gap-y-6 mb-8">
                <div>
                  <label htmlFor="address" className="block text-sm text-black mb-1">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm text-black mb-1">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm text-black mb-1">State / Province</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zip" className="block text-sm text-black mb-1">ZIP / Postal Code</label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      required
                      value={formData.zip}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm text-black mb-1">Country</label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <h2 className="text-lg font-medium text-black mb-6 border-b pb-2">Payment Information</h2>
              
              <div className="grid grid-cols-1 gap-y-6 mb-8">
                <div>
                  <label htmlFor="cardName" className="block text-sm text-black mb-1">Name on Card</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    required
                    value={formData.cardName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                  />
                </div>
                <div>
                  <label htmlFor="cardNumber" className="block text-sm text-black mb-1">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    required
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="expMonth" className="block text-sm text-black mb-1">Exp. Month</label>
                    <input
                      type="text"
                      id="expMonth"
                      name="expMonth"
                      required
                      value={formData.expMonth}
                      onChange={handleChange}
                      placeholder="MM"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="expYear" className="block text-sm text-black mb-1">Exp. Year</label>
                    <input
                      type="text"
                      id="expYear"
                      name="expYear"
                      required
                      value={formData.expYear}
                      onChange={handleChange}
                      placeholder="YYYY"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm text-black mb-1">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      required
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mt-8">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-black">
                  I agree to the <a href="#" className="text-indigo-600 hover:underline">terms and conditions</a>
                </label>
              </div>
              
              <div className="mt-8">
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-black mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.color}-${item.size}`} className="flex justify-between text-black text-sm">
                    <div className="flex-1">
                      <span className="font-medium">{item.name}</span>
                      <span className="block text-gray-600">
                        {item.color && `${item.color}, `}
                        {item.size && `${item.size}`}
                        {` × ${item.quantity}`}
                      </span>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-black">Subtotal</span>
                  <span className="text-black font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-black">Shipping</span>
                  <span className="text-black font-medium">
                    {cartTotal >= 100 ? 'Free' : '$10.00'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-black">Tax</span>
                  <span className="text-black font-medium">
                    ${(cartTotal * 0.0875).toFixed(2)}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-black">Total</span>
                    <span className="text-lg font-bold text-black">
                      ${(cartTotal + (cartTotal >= 100 ? 0 : 10) + (cartTotal * 0.0875)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center text-sm text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-indigo-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  Secure checkout
                </div>
                <div className="flex items-center text-sm text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-indigo-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  Free shipping over $100
                </div>
                <div className="flex items-center text-sm text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-indigo-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                  </svg>
                  30-day easy returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}