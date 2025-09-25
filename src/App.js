import React, { useState, useEffect } from 'react';
import { userAPI, vaultAPI, authUtils } from './api';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { AddPasswordScreen } from './components/AddPasswordScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { PasswordDetailScreen } from './components/PasswordDetailScreen';
import { PasswordVerificationScreen } from './components/PasswordVerificationScreen';
import { toast } from 'sonner';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [user, setUser] = useState(null);
  const [passwords, setPasswords] = useState([]);
  const [editingPassword, setEditingPassword] = useState(null);
  const [viewingPassword, setViewingPassword] = useState(null);
  const [pendingEditPassword, setPendingEditPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user's passwords with null checks and logging
  const loadPasswords = async () => {
    try {
      const response = await vaultAPI.getAllItems();
      console.log('Vault API response:', response);

      // Check response format - either response.items or response array directly
      const items = response?.items || response;
      if (!Array.isArray(items)) {
        console.error('Passwords data invalid or missing:', items);
        setPasswords([]);
        return;
      }
      
      const formattedPasswords = items.map(item => ({
        id: item._id || item.id,
        platform: item.platform,
        email: item.email || undefined,
        mobile: item.mobile_number || undefined,
        username: item.username || undefined,
        password: item.password,
        icon: getIconForPlatform(item.platform),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
      setPasswords(formattedPasswords);
    } catch (error) {
      setPasswords([]);
      console.error('Failed to load passwords:', error);
      toast.error('Failed to load your passwords');
    }
  };

  // Icon helper
  const getIconForPlatform = platformName => {
    const platform = platformName.toLowerCase();
    const iconMap = {
      gmail: "📧", email: "📧", facebook: "📘", instagram: "📷",
      twitter: "🐦", linkedin: "💼", github: "🐱", google: "🌐",
      apple: "🍎", microsoft: "🪟", amazon: "📦", netflix: "🎬",
      spotify: "🎵", youtube: "📺", dropbox: "📦", slack: "💬",
      zoom: "📹", paypal: "💳", bank: "🏦", banking: "🏦",
    };
    for (const [key, icon] of Object.entries(iconMap)) {
      if (platform.includes(key)) return icon;
    }
    return "🔐";
  };

  // Auth check on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authUtils.isAuthenticated()) {
        try {
          setLoading(true);
          const userProfile = await userAPI.getProfile();
          setUser({
            id: userProfile._id,
            name: userProfile.name,
            email: userProfile.email,
            mobile: userProfile.mobile_number
          });
          setCurrentScreen('home');
          await loadPasswords();
        } catch (error) {
          console.error('Auth check failed:', error);
          authUtils.removeToken();
          toast.error('Session expired. Please login again.');
        } finally {
          setLoading(false);
        }
      }
    };
    checkAuth();
  }, []);

  // Login handlers
  const handleLogin = async credentials => {
    try {
      setLoading(true);
      const response = await userAPI.login(credentials);
      if (response.token) {
        authUtils.setToken(response.token);
        setUser({
          id: response.user._id,
          name: response.user.name,
          email: response.user.email,
          mobile: response.user.mobile_number
        });
        setCurrentScreen('home');
        await loadPasswords();
        toast.success('Login successful!');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (email, otp) => {
    try {
      setLoading(true);
      const response = await userAPI.verifyOTP(email, otp);
      if (response.token) {
        authUtils.setToken(response.token);
        setUser({
          id: response.user._id,
          name: response.user.name,
          email: response.user.email,
          mobile: response.user.mobile_number
        });
        setCurrentScreen('home');
        await loadPasswords();
        toast.success('Login successful!');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      toast.error(error.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Registration
  const handleRegister = async userData => {
    try {
      setLoading(true);
      const response = await userAPI.register(userData);
      if (response.token) {
        authUtils.setToken(response.token);
        setUser({
          id: response.user._id,
          name: response.user.name,
          email: response.user.email,
          mobile: response.user.mobile_number
        });
        setCurrentScreen('home');
        toast.success('Registration successful!');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    authUtils.removeToken();
    setUser(null);
    setPasswords([]);
    setCurrentScreen('welcome');
    toast.success('Logged out successfully');
  };

  // Password handlers
  const handleAddPassword = async passwordData => {
    try {
      setLoading(true);
      if (editingPassword) {
        await vaultAPI.updateItem(passwordData.id, passwordData);
        toast.success('Password updated successfully!');
      } else {
        await vaultAPI.addItem(passwordData);
        toast.success('Password saved successfully!');
      }
      setEditingPassword(null);
      setCurrentScreen('home');
      await loadPasswords();
    } catch (error) {
      console.error('Password save failed:', error);
      toast.error(error.message || 'Failed to save password');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPassword = password => {
    setPendingEditPassword(password);
    setCurrentScreen('password-verification');
  };

  const handlePasswordVerified = () => {
    setEditingPassword(pendingEditPassword);
    setPendingEditPassword(null);
    setViewingPassword(null);
    setCurrentScreen('add-password');
  };

  const handleViewPassword = password => {
    setViewingPassword(password);
    setCurrentScreen('password-detail');
  };

  const handleDeletePassword = async passwordId => {
    try {
      setLoading(true);
      await vaultAPI.deleteItem(passwordId);
      toast.success('Password deleted successfully!');
      await loadPasswords();
      if (viewingPassword && viewingPassword.id === passwordId) {
        setViewingPassword(null);
        setCurrentScreen('home');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(error.message || 'Failed to delete password');
    } finally {
      setLoading(false);
    }
  };

  // Profile update handler
  const handleUpdateProfile = async updatedUser => {
    try {
      setLoading(true);
      await userAPI.updateProfile({
        name: updatedUser.name,
        email: updatedUser.email,
        mobile_number: updatedUser.mobile,
        oldPassword:updatedUser.oldPassword
      });
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Render screens based on current state
  const renderScreen = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-blue-600">Loading...</p>
          </div>
        </div>
      );
    }

    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onLogin={() => setCurrentScreen('login')}
            onRegister={() => setCurrentScreen('register')}
          />
        );
      case 'register':
        return (
          <RegistrationScreen
            onRegister={handleRegister}
            onBack={() => setCurrentScreen('welcome')}
            loading={loading}
          />
        );
      case 'login':
        return (
          <LoginScreen
            onLogin={handleLogin}
            onOTPLogin={handleOTPLogin}
            onRequestOTP={userAPI.requestOTP}
            onBack={() => setCurrentScreen('welcome')}
            loading={loading}
          />
        );
      case 'home':
        return (
          <HomeScreen
            user={user}
            passwords={passwords}
            onAddPassword={() => setCurrentScreen('add-password')}
            onViewPassword={handleViewPassword}
            onEditPassword={handleEditPassword}
            onDeletePassword={handleDeletePassword}
            onProfile={() => setCurrentScreen('profile')}
          />
        );
      case 'add-password':
        return (
          <AddPasswordScreen
            password={editingPassword}
            onSave={handleAddPassword}
            onBack={() => {
              setEditingPassword(null);
              setCurrentScreen('home');
            }}
            loading={loading}
          />
        );
      case 'password-detail':
        return (
          <PasswordDetailScreen
            password={viewingPassword}
            onBack={() => {
              setViewingPassword(null);
              setCurrentScreen('home');
            }}
            onEdit={() => {
              if (viewingPassword) {
                handleEditPassword(viewingPassword);
              }
            }}
            onDelete={() => {
              if (viewingPassword) {
                handleDeletePassword(viewingPassword.id);
              }
            }}
          />
        );
      case 'password-verification':
        return (
          <PasswordVerificationScreen
            user={user}
            onBack={() => {
              setPendingEditPassword(null);
              setCurrentScreen('password-detail');
            }}
            onVerified={handlePasswordVerified}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            user={user}
            onBack={() => setCurrentScreen('home')}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
            loading={loading}
          />
        );
      default:
        return <WelcomeScreen onLogin={() => setCurrentScreen('login')} onRegister={() => setCurrentScreen('register')} />;
    }
  };

  return <div className="min-h-screen bg-blue-50">{renderScreen()}</div>;
}
