"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/store/auth"
import ThemeToggle from "@/components/common/wrappers/ThemeToggle"
import { Button } from "@/components/ui/button"

const Header1 = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSignIn = () => {
    navigate('/auth/login')
  }

  const handleGetStarted = () => {
    navigate('/auth/register')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b  border-gray-200 dark:border-zinc-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                BlogLikho
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/blogs"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Blogs
            </Link>
            <Link
              to="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/home">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={logout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header1
