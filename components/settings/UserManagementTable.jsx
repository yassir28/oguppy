// components/settings/UserManagementTable.jsx
"use client"

import React, { useState } from 'react'
import { Pencil, Trash2, Shield, User, Package, Tag, Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

/**
 * User Management Table Component
 * Displays all users with ability to edit roles and delete users
 */
export default function UserManagementTable({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Role options for the dropdown
  const roleOptions = [
    { value: "USER", label: "User", icon: User, color: "text-blue-600" },
    { value: "ITEM_MANAGER", label: "Item Manager", icon: Package, color: "text-green-600" },
    { value: "BRAND_MANAGER", label: "Brand Manager", icon: Tag, color: "text-orange-600" },
    { value: "ADMIN", label: "Administrator", icon: Shield, color: "text-purple-600" },
  ];

  // Get role badge styling
  const getRoleBadge = (role) => {
    const roleConfig = {
      USER: { bg: "bg-blue-100", text: "text-blue-800", label: "User" },
      ITEM_MANAGER: { bg: "bg-green-100", text: "text-green-800", label: "Item Manager" },
      BRAND_MANAGER: { bg: "bg-orange-100", text: "text-orange-800", label: "Brand Manager" },
      ADMIN: { bg: "bg-purple-100", text: "text-purple-800", label: "Administrator" },
    };
    
    const config = roleConfig[role] || roleConfig.USER;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Start editing a user's role
  const startEditing = (userId, currentRole) => {
    setEditingUserId(userId);
    setSelectedRole(currentRole);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingUserId(null);
    setSelectedRole("");
  };

  // Save role change
  const saveRoleChange = async (userId) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: selectedRole } : user
        ));
        
        toast.success("User role updated successfully");
        setEditingUserId(null);
        router.refresh();
      } else {
        toast.error(data.message || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to delete user: ${userEmail}?`)) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        // Remove user from local state
        setUsers(users.filter(user => user.id !== userId));
        toast.success("User deleted successfully");
        router.refresh();
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Joined
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              {/* User Name */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {user.image ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.image}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {user.name?.charAt(0) || user.email?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name || "No name"}
                    </div>
                  </div>
                </div>
              </td>

              {/* Email */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
              </td>

              {/* Role */}
              <td className="px-6 py-4 whitespace-nowrap">
                {editingUserId === user.id ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    
                    {/* Save Button */}
                    <button
                      onClick={() => saveRoleChange(user.id)}
                      disabled={loading}
                      className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                      title="Save"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    
                    {/* Cancel Button */}
                    <button
                      onClick={cancelEditing}
                      disabled={loading}
                      className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  getRoleBadge(user.role)
                )}
              </td>

              {/* Joined Date */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  {/* Edit Role Button */}
                  {editingUserId !== user.id && (
                    <button
                      onClick={() => startEditing(user.id, user.role)}
                      disabled={loading}
                      className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                      title="Edit Role"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteUser(user.id, user.email)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
          <p className="mt-1 text-sm text-gray-500">
            No users found in the system.
          </p>
        </div>
      )}
    </div>
  );
}