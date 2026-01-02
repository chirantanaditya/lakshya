import { useState } from 'react';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirect to login page
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
        // Still redirect even if API call fails
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect on error
      window.location.href = '/login';
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
}

