
// Add missing React import to fix namespace error for React.FC
import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = mockDb.getCurrentUser();

  // Hide the SaaS Navbar when viewing a public store
  if (location.pathname.startsWith('/s/')) {
    return null;
  }

  const handleLogout = () => {
    mockDb.setCurrentUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-bold text-green-600 flex items-center">
              <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.589.943 3.141 1.419 4.767 1.42 5.405.002 9.803-4.392 9.805-9.797.001-2.618-1.02-5.08-2.873-6.932-1.854-1.853-4.316-2.873-6.936-2.873-5.404 0-9.801 4.394-9.803 9.799-.001 1.848.513 3.65 1.486 5.223l-.971 3.548 3.525-.925zm11.238-7.791c-.309-.154-1.829-.902-2.112-1.005-.282-.103-.488-.154-.693.154-.206.309-.796.902-1.002 1.133-.206.232-.412.258-.721.103-.309-.154-1.307-.482-2.489-1.536-.919-.82-1.539-1.832-1.719-2.141-.18-.309-.019-.475.136-.628.14-.138.309-.36.463-.541.154-.18.206-.309.309-.515.103-.206.052-.386-.026-.541-.077-.154-.693-1.673-.951-2.291-.251-.602-.506-.52-.693-.53l-.592-.01c-.206 0-.541.077-.824.386-.282.309-1.08 1.056-1.08 2.574 0 1.518 1.107 2.986 1.261 3.192.154.206 2.179 3.328 5.278 4.664.737.318 1.312.507 1.758.648.74.235 1.414.201 1.947.122.593-.088 1.829-.747 2.086-1.468.257-.721.257-1.34.18-1.468-.077-.128-.282-.206-.591-.36z"/></svg>
              WS-Store
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className={`font-medium ${location.pathname === '/dashboard' ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}>Dashboard</Link>
                <Link to="/settings" className={`font-medium ${location.pathname === '/settings' ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}>Store Profile</Link>
                {user.role === UserRole.ADMIN && (
                  <Link to="/admin" className="text-gray-600 hover:text-green-600 font-medium">Admin Panel</Link>
                )}
                <div className="flex items-center space-x-4 border-l pl-6">
                  <span className="text-sm font-medium text-gray-500">{user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-red-600 px-3 py-1.5 rounded-lg text-xs font-black uppercase hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-green-600 font-medium">Login</Link>
                <Link to="/register" className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-sm">
                  Start Selling
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
