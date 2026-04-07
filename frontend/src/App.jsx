import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Import our page components
//import FacilitiesCatalogue from './pages/facilities/FacilitiesCatalogue';
//import FacilityDetails from './pages/facilities/FacilityDetails';
import BookingDashboard from './pages/bookings/BookingDashboard'; // ALUTH PAGE EKA

function App() {
  const { user, loading, login, logout } = useContext(AuthContext);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#0d6efd' }}>Loading Campus Nexus...</div>;
  }

  return (
    <Router>
      <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
        
        {/* Top Navigation Bar */}
        <nav style={{ backgroundColor: '#084298', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Left Side: Logo & Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <h2 style={{ margin: 0 }}>Campus Nexus</h2>
            {user && (
              <div style={{ display: 'flex', gap: '15px' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>Facilities</Link>
                <Link to="/bookings" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>Bookings</Link>
              </div>
            )}
          </div>
          
          {/* Right Side: User Profile */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontWeight: 'bold' }}>{user.name} ({user.role})</span>
              {user.pictureUrl && (
                <img 
                  src={user.pictureUrl} 
                  alt="Profile" 
                  style={{ borderRadius: '50%', width: '35px', height: '35px', border: '2px solid white' }} 
                />
              )}
              <button 
                onClick={logout} 
                style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Logout
              </button>
            </div>
          )}
        </nav>

        {/* Main Content Area */}
        <main style={{ padding: '30px' }}>
          {!user ? (
            <div style={{ textAlign: 'center', marginTop: '100px', backgroundColor: 'white', padding: '40px', borderRadius: '8px', maxWidth: '400px', margin: '100px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <h2 style={{ color: '#084298' }}>Welcome</h2>
              <p style={{ color: '#6c757d', marginBottom: '20px' }}>Sign in to manage campus resources.</p>
              <button 
                onClick={login} 
                style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', width: '100%', fontWeight: 'bold' }}>
                Sign in with Google
              </button>
            </div>
          ) : (
            <Routes>
              {/* Route 1: The main catalogue grid */}
              <Route path="/" element={<FacilitiesCatalogue />} />
              
              {/* Route 2: The specific booking page for a facility */}
              <Route path="/facilities/:id" element={<FacilityDetails />} />

              {/* Route 3: NEW BOOKING DASHBOARD */}
              <Route path="/bookings" element={<BookingDashboard />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;