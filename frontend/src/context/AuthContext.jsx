import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // When the app loads, ask Spring Boot who is logged in
        api.get('/users/me')
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.log("Not logged in");
                setUser(null);
                setLoading(false);
            });
    }, []);

    const login = () => {
        // Redirect to Spring Boot's Google OAuth2 trigger
        window.location.href = 'http://localhost:8086/oauth2/authorization/google';
    };

    const logout = () => {
        // Redirect to Spring Boot's logout endpoint
        window.location.href = 'http://localhost:8086/logout';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};