// src/app/admin/page.tsx (updated)
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStock: 0,
    totalCustomers: 0
  });

  // In a real app, you would fetch this data from your backend
  useEffect(() => {
    // Simulate fetching stats data
    setStats({
      totalSales: 12459.99,
      totalOrders: 87,
      pendingOrders: 12,
      totalProducts: 128,
      lowStock: 8,
      totalCustomers: 243
    });
  }, []);

  const recentOrders = [
    { id: 'ORD-9385', customer: 'John Smith', date: '2023-11-10', amount: 329.99, status: 'Processing' },
    { id: 'ORD-9384', customer: 'Emma Johnson', date: '2023-11-09', amount: 149.95, status: 'Shipped' },
    { id: 'ORD-9383', customer: 'Michael Brown', date: '2023-11-09', amount: 219.99, status: 'Delivered' },
    { id: 'ORD-9382', customer: 'Sophia Davis', date: '2023-11-08', amount: 499.98, status: 'Delivered' },
    { id: 'ORD-9381', customer: 'Robert Wilson', date: '2023-11-07', amount: 129.99, status: 'Delivered' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-gray-500 text-sm uppercase mb-2">TOTAL SALES</h2>
          <div className="text-2xl sm:text-3xl font-bold text-gray-800 break-words">
            ${stats.totalSales.toLocaleString()}
          </div>
          <div className="text-green-600 text-sm mt-2">+12% from last month</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-gray-500 text-sm uppercase mb-2">ORDERS</h2>
          <div className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalOrders}</div>
          <div className="text-gray-600 text-sm mt-2">{stats.pendingOrders} pending</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-gray-500 text-sm uppercase mb-2">CUSTOMERS</h2>
          <div className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalCustomers}</div>
          <div className="text-green-600 text-sm mt-2">+5% from last month</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-800">Recent Orders</h2>
          </div>
          <div className="divide-y overflow-x-auto">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium text-gray-800">{order.id}</div>
                  <div className="text-sm text-gray-600">{order.customer}</div>
                  <div className="text-xs text-gray-500">{order.date}</div>
                </div>
                <div className="sm:text-right mt-2 sm:mt-0">
                  <div className="font-medium text-gray-800">${order.amount}</div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                    order.status === 'Processing' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : order.status === 'Shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <Link href="/admin/orders" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View All Orders →
            </Link>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-800">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <Link href="/admin/products/add" className="block bg-indigo-600 text-white text-center py-3 px-4 rounded hover:bg-indigo-700 transition">
              Add New Product
            </Link>
            <Link href="/admin/products" className="block bg-white border border-gray-300 text-gray-700 text-center py-3 px-4 rounded hover:bg-gray-50 transition">
              Manage Inventory
            </Link>
            <Link href="/admin/orders" className="block bg-white border border-gray-300 text-gray-700 text-center py-3 px-4 rounded hover:bg-gray-50 transition">
              Process Orders
            </Link>
            <Link href="/admin/settings" className="block bg-white border border-gray-300 text-gray-700 text-center py-3 px-4 rounded hover:bg-gray-50 transition">
              Update Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}