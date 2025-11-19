"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Add your authentication logic here
      // Example with Supabase:
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // });
      // if (error) throw error;

      // For now, simulate login
      console.log("Login attempt with:", email);
      
      // Redirect to dashboard on success
      // router.push("/dashboard");
      
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
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

      {/* Login Card */}
      <Card className="w-full max-w-md mx-4 border-blue-100 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-purple-800">
            Babita Clothing Store
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">Welcome back! Please login to your account</p>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black transition"
                placeholder="Enter your email" 
                required 
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black transition"
                placeholder="Enter your password" 
                required 
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-600">
                <input 
                  type="checkbox" 
                  className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold">
              Register here
            </Link>
          </p>

          <p className="text-xs text-gray-500 text-center mt-6">
            By logging in you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}