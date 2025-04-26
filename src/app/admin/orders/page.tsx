// src/app/admin/orders/page.tsx
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  date: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch orders (in a real app, this would be an API call)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: 'ORD-9385',
          customer: {
            name: 'John Smith',
            email: 'john.smith@example.com'
          },
          date: '2023-11-10',
          amount: 329.99,
          status: 'processing',
          items: [
            { id: 'frame-4', name: 'Gucci Aviator Collection', quantity: 1, price: 279.99 },
            { id: 'accessory-1', name: 'Premium Glasses Case', quantity: 1, price: 29.99 }
          ]
        },
        {
          id: 'ORD-9384',
          customer: {
            name: 'Emma Johnson',
            email: 'emma.j@example.com'
          },
          date: '2023-11-09',
          amount: 149.95,
          status: 'shipped',
          items: [
            { id: 'frame-5', name: 'Warby Parker Square Frames', quantity: 1, price: 149.95 }
          ]
        },
        {
          id: 'ORD-9383',
          customer: {
            name: 'Michael Brown',
            email: 'michael.b@example.com'
          },
          date: '2023-11-09',
          amount: 219.99,
          status: 'delivered',
          items: [
            { id: 'frame-2', name: 'Oakley Rectangle Frames', quantity: 1, price: 199.99 },
            { id: 'accessory-1', name: 'Premium Glasses Case', quantity: 1, price: 29.99 }
          ]
        },
        {
          id: 'ORD-9382',
          customer: {
            name: 'Sophia Davis',
            email: 'sophia.d@example.com'
          },
          date: '2023-11-08',
          amount: 499.98,
          status: 'delivered',
          items: [
            { id: 'frame-6', name: 'Tom Ford Premium Frames', quantity: 1, price: 399.99 },
            { id: 'accessory-1', name: 'Premium Glasses Case', quantity: 1, price: 29.99 },
            { id: 'contact-1', name: 'Acuvue Oasys Daily Contacts', quantity: 1, price: 79.99 }
          ]
        },
        {
          id: 'ORD-9381',
          customer: {
            name: 'Robert Wilson',
            email: 'robert.w@example.com'
          },
          date: '2023-11-07',
          amount: 129.99,
          status: 'cancelled',
          items: [
            { id: 'frame-5', name: 'Warby Parker Square Frames', quantity: 1, price: 129.99 }
          ]
        }
      ];
      
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter orders based on status and search
  useEffect(() => {
    let result = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply search filter (search by order ID or customer name/email)
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        order => 
          order.id.toLowerCase().includes(searchLower) ||
          order.customer.name.toLowerCase().includes(searchLower) ||
          order.customer.email.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredOrders(result);
  }, [orders, statusFilter, search]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    // In a real app, you would call your API to update the order status
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm text-gray-600 mb-1">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search by order ID, customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Orders */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-indigo-600">{order.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.customer.name}</div>
                  <div className="text-sm text-gray-500">{order.customer.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${order.amount.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{order.items.length} items</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    View
                  </Link>
                  
                  {order.status !== 'cancelled' && (
                    <select
                      className="border border-gray-300 rounded text-sm"
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}