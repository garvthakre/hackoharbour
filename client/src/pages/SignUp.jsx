import React from 'react'
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";

const SignUp = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
    });
  
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
  
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      setError(""); // Clear error when user types
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");
  
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          localStorage.setItem("token", data.token); // Store token in localStorage
          navigate("/rag");
        } else {
          setError(data.message || "Signup failed. Please try again.");
        }
      } catch (error) {
        console.error("Error signing up:", error);
        setError("Connection error. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="container mx-auto px-4 py-10">
          {/* Back button */}
          <Link to="/" className="absolute top-8 left-8 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
  
          {/* Signup Form */}
          <div className="mx-auto max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <div className="space-y-2 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <UserPlus className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Create an account</h1>
              <p className="text-zinc-500">Enter your information to get started</p>
            </div>
  
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  onChange={handleChange}
                  required
                  className="flex h-11 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                />
              </div>
  
              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  required
                  className="flex h-11 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                />
              </div>
  
              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password (8+ characters)"
                  onChange={handleChange}
                  required
                  className="flex h-11 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                />
                <p className="text-xs text-zinc-500 mt-1">Password must be at least 8 characters</p>
              </div>
  
              {/* Terms and privacy checkbox */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                <label htmlFor="terms" className="text-sm text-zinc-600">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </label>
              </div>
  
              {/* Error message */}
              {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-200">{error}</div>}
  
              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>
  
            {/* Login link */}
            <div className="text-center text-sm border-t border-zinc-200 pt-6 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
export default SignUp