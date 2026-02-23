import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNav = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const employeeNav = [
        { path: '/employee', label: 'Dashboard', icon: '📊' },
    ];

    const hrNav = [
        { path: '/hr', label: 'Dashboard', icon: '📊' },
    ];

    const navItems = user?.role === 'HR' ? hrNav : employeeNav;

    const userInitials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <div className="app-layout">
            {/* Mobile Header */}
            <div className="mobile-header">
                <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    ☰
                </button>
                <h1>ReferralHub</h1>
            </div>

            {/* Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h1>ReferralHub</h1>
                    <span className="role-badge">{user?.role}</span>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <div className="nav-section-title">Navigation</div>
                        {navItems.map(item => (
                            <button
                                key={item.path}
                                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => handleNav(item.path)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="user-avatar">{userInitials}</div>
                        <div className="user-info">
                            <div className="user-name">{user?.name}</div>
                            <div className="user-email">{user?.email}</div>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
