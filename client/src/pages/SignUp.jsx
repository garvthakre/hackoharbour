import React from 'react'

import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";

const SignUp = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
    });
    console.log(formData); // checking form'
  
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
  
      console.log("Form Data from handleSubmit:", formData); // Debugging
  
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        const data = await res.json();
        console.log("Server Response:", data); // Debugging
  
        if (res.ok) {
        localStorage.setItem("token", data.token); // Store token in localStorage
        console.log("Stored Token:", localStorage.getItem("token")); // Print
         console.log("res is ok.")
         navigate("/home");
        } else {
          setError(data.message || "Signup failed. Please try again.");
          alert(data.message || "Signup failed. Please try again.");
        }
      } catch (error) {
        console.error("Error signing up:", error);
        setError("Connection error. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link to="/" className="inline-flex items-center pt-8 text-sm text-zinc-600 hover:text-zinc-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
  
          {/* Signup Form */}
          <div className="mx-auto max-w-md space-y-6 pt-12">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
              <p className="text-zinc-500">Enter your information to create your account</p>
            </div>
  
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="flex h-10 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-950"
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
                  className="flex h-10 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-950"
                />
              </div>
  
              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-950"
                />
              </div>
  
              {/* Other Input Field */}
              
  
              {/* Error message */}
              {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}
  
              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50"
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
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-zinc-900 hover:underline">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  

export default SignUp
