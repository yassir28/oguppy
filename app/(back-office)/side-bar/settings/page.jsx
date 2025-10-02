// app/(back-office)/side-bar/settings/page.jsx

import prisma from '@/lib/prisma'
import { Settings as SettingsIcon } from 'lucide-react'
import React from 'react'
import { requireAdminServer } from '@/lib/auth/serverPageProtection';
import UserManagementTable from '@/components/settings/UserManagementTable';

/**
 * Settings Page - Admin Only
 * Manage users and their roles/permissions
 */
export default async function Settings() {
  // Require ADMIN access
  await requireAdminServer();

  // Fetch all users from database
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (

    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-gray-700" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage users, roles, and permissions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Management Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">
              User Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              View and manage user accounts and their access levels
            </p>
          </div>

          <div className="p-6">
            <UserManagementTable users={users} />
          </div>
        </div>

        {/* Role Information Card */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Role Permissions
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* USER */}
            <div className="bg-white rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">User</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ View inventory</li>
                <li>✓ View reports</li>
                <li>✗ No create/edit/delete</li>
              </ul>
            </div>

            {/* ITEM_MANAGER */}
            <div className="bg-white rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Item Manager</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Manage items</li>
                <li>✓ Manage inventory</li>
                <li>✓ Manage warehouses</li>
                <li>✗ Cannot manage brands</li>
              </ul>
            </div>

            {/* BRAND_MANAGER */}
            <div className="bg-white rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Brand Manager</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Manage brands</li>
                <li>✓ Manage categories</li>
                <li>✓ Manage units</li>
                <li>✗ Cannot manage items</li>
              </ul>
            </div>

            {/* ADMIN */}
            <div className="bg-white rounded p-4 border-2 border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Administrator</h4>
              <ul className="text-sm text-purple-600 space-y-1">
                <li>✓ Full system access</li>
                <li>✓ Manage users</li>
                <li>✓ All permissions</li>
                <li>✓ System settings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}