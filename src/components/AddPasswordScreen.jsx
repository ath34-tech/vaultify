import React, { useState, useEffect } from "react";
import { Button } from "../frontpart/button";
import { Input } from "../frontpart/input";
import { Label } from "../frontpart/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../frontpart/card";
import {
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  User,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from 'sonner';

export function AddPasswordScreen({
  password,
  onSave,
  onBack,
  loading
}) {
  const [formData, setFormData] = useState({
    platform: "",
    email: "",
    mobile: "",
    username: "",
    password: "",
    icon: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (password) {
      setFormData({
        platform: password.platform,
        email: password.email || "",
        mobile: password.mobile || "",
        username: password.username || "",
        password: password.password,
        icon: password.icon || "",
      });
    }
  }, [password]);

  const getIconForPlatform = (platformName) => {
    const platform = platformName.toLowerCase();
    const iconMap = {
      gmail: "📧",
      email: "📧",
      facebook: "📘",
      instagram: "📷",
      twitter: "🐦",
      linkedin: "💼",
      github: "🐱",
      google: "🌐",
      apple: "🍎",
      microsoft: "🪟",
      amazon: "📦",
      netflix: "🎬",
      spotify: "🎵",
      youtube: "📺",
      dropbox: "📦",
      slack: "💬",
      zoom: "📹",
      paypal: "💳",
      bank: "🏦",
      banking: "🏦",
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (platform.includes(key)) {
        return icon;
      }
    }
    return "🔐";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.platform.trim())
      newErrors.platform = "Platform name is required";
    if (!formData.password.trim())
      newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const passwordData = {
        id: password?.id || Date.now().toString(),
        platform: formData.platform,
        email: formData.email || undefined,
        mobile: formData.mobile || undefined,
        username: formData.username || undefined,
        password: formData.password,
        icon: formData.icon || getIconForPlatform(formData.platform),
      };
      
      await onSave(passwordData);
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-suggest icon when platform changes
      if (field === "platform" && value && !prev.icon) {
        updated.icon = getIconForPlatform(value);
      }
      return updated;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-2"
            disabled={loading}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-blue-900">
            {password ? "Edit Password" : "Add New Password"}
          </h1>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-blue-900">
              {password ? "Update Account" : "Save New Account"}
            </CardTitle>
            <p className="text-blue-600">
              Securely store your login details
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="platform"
                  className="flex items-center gap-2 text-blue-800"
                >
                  <Globe className="w-4 h-4" />
                  Platform / Website
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="platform"
                    type="text"
                    value={formData.platform}
                    onChange={(e) =>
                      updateFormData("platform", e.target.value)
                    }
                    className="flex-1 h-12 bg-blue-50 border-blue-200 focus:border-blue-500"
                    placeholder="e.g., Gmail, Facebook, Bank"
                    disabled={loading}
                  />
                  <Input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      updateFormData("icon", e.target.value)
                    }
                    className="w-16 h-12 bg-blue-50 border-blue-200 text-center"
                    placeholder="🔐"
                    maxLength={2}
                    disabled={loading}
                  />
                </div>
                {errors.platform && (
                  <p className="text-red-500 text-sm">
                    {errors.platform}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-blue-800"
                >
                  <Mail className="w-4 h-4" />
                  Email (Optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    updateFormData("email", e.target.value)
                  }
                  className="h-12 bg-blue-50 border-blue-200 focus:border-blue-500"
                  placeholder="your.email@example.com"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="mobile"
                  className="flex items-center gap-2 text-blue-800"
                >
                  <Phone className="w-4 h-4" />
                  Mobile Number (Optional)
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) =>
                    updateFormData("mobile", e.target.value)
                  }
                  className="h-12 bg-blue-50 border-blue-200 focus:border-blue-500"
                  placeholder="+1 234 567 8900"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="flex items-center gap-2 text-blue-800"
                >
                  <User className="w-4 h-4" />
                  Username (Optional)
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    updateFormData("username", e.target.value)
                  }
                  className="h-12 bg-blue-50 border-blue-200 focus:border-blue-500"
                  placeholder="your_username"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="flex items-center gap-2 text-blue-800"
                >
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      updateFormData("password", e.target.value)
                    }
                    className="h-12 bg-blue-50 border-blue-200 focus:border-blue-500 pr-20"
                    placeholder="Enter password"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 text-blue-600"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {password ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  password ? "Update Password" : "Save Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}