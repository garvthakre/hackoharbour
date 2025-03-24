import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from "react-router"
import { ArrowLeft, Loader2, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useDispatch } from 'react-redux'
import { setCredentials } from '../redux/authSlice'

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [formTouched, setFormTouched] = useState({ email: false, password: false })
    const navigate = useNavigate()
    const dispatch = useDispatch()
  
    // Form validation states
    const [validation, setValidation] = useState({
      email: { valid: true, message: "" },
      password: { valid: true, message: "" }
    })

    // Handle input changes
    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData({ ...formData, [name]: value })
      setError("") // Clear error when user types
      
      // Mark field as touched
      if (!formTouched[name]) {
        setFormTouched({...formTouched, [name]: true})
      }
    }
    
    // Validate form fields
    useEffect(() => {
      // Only validate if fields have been touched
      if (formTouched.email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const isEmailValid = emailPattern.test(formData.email)
        setValidation(prev => ({
          ...prev,
          email: {
            valid: isEmailValid,
            message: isEmailValid ? "" : "Please enter a valid email address"
          }
        }))
      }
      
      if (formTouched.password) {
        const isPasswordValid = formData.password.length >= 6
        setValidation(prev => ({
          ...prev,
          password: {
            valid: isPasswordValid,
            message: isPasswordValid ? "" : "Password must be at least 6 characters"
          }
        }))
      }
    }, [formData, formTouched])

    // Check if form is valid
    const isFormValid = validation.email.valid && validation.password.valid 
      && formData.email.trim() !== "" && formData.password.trim() !== ""

    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault()
      
      if (!isFormValid) {
        // Touch all fields to show validation messages
        setFormTouched({ email: true, password: true })
        return
      }
      
      setIsLoading(true)
      setError("")
  
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        const data = await res.json();
  
        if (res.ok) {
          // Store token in localStorage for backward compatibility
          localStorage.setItem("token", data.token)
          
          // Store user data and token in Redux
          dispatch(setCredentials({
            user: {
              _id: data.user._id,
              name: data.user.name,
              email: data.user.email
            },
            token: data.token
          }))
          
          // If remember me is checked, save email in localStorage
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", formData.email)
          } else {
            localStorage.removeItem("rememberedEmail")
          }
          
          navigate("/rag")
        } else {
          setError(data.message || "Login failed. Please try again.")
        }
      } catch (err) {
        setError("Connection error. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    
    // Load remembered email if available
    useEffect(() => {
      const savedEmail = localStorage.getItem("rememberedEmail")
      if (savedEmail) {
        setFormData(prev => ({ ...prev, email: savedEmail }))
        setRememberMe(true)
      }
    }, [])
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white flex flex-col items-center justify-center">
        <div className="w-full max-w-md px-4 md:px-0 relative">
          {/* Back button - absolute positioned */}
          <Link 
            to="/" 
            className="absolute top-0 left-4 md:top-2 md:left-0 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            style={{ transform: "translateY(-3rem)" }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
  
          {/* Login card */}
          <div className="w-full space-y-8 bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100">
            <div className="space-y-3 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <LogIn className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">Welcome back</h1>
              <p className="text-zinc-500 text-sm md:text-base">Enter your credentials to access your account</p>
            </div>
  
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none flex items-center justify-between"
                >
                  <span>Email address</span>
                  {formTouched.email && !validation.email.valid && (
                    <span className="text-red-500 text-xs flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validation.email.message}
                    </span>
                  )}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  placeholder="you@example.com"
                  onChange={handleChange}
                  onBlur={() => setFormTouched({...formTouched, email: true})}
                  className={`flex h-11 w-full rounded-lg border ${
                    formTouched.email && !validation.email.valid 
                      ? 'border-red-300 focus-visible:ring-red-500' 
                      : 'border-zinc-300 focus-visible:ring-blue-500'
                  } bg-white px-4 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                />
              </div>
  
              {/* Password field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium leading-none flex items-center"
                  >
                    <span>Password</span>
                    {formTouched.password && !validation.password.valid && (
                      <span className="text-red-500 text-xs flex items-center ml-2">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validation.password.message}
                      </span>
                    )}
                  </label>
                  <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    placeholder="••••••••"
                    onChange={handleChange}
                    onBlur={() => setFormTouched({...formTouched, password: true})}
                    className={`flex h-11 w-full rounded-lg border ${
                      formTouched.password && !validation.password.valid 
                        ? 'border-red-300 focus-visible:ring-red-500' 
                        : 'border-zinc-300 focus-visible:ring-blue-500'
                    } bg-white px-4 py-2 pr-10 text-sm shadow-sm transition-colors placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember" className="text-sm text-zinc-600">
                  Remember me
                </label>
              </div>
  
              {/* Error message */}
              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 border border-red-200 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
  
              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Logging In...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>
  
            {/* Sign up link */}
            <div className="text-center text-sm border-t border-zinc-200 pt-6 mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                Sign Up
              </Link>
            </div>
            
            {/* Security note */}
            <p className="text-xs text-zinc-400 text-center mt-4">
              This site is protected by reCAPTCHA and the{" "}
              <a href="#" className="text-zinc-500 hover:underline">Privacy Policy</a> and{" "}
              <a href="#" className="text-zinc-500 hover:underline">Terms of Service</a> apply.
            </p>
          </div>
        </div>
      </div>
    )
  }

export default Login