import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  // Grab the user data and functions from our Context
  const { user, loading, login, logout } = useContext(AuthContext);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Campus Nexus...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Campus Nexus Hub</h1>
      
      {user ? (
        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
          <h2>Welcome back, {user.name}!</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>System Role:</strong> {user.role}</p>
          {user.pictureUrl && (
            <img 
              src={user.pictureUrl} 
              alt="Profile" 
              style={{ borderRadius: '50%', width: '80px', height: '80px', marginTop: '10px' }} 
            />
          )}
          <br /><br />
          <button 
            onClick={logout} 
            style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <p>You are currently logged out.</p>
          <button 
            onClick={login} 
            style={{ padding: '10px 20px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}

export default App;