// src/app/admin/orders/[id]/page.tsx
"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
};

type Order = {
  _id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
    country: string;
    notes?: string;
  };
  payment: {
    type: string;
    status: string;
  };
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        
        const data = await response.json();
        setOrder(data);
        setNewStatus(data.status);
      } catch (err: any) {
        setError(err.message || 'Error fetching order');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);
  
  const updateOrderStatus = async () => {
    if (!order || newStatus === order.status) return;
    
    try {
      setStatusUpdating(true);
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      const updatedOrder = await response.json();
      setOrder(updatedOrder);
    } catch (err: any) {
      setError(err.message || 'Error updating order status');
    } finally {
      setStatusUpdating(false);
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
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
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        <button 
          onClick={() => router.back()}
          className="ml-4 text-red-700 font-medium underline"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
        <p className="text-gray-600 mb-6">The order you are looking for does not exist.</p>
        <Link href="/admin/orders" className="text-indigo-600 hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button 
            onClick={() => router.back()}
            className="text-gray-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Orders
          </button>
          <h1 className="text-2xl font-bold mt-2">
            Order #{order._id.substring(0, 8)}
          </h1>
          <p className="text-gray-500">
            Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select 
            value={newStatus} 
            onChange={(e) => setNewStatus(e.target.value)} 
            className="border rounded px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button 
            onClick={updateOrderStatus}
            disabled={statusUpdating || newStatus === order.status}
            className={`px-4 py-2 rounded ${
              statusUpdating || newStatus === order.status
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {statusUpdating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Order Details</h2>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Order Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Payment Method</span>
              <span>
                {order.payment.type === 'cash_on_delivery' ? 'Cash on Delivery' : order.payment.type}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payment Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                order.payment.status === 'paid' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Order Items</h2>
            
            <div className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <div key={index} className="py-4 flex justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.color && `Color: ${item.color}`}
                      {item.color && item.size && ' | '}
                      {item.size && `Size: ${item.size}`}
                    </p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">€{item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Subtotal</span>
                <span>€{(order.total / 1.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Shipping</span>
                <span>
                  {(order.total / 1.2) >= 50 ? 'Free' : '€5.00'}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Tax (20% VAT)</span>
                <span>€{(order.total - (order.total / 1.2)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-200 mt-2">
                <span>Total</span>
                <span>€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Customer Information */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Customer</h2>
            
            <div className="mb-4">
              <p className="font-medium">{order.shipping.firstName} {order.shipping.lastName}</p>
              <p className="text-gray-500">{order.shipping.email}</p>
              <p className="text-gray-500">{order.shipping.phone}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
            
            <address className="not-italic text-gray-700">
              {order.shipping.firstName} {order.shipping.lastName}<br />
              {order.shipping.address}<br />
              {order.shipping.city}
              {order.shipping.postalCode ? `, ${order.shipping.postalCode}` : ''}<br />
              {order.shipping.country}
            </address>
            
            {order.shipping.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                <p className="font-medium">Notes:</p>
                <p className="text-gray-600">{order.shipping.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}