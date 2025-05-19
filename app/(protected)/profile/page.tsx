"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const Profile = () => {
  const { user, loading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    displayName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      displayName: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    if (!formData.displayName) {
      newErrors.displayName = 'Name is required';
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (editMode && formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
        valid = false;
      }

      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
        valid = false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    try {
      // Update display name if changed
      if (user.displayName !== formData.displayName) {
        await updateProfile(user, { displayName: formData.displayName });
      }

      // Update email if changed
      if (user.email !== formData.email) {
        await updateEmail(user, formData.email);
      }

      // Update password if provided
      if (formData.newPassword) {
        const credential = EmailAuthProvider.credential(
          user.email || '',
          formData.currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, formData.newPassword);
      }

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditMode(false);
    } catch (error: any) {
      console.error('Update error:', error);
      if (error.code === 'auth/wrong-password') {
        setErrors(prev => ({
          ...prev,
          currentPassword: 'Incorrect password'
        }));
      } else if (error.code === 'auth/requires-recent-login') {
        setErrors(prev => ({
          ...prev,
          currentPassword: 'Please reauthenticate to update email/password'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          currentPassword: 'Error updating profile. Please try again.'
        }));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 max-w-md w-full bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Not Logged In</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your profile.</p>
          <a
            href="/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-primary-blue px-6 py-8 sm:px-10 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white text-4xl font-bold">
                    {user.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {editMode && (
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-blue" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-700">
                  {editMode ? (
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-md px-3 py-1 text-gray-700 placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 "
                      placeholder="Your name"
                    />
                  ) : (
                    user.displayName || 'User'
                  )}
                </h1>
                {errors.displayName && (
                  <p className="text-red-200 text-sm mt-1">{errors.displayName}</p>
                )}
                <p className="text-gray-700 text-opacity-90 mt-1">
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-md px-3 py-1 text-gray-700 placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                      placeholder="your@email.com"
                    />
                  ) : (
                    user.email
                  )}
                </p>
                {errors.email && (
                  <p className="text-red-200 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-8 sm:px-10">
            {successMessage && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                {successMessage}
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <p className="mt-1 text-sm text-gray-600">
                    {new Date(user.metadata.creationTime || '').toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Sign In</label>
                  <p className="mt-1 text-sm text-gray-600">
                    {new Date(user.metadata.lastSignInTime || '').toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {editMode && (
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm"
                    />
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm"
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue sm:text-sm"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              {editMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setErrors({
                        displayName: '',
                        email: '',
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;