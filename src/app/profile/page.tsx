'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const { user, isAuthenticated, fetchProfile, logout, isLoading } = useAuthContext()
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [error, setError] = useState('')
  const [isMapExpanded, setIsMapExpanded] = useState(false)

  const loadProfile = useCallback(async () => {
    setIsLoadingProfile(true)
    setError('')

    try {
      const result = await fetchProfile()
      if (!result.success) {
        setError(result.error || 'Failed to load profile')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoadingProfile(false)
    }
  }, [fetchProfile])

  useEffect(() => {
    if (isAuthenticated && !user) {
      loadProfile()
    }
  }, [isAuthenticated, user, loadProfile])

  const handleLogout = async () => {
    await logout()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please login to view your profile</p>
          <Link href="/login">
            <Button className="bg-primary text-white px-6 py-2 rounded-lg">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoadingProfile || (!user && !error)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={loadProfile} className="bg-primary text-white px-6 py-2 rounded-lg">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Background blur blobs */}
      <div className="absolute -left-100 top-0 z-0">
        <Image
          src="/landing_page/blur blob.svg"
          alt=""
          width={1000}
          height={1000}
        />
      </div>
      <div className="absolute -right-100 top-0 z-0">
        <Image
          src="/landing_page/blur blob.svg"
          alt=""
          width={1000}
          height={1000}
          className="rotate-180"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10 space-y-6">

        {/* Breadcrumbs */}
        <div className="mb-4">
          <div className="inline-flex items-center space-x-2 text-sm text-white bg-secondary rounded-md px-3 py-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              <Link href="/" className="text-white hover:text-gray-200 transition-colors">
                Home
              </Link>
            </div>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
            <span className="text-white font-medium">Profile</span>
          </div>
        </div>

        {/* Card 1: Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-12 gap-6 items-center">
            {/* Profile Image Column */}
            <div className="col-span-3 flex justify-end">
              <div className="w-32 h-32 rounded-full bg-white shadow-lg overflow-hidden">
                {user?.profile_picture ? (
                  <Image
                    src={user.profile_picture}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info Column */}
            <div className="col-span-9 flex flex-col justify-center space-y-3">
              <p className="text-lg text-gray-600 font-medium">Profile</p>
              <h1 className="text-4xl font-bold text-primary">{user?.username || 'User Name'}</h1>
              <div className="inline-block">
                <span className="bg-gradient-to-r from-[#04BB84] to-[#FFE51C] text-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-2 w-fit">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {user?.is_agent ? 'Agent' : 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Location with Google Maps */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">My Location</h2>
              <Image
                src="/profile_page/my location icon.svg"
                alt="Location Icon"
                width={40}
                height={40}
              />
            </div>
            <p className="text-gray-600 text-lg">
              {user?.alamat || 'Address not provided'}
            </p>
          </div>

          {/* Google Maps Embed */}
          {user?.latitude && user?.longitude ? (
            <div className="relative">
              <div 
                className={`w-full rounded-lg overflow-hidden shadow-md transition-all duration-700 ease-in-out ${
                  isMapExpanded ? 'h-[60vh]' : 'h-64'
                }`}
              >
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&q=${user.latitude},${user.longitude}&zoom=15&maptype=roadmap`}
                />
              </div>
              
              {/* Expand/Collapse Button */}
              <button
                onClick={() => setIsMapExpanded(!isMapExpanded)}
                className="absolute top-4 right-4 bg-secondary hover:bg-[#FFE51C] text-white hover:text-gray-800 rounded-lg p-1 shadow-lg transition-all duration-300 hover:shadow-xl z-10 group cursor-pointer"
                aria-label={isMapExpanded ? "Collapse map" : "Expand map"}
              >
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isMapExpanded ? 'rotate-180' : 'rotate-0'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isMapExpanded ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  )}
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Location coordinates not available</p>
            </div>
          )}
        </div>

        {/* Card 3: Details - Grid Layout */}
        <div className="grid grid-cols-12 gap-6 justify-center">
          {/* Left Column - Stats Cards */}
          <div className="col-span-4 space-y-4 flex flex-col items-center">
            {/* Total Volume Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full text-center">
              <div className="flex items-center justify-center gap-2">
                <p className="text-gray-600 font-medium">Total Volume</p>
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-black text-center">15.7 L</h3>
              <p className="font-small text-gray-500 text-center">Recycled this month</p>
            </div>

            {/* Total Earnings Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full text-center">
              <div className="flex items-center justify-center gap-2">
                <p className="text-gray-600 font-medium">Total Earnings</p>
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-black text-center">Rp 150.000</h3>
              <p className="font-small text-gray-500 text-center">Earned from recycling</p>
            </div>

            {/* E-Wallet Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full text-center">
              <div className="flex items-center justify-center gap-2">
                <p className="text-gray-600 font-medium">E-Wallet</p>
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-black text-center">Rp {user?.wallet ? parseFloat(user.wallet).toLocaleString('id-ID') : '0'}</h3>
              <p className="font-small text-gray-500 text-center">Top Up Money</p>
            </div>
          </div>

          {/* Right Column - User Details */}
          <div className="col-span-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full relative">
              <div className="flex flex-col space-y-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Email</label>
                  <div className="text-gray-700 bg-gray-100 p-3 rounded-lg">
                    {user?.email || 'Not provided'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Phone Number</label>
                  <div className="text-gray-700 bg-gray-100 p-3 rounded-lg">
                    {user?.phone_number || 'Not provided'}
                  </div>
                </div>
              </div>

              {/* Action Buttons in bottom right */}
              <div className="absolute bottom-6 right-6 flex space-x-3">
                <Button className="bg-[#04BB84] hover:bg-[#039970] text-white px-4 py-2 rounded-lg text-sm">
                  Edit Details
                </Button>
                <Button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}