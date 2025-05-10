// src/app/checkout/page.tsx (updated)
"use client"

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Albania',
    paymentMethod: 'cash',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderEmail, setOrderEmail] = useState('');
  
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
            <p className="text-md text-black mb-4">
              We've sent a confirmation email to <span className="font-medium">{orderEmail}</span>
            </p>
            <p className="text-md text-black mb-8">
              Your order will be delivered to the specified address within 2-3 business days. You will pay {orderTotal.toFixed(2)}€ in cash upon delivery.
            </p>
            <Link href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const calculateSubtotal = () => {
    return cartTotal;
  };
  
  const calculateShipping = () => {
    return cartTotal >= 50 ? 0 : 5;
  };
  
  const calculateTax = () => {
    return cartTotal * 0.2; // 20% VAT in Albania
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const finalTotal = calculateTotal();
      
      // Create order in database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shipping: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
            notes: formData.notes
          },
          payment: {
            type: 'cash_on_delivery',
            status: 'pending'
          },
          total: finalTotal,
          sendEmail: true // Flag to trigger email sending
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create order');
      }
      
      // Store total and email for confirmation page
      setOrderTotal(finalTotal);
      setOrderEmail(formData.email);
      
      // Clear the cart
      clearCart();
      
      // Show confirmation
      setFormSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Error creating order:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Rest of your checkout form */}
      {/* ... */}
    </div>
  );
}