import React, { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext();

// Hardcoded admin credentials (replace with backend API calls later)
const ADMIN_CREDENTIALS = [
    { email: 'admin@orderiq.com', password: 'admin123', name: 'Admin' },
];

export const AdminAuthProvider = ({ children }) => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
        return localStorage.getItem('orderiq_admin_auth') === 'true';
    });

    const [adminUser, setAdminUser] = useState(() => {
        const stored = localStorage.getItem('orderiq_admin_user');
        return stored ? JSON.parse(stored) : null;
    });

    const adminLogin = (email, password) => {
        const admin = ADMIN_CREDENTIALS.find(
            (cred) => cred.email === email && cred.password === password
        );

        if (admin) {
            setIsAdminAuthenticated(true);
            setAdminUser({ email: admin.email, name: admin.name });
            localStorage.setItem('orderiq_admin_auth', 'true');
            localStorage.setItem('orderiq_admin_user', JSON.stringify({ email: admin.email, name: admin.name }));
            return { success: true };
        }

        return { success: false, message: 'Invalid email or password' };
    };

    const adminLogout = () => {
        setIsAdminAuthenticated(false);
        setAdminUser(null);
        localStorage.removeItem('orderiq_admin_auth');
        localStorage.removeItem('orderiq_admin_user');
    };

    return (
        <AdminAuthContext.Provider value={{ isAdminAuthenticated, adminUser, adminLogin, adminLogout }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};

// Intentionally no default export to keep Fast Refresh consistent.
