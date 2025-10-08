// app/set-new-password/page.jsx
"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, ArrowLeft, RefreshCw, Eye, EyeOff, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Set New Password Page
 * User enters their new password after OTP verification
 */
export default function SetNewPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const otp = searchParams.get('otp')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!newPassword) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (newPassword.length >= 8) strength++
    if (newPassword.length >= 12) strength++
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) strength++
    if (/\d/.test(newPassword)) strength++
    if (/[^a-zA-Z0-9]/.test(newPassword)) strength++

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' }
    if (strength <= 3) return { strength, label: 'Medium', color: 'bg-yellow-500' }
    return { strength, label: 'Strong', color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength()

  // Redirect if no email or OTP
  useEffect(() => {
    if (!email || !otp) {
      toast.error('Missing verification parameters')
      router.push('/forgot-password')
    }
  }, [email, otp, router])

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault()

    // Validation
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Password reset successfully! 🎉')
        setTimeout(() => {
          router.push('/login?reset=true')
        }, 1500)
      } else {
        toast.error(data.message || 'Failed to reset password')
        
        // If OTP is invalid/expired, go back to reset password page
        if (data.message?.toLowerCase().includes('invalid') || 
            data.message?.toLowerCase().includes('expired')) {
          setTimeout(() => {
            router.push(`/reset-password?email=${encodeURIComponent(email)}`)
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Set New Password
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Create a strong password for<br />
            <span className="font-semibold text-gray-900">{email}</span>
          </p>

          {/* Form */}
          <form onSubmit={handleResetPassword}>
            {/* New Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength <= 2 ? 'text-red-600' :
                      passwordStrength.strength <= 3 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="mt-2 flex items-center">
                  {newPassword === confirmPassword ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600 mr-1.5" />
                      <span className="text-xs text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <span className="text-xs text-red-600">Passwords do not match</span>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Resetting Password...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Password Requirements */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-900 font-medium mb-2">
              🔒 Password Requirements:
            </p>
            <ul className="text-xs text-purple-800 space-y-1">
              <li className={newPassword.length >= 8 ? 'text-green-700' : ''}>
                • At least 8 characters
              </li>
              <li className={/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? 'text-green-700' : ''}>
                • Mix of uppercase and lowercase letters
              </li>
              <li className={/\d/.test(newPassword) ? 'text-green-700' : ''}>
                • At least one number
              </li>
              <li className={/[^a-zA-Z0-9]/.test(newPassword) ? 'text-green-700' : ''}>
                • Special character recommended
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}