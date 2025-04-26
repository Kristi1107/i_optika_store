"use client"

import { useState } from "react";
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, cartTotal } = useCart();
    const [couponCode, setCouponCode] = useState('');

    if (items.length === 0) {
        return(
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl font-bold text-black mb-6">Your Cart</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-xl text-black mb-6">Your Cart is empty</p>
                        <Link href="/products" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-black mb-8">Your Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="divide-y divide-gray-200">
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.color}-${item.size}`} className="p-6 flex flex-col sm:flex-row">
                                        <div className="sm:w-24 sm:h-24 bg-gray-200 rounded-lg flex-shrink-0 mb-4 sm:mb-0">
                                            {/* Replace with actual product image */}
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-gray-400 text-xs">[Product Image]</span>
                                            </div>
                                        </div>
                                        <div className="sm:ml-6 sm:flex-1">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-black">{item.name}</h3>
                                                    <div className="mt-1 text-sm text-black">
                                                        {item.color && <span className="mr-4">Color: {item.color}</span>}
                                                        {item.size && <span>Size: {item.size}</span>}
                                                    </div>
                                                </div>
                                                <p className="text-lg font-medium text-black">${item.price}</p>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center border border-gray-300 rounded">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="px-3 py-1 bg-gray-100"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-3 py-1 bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-sm text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between">
                            <Link href="/products" className="text-indigo-600 hover:text-indigo-800">
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Sumary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-medium text-black mb-6">Order Summary</h2>

                            <div className="space-y-4">
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

                                {/* Coupon Code */}
                                <div className="pt-2">
                                    <label htmlFor="coupon" className="block text-sm text-black mb-2">
                                        Coupon Code
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            id="coupon"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            className="flex-1 border border-gray-300 rounded-l px-4 py-2 text-black"
                                            placeholder="Enter code"
                                        />
                                        <button className="bg-gray-200 text-black px-4 py-2 rounded-r border-y border-r border-gray-300">
                                            Apply
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-medium text-black">Total</span>
                                        <span className="text-lg font-bold text-black">
                                            ${(cartTotal + (cartTotal >= 100 ? 0 : 10)).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
                                <Link href="/checkout" className="w-full mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
                                    Proceed to Checkout
                                </Link>
                            </button>

                            <div className="mt-6 text-center space-y-2">
                                <div className="flex items-center justify-center text-sm text-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-indigo-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                    Secure checkout
                                </div>
                                <div className="flex items-center justify-center text-sm text-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-indigo-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                    Free shipping over $100
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}