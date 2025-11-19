"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    contactNumber: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // Add your registration logic here
      // Example with Supabase:
      // const { data, error } = await supabase.auth.signUp({
      //   email: formData.email,
      //   password: formData.password,
      //   options: {
      //     data: {
      //       first_name: formData.firstName,
      //       last_name: formData.lastName,
      //       username: formData.username,
      //       address: formData.address,
      //       contact_number: formData.contactNumber,
      //     }
      //   }
      // });
      // if (error) throw error;

      // For now, simulate registration
      console.log("Registration attempt with:", formData);
      
      // Redirect to login or dashboard on success
      // router.push("/login");
      
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 relative">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image 
          src="/login.jpg" 
          alt="Background" 
          fill 
          className="object-cover" 
          priority 
        />
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Register Card */}
      <Card className="w-full max-w-2xl mx-4 border-blue-100 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-purple-800">
            Create Your Account
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">Join Babita Clothing Store today!</p>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black transition"
                  placeholder="Enter first name" 
                  required 
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black transition"
                  placeholder="Enter last name" 
                  required 
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="address"
                value={formData.address} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black transition"
                placeholder="Enter your address" 
                required 
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input 
                type="tel" 
                name="contactNumber"
                value={formData.contactNumber} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black transition"
                placeholder="Enter your contact number" 
                required 
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black transition"
                placeholder="Enter your email" 
                required 
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="username"
                value={formData.username} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black transition"
                placeholder="Choose a username" 
                required 
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black transition"
                  placeholder="Create password" 
                  required 
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black transition"
                  placeholder="Confirm password" 
                  required 
                  minLength={6}
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input 
                type="checkbox" 
                required
                className="mt-1 mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                <span className="text-red-500">*</span>
              </label>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}