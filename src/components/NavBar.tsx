import { useState, useEffect } from 'react';
import LogoutButton from './LogoutButton';

interface NavBarProps {
  session?: {
    userId: string;
    email: string;
    name: string;
  } | null;
  registerButtonText?: string;
}

export default function NavBar({ session, registerButtonText = "Register" }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTestsOpen, setIsTestsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [userSession, setUserSession] = useState(session);
  
  useEffect(() => {
    if (session) {
      setUserSession(session);
    }
  }, [session]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img 
            src="/logo-compact.svg" 
            alt="LAKSHYA Career Counselling" 
            className="h-12 w-auto"
            width="200"
            height="60"
          />
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="/" className="text-lg font-medium text-gray-500 hover:text-black transition-colors">
            About
          </a>
          
          {/* Tests Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsTestsOpen(true)}
            onMouseLeave={() => setIsTestsOpen(false)}
          >
            <button className="text-lg font-medium text-gray-500 hover:text-black transition-colors">
              Tests
            </button>
            {isTestsOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <a href="/high-school-students" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                  For High School Students
                </a>
                <a href="/senior-school-students" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                  For Senior School Students
                </a>
                <a href="/college-student" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                  For College Students
                </a>
                <a href="/corporate-professional" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                  For Corporate Professionals
                </a>
              </div>
            )}
          </div>
          
          {/* Services Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button className="text-lg font-medium text-gray-500 hover:text-black transition-colors">
              Services
            </button>
            {isServicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <a href="/for-academic-insitutions" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                  For Academic Institutions
                </a>
                <a href="/for-corporates" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                  For Corporate Organizations
                </a>
              </div>
            )}
          </div>
          
          <a href="/contact-us" className="text-lg font-medium text-gray-500 hover:text-black transition-colors">
            Contact Us
          </a>
          
          {userSession ? (
            <>
              <a href="/dashboard" className="text-lg font-medium text-black hover:text-primary-500 transition-colors">
                Dashboard
              </a>
              <span className="text-lg text-gray-600">Hello, {userSession.name}</span>
              <LogoutButton className="text-sm" />
            </>
          ) : (
            <>
              <a href="/login" className="text-lg font-medium text-black hover:text-primary-500 transition-colors">
                Login
              </a>
              <a 
                href="/register" 
                className="px-8 py-4 bg-white/20 border border-gray-300 rounded-4xl text-lg font-medium text-black hover:bg-gray-50 transition-colors"
              >
                {registerButtonText}
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <a href="/" className="block text-lg font-medium text-gray-500 hover:text-black">
              About
            </a>
            <a href="/high-school-students" className="block text-lg font-medium text-gray-500 hover:text-black pl-4">
              - High School Students
            </a>
            <a href="/senior-school-students" className="block text-lg font-medium text-gray-500 hover:text-black pl-4">
              - Senior School Students
            </a>
            <a href="/college-student" className="block text-lg font-medium text-gray-500 hover:text-black pl-4">
              - College Students
            </a>
            <a href="/corporate-professional" className="block text-lg font-medium text-gray-500 hover:text-black pl-4">
              - Corporate Professionals
            </a>
            <a href="/for-academic-insitutions" className="block text-lg font-medium text-gray-500 hover:text-black pl-4">
              - Academic Institutions
            </a>
            <a href="/for-corporates" className="block text-lg font-medium text-gray-500 hover:text-black pl-4">
              - Corporate Organizations
            </a>
            <a href="/contact-us" className="block text-lg font-medium text-gray-500 hover:text-black">
              Contact Us
            </a>
            {userSession ? (
              <>
                <a href="/dashboard" className="block text-lg font-medium text-black hover:text-primary-500">
                  Dashboard
                </a>
                <div className="text-lg text-gray-600 py-2">Hello, {userSession.name}</div>
                <LogoutButton className="w-full text-sm" />
              </>
            ) : (
              <>
                <a href="/login" className="block text-lg font-medium text-black hover:text-primary-500">
                  Login
                </a>
                <a 
                  href="/register" 
                  className="block px-8 py-4 bg-white/20 border border-gray-300 rounded-4xl text-lg font-medium text-black hover:bg-gray-50 text-center"
                >
                  {registerButtonText}
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

