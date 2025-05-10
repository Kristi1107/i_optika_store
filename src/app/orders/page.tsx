// src/app/orders/page.tsx
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Order {
  _id: string;
  items: any[];
  shipping: any;
  payment: any;
  total: number;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      
      // Redirect to login if unauthorized
      if (response.status === 401) {
        router.push('/login?redirect=/orders');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">My Orders</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">My Orders</h1>
        
        {error && (
          <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-6">
            {error}
          </div>
        )}
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-medium text-black mb-4">You haven't placed any orders yet</h2>
            <p className="text-black mb-6">
              Once you place an order, you'll be able to track it here.
            </p>
            <Link href="/products" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="border-b border-gray-200 bg-gray-50 p-4 sm:px-6 sm:py-5">
                  <div className="flex justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-medium text-black">
                        Order #{order._id.substring(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="px-4 py-5 sm:p-6">
                  <div className="divide-y divide-gray-200">
                    {order.items.map((item, i) => (
                      <div key={i} className="py-4 flex items-center">
                        <div className="h-16 w-16 bg-gray-200 rounded-md overflow-hidden mr-4">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <span className="text-xs text-gray-500">No image</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-black">{item.name}</h4>
                          <div className="text-sm text-gray-500">
                            {item.color && <span>Color: {item.color} | </span>}
                            {item.size && <span>Size: {item.size} | </span>}
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-medium text-black">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6 bg-gray-50">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-black">Subtotal</span>
                    <span className="text-sm font-medium text-black">
                      ${(order.total * 0.9).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-black">Shipping</span>
                    <span className="text-sm font-medium text-black">
                      ${(order.total * 0.02).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-black">Tax</span>
                    <span className="text-sm font-medium text-black">
                      ${(order.total * 0.08).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                    <span className="text-base font-medium text-black">Total</span>
                    <span className="text-base font-bold text-black">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {/* Order Actions */}
                <div className="border-t border-gray-200 px-4 py-4 sm:px-6 flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium text-black">Shipping Address:</span>
                    <span className="text-gray-600 ml-2">
                      {order.shipping.address}, {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
                    </span>
                  </div>
                  
                  <div>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}