import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
// 1. Import your brand new catalogue component!
import FacilitiesCatalogue from './Pages/facilities/FacilitiesCatalogue';

function App() {
  const { user, loading, login, logout } = useContext(AuthContext);

  if (loading) {
    return <div className="p-8 text-center text-blue-600 font-semibold">Loading Campus Nexus...</div>;
  }

  return (
    <div className="font-sans bg-slate-50 min-h-screen">
      {/* 2. A clean, professional Top Navigation Bar */}
      <nav className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider">Campus Nexus</h1>
        {user && (
            <div className="flex items-center gap-4">
                {user.pictureUrl && (
                  <img src={user.pictureUrl} alt="Profile" className="w-8 h-8 rounded-full border-2 border-blue-400" />
                )}
                <span className="text-sm font-medium hidden sm:block">
                  {user.name} <span className="bg-blue-700 px-2 py-0.5 rounded text-xs ml-1">{user.role}</span>
                </span>
                <button 
                    onClick={logout} 
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm transition font-medium shadow-sm">
                    Logout
                </button>
            </div>
        )}
      </nav>

      {/* 3. Main Content Area */}
      <main>
        {user ? (
          // If logged in, show the Facilities Catalogue!
          <FacilitiesCatalogue />
        ) : (
          // If logged out, show a clean, centered login card
          <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-md text-center border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Welcome to Campus Nexus</h2>
            <p className="text-slate-600 mb-6">Please sign in with your university Google account to access the system.</p>
            <button 
              onClick={login} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition duration-200 shadow-sm flex justify-center items-center gap-2">
              Sign in with Google
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;