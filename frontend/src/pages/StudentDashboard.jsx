import { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Badge } from '../components'
import { useAuth } from '../context/AuthContext'

export default function StudentDashboard() {
  const { user } = useAuth()

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title="My Dashboard" />

        <main className="container py-8">
          {/* Welcome Card */}
          <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
              <p className="opacity-90">Here's your hostel information and updates</p>
            </div>
          </Card>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Roll Number</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{user?.rollNumber || 'N/A'}</p>
            </Card>

            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Semester</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{user?.semester || 'N/A'}</p>
            </Card>

            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Room Number</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{user?.roomNumber || 'Not Allocated'}</p>
            </Card>
          </div>

          {/* Contact & Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user?.phone || 'Not provided'}</p>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">My Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Fee Status</span>
                  <Badge status="paid" label="Paid" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Room Allocation</span>
                  <Badge status="occupied" label="Allocated" />
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Links */}
          <Card className="mt-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="/complaints" className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400">View Complaints</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track your complaints</p>
              </a>
              <a href="/notices" className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <p className="font-semibold text-purple-600 dark:text-purple-400">Read Notices</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Latest announcements</p>
              </a>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
