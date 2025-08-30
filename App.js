import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

// --- Configuration ---
const API_URL = 'https://mywebsite-server-t1ma.onrender.com';
const SOCKET_URL = 'http://localhost:5000';

// --- API Helper ---
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers['x-auth-token'] = token;
    return config;
});

// --- SVG Icons ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>;
const PlusSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>;
const HelpCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

// --- Main App Component ---
export default function App() {
    const [page, setPage] = useState('login');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const getResetToken = () => {
        const path = window.location.pathname;
        if (path.startsWith('/reset-password/')) {
            return path.split('/')[2];
        }
        return null;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        const resetToken = getResetToken();

        if (resetToken) {
            setPage('reset-password');
        } else if (token) {
            setIsAuthenticated(true);
            setIsAdmin(adminStatus);
            setPage('dashboard');
        }
        setLoading(false);
    }, []);

    const handleLogin = (token, adminStatus) => {
        localStorage.setItem('token', token);
        localStorage.setItem('isAdmin', adminStatus);
        setIsAuthenticated(true);
        setIsAdmin(adminStatus);
        setPage('dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        setIsAuthenticated(false);
        setIsAdmin(false);
        setPage('login');
        window.history.pushState({}, '', '/');
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white"><div className="text-xl font-semibold">Loading...</div></div>;
    }

    const renderAuthPage = () => {
        switch(page) {
            case 'login': return <Login setPage={setPage} handleLogin={handleLogin} />;
            case 'register': return <Register setPage={setPage} />;
            case 'verify-email': return <VerifyEmail setPage={setPage} />;
            case 'forgot-password': return <ForgotPassword setPage={setPage} />;
            case 'reset-password': return <ResetPassword setPage={setPage} token={getResetToken()} />;
            default: return <Login setPage={setPage} handleLogin={handleLogin} />;
        }
    };

    return (
        <div>
            {!isAuthenticated ? (
                <div 
                    className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center p-4 bg-slate-900"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=2070&auto=format&fit=crop')" }}
                >
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="relative z-10 w-full max-w-md">
                        {renderAuthPage()}
                    </div>
                </div>
            ) : (
                <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
                    {isAdmin ? <AdminDashboard handleLogout={handleLogout} theme={theme} setTheme={setTheme} /> : <UserDashboard handleLogout={handleLogout} theme={theme} setTheme={setTheme} />}
                </div>
            )}
        </div>
    );
}


// --- Authentication Components ---
function AuthCard({ title, children }) {
    return (
        <div className="w-full max-w-md">
            <div className="bg-slate-800/60 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white">
                <h2 className="text-center text-3xl font-bold mb-8">{title}</h2>
                {children}
            </div>
        </div>
    );
}

function Login({ setPage, handleLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            handleLogin(res.data.token, res.data.isAdmin);
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed. Please check your credentials or verify your email.');
        }
    };

    return (
        <AuthCard title="Welcome Back">
            {error && <p className="mb-4 text-center text-sm text-red-300 bg-red-500/20 p-2 rounded-md">{error}</p>}
            <form className="space-y-6" onSubmit={onLogin}>
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email address</label>
                    <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-white/20 border-transparent rounded-lg" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
                    <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-white/20 border-transparent rounded-lg" />
                </div>
                <div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700">Sign in</button>
                </div>
            </form>
             <div className="mt-4 text-center">
                <button onClick={() => setPage('forgot-password')} className="text-sm text-blue-400 hover:text-blue-300">Forgot Password?</button>
            </div>
            <p className="mt-6 text-center text-sm text-gray-300">
                New here? <button onClick={() => setPage('register')} className="font-medium text-blue-400 hover:text-blue-300">Create an account</button>
            </p>
        </AuthCard>
    );
}

function Register({ setPage }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
            localStorage.setItem('verificationEmail', res.data.email);
            setPage('verify-email');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <AuthCard title="Create Account">
            {error && <p className="mb-4 text-center text-sm text-red-300 bg-red-500/20 p-2 rounded-md">{error}</p>}
            <form className="space-y-6" onSubmit={onRegister}>
                 <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-200">Username</label>
                    <input id="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-white/20 border-transparent rounded-lg" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email address</label>
                    <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-white/20 border-transparent rounded-lg" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
                    <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-white/20 border-transparent rounded-lg" />
                </div>
                <div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700">Register</button>
                </div>
            </form>
            <p className="mt-6 text-center text-sm text-gray-300">
                Already have an account? <button onClick={() => setPage('login')} className="font-medium text-blue-400 hover:text-blue-300">Sign in</button>
            </p>
        </AuthCard>
    );
}

function VerifyEmail({ setPage }) {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const email = localStorage.getItem('verificationEmail');

    const onVerify = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await axios.post(`${API_URL}/auth/verify-email`, { email, otp });
            setMessage(res.data.msg);
            localStorage.removeItem('verificationEmail');
            setTimeout(() => setPage('login'), 3000); // Redirect to login after 3 seconds
        } catch (err) {
            setError(err.response?.data?.msg || 'Verification failed');
        }
    };
    
    return (
        <AuthCard title="Verify Your Email">
             <p className="text-center text-sm text-gray-300 mb-4">A verification code has been sent to {email}</p>
            {error && <p className="mb-4 text-center text-sm text-red-300">{error}</p>}
            {message && <p className="mb-4 text-center text-sm text-green-300">{message}</p>}
            <form className="space-y-6" onSubmit={onVerify}>
                 <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-200">6-Digit Code</label>
                    <input id="otp" type="text" maxLength="6" required value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-white/20 border-transparent rounded-lg text-center tracking-[1em]" />
                </div>
                <div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700">Verify Account</button>
                </div>
            </form>
             <p className="mt-6 text-center text-sm">
                <button onClick={() => setPage('login')} className="font-medium text-blue-400 hover:text-blue-300">Back to Login</button>
            </p>
        </AuthCard>
    );
}

function ForgotPassword({ setPage }) { const [email, setEmail] = useState(''); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const onRequest = async (e) => { e.preventDefault(); setError(''); setMessage(''); try { const res = await axios.post(`${API_URL}/auth/forgot-password`, { email }); setMessage(res.data.msg); } catch (err) { setError(err.response?.data?.msg || 'Something went wrong'); } }; return ( <AuthCard title="Forgot Password"> {error && <p className="mb-4 text-center text-sm text-red-300">{error}</p>} {message && <p className="mb-4 text-center text-sm text-green-300">{message}</p>} <form className="space-y-6" onSubmit={onRequest}> <div> <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email address</label> <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-white/20 border-transparent rounded-lg" /> </div> <div> <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700">Send Reset Link</button> </div> </form> <p className="mt-6 text-center text-sm"> <button onClick={() => setPage('login')} className="font-medium text-blue-400 hover:text-blue-300">Back to Login</button> </p> </AuthCard> ); }
function ResetPassword({ setPage, token }) { const [password, setPassword] = useState(''); const [message, setMessage] = useState(''); const [error, setError] = useState(''); if (!token) { return <AuthCard title="Error"><p className="text-center">Invalid password reset link.</p></AuthCard>; } const onReset = async (e) => { e.preventDefault(); setError(''); setMessage(''); try { const res = await axios.put(`${API_URL}/auth/reset-password/${token}`, { password }); setMessage(res.data.msg); } catch (err) { setError(err.response?.data?.msg || 'Failed to reset password'); } }; return ( <AuthCard title="Reset Your Password"> {error && <p className="mb-4 text-center text-sm text-red-300">{error}</p>} {message && <p className="mb-4 text-center text-sm text-green-300">{message}</p>} <form className="space-y-6" onSubmit={onReset}> <div> <label htmlFor="password" className="block text-sm font-medium text-gray-200">New Password</label> <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-white/20 border-transparent rounded-lg" /> </div> <div> <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700">Reset Password</button> </div> </form> <p className="mt-6 text-center text-sm"> {message && <button onClick={() => { window.history.pushState({}, '', '/'); setPage('login'); }} className="font-medium text-blue-400 hover:text-blue-300">Proceed to Login</button>} </p> </AuthCard> ); }

// --- Shared Components ---
function Profile() { const [user, setUser] = useState(null); const [loading, setLoading] = useState(true); const [photoURL, setPhotoURL] = useState(''); const fetchProfile = async () => { try { const res = await api.get('/users/me'); setUser(res.data); setPhotoURL(res.data.photoURL || ''); } catch (err) { console.error("Failed to fetch profile", err); } finally { setLoading(false); } }; useEffect(() => { fetchProfile(); }, []); const handlePhotoUpdate = async (e) => { e.preventDefault(); try { await api.put('/users/me/photo', { photoURL }); alert('Profile photo updated!'); fetchProfile(); } catch (err) { alert('Failed to update photo.'); console.error(err); } }; if (loading) return <div>Loading profile...</div>; if (!user) return <div>Could not load profile.</div>; return ( <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg"> <div className="flex items-center gap-6 mb-8"> <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.username}&background=random&size=128`} alt="Profile" className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-200 dark:ring-blue-700" /> <div> <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-200">{user.username}</h1> <p className="text-gray-500 dark:text-slate-400">{user.email}</p> <span className={`mt-1 inline-block px-3 py-1 text-xs font-semibold rounded-full ${user.isAdmin ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}> {user.isAdmin ? 'Administrator' : 'Standard User'} </span> </div> </div> <div className="mt-10"> <h2 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-4">Update Profile Photo</h2> <form onSubmit={handlePhotoUpdate} className="flex items-center gap-4"> <input type="text" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} placeholder="Paste image URL here" className="flex-grow p-3 border rounded-lg bg-gray-50 dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500" /> <button type="submit" className="py-3 px-5 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Save</button> </form> </div> </div> ); }

// NEW SETTINGS COMPONENT
function Settings({ theme, setTheme }) {
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg max-w-lg mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-slate-200">Settings</h1>
            <div className="flex items-center justify-between p-4 border dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                    {theme === 'light' ? <SunIcon className="text-gray-700 dark:text-slate-300" /> : <MoonIcon className="text-gray-700 dark:text-slate-300" />}
                    <span className="text-gray-700 dark:text-slate-300">Appearance</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-slate-400">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                    <button 
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${theme === 'light' ? 'bg-gray-300' : 'bg-blue-600'}`}
                    >
                        <span className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- User Dashboard and Components ---
function UserDashboard({ handleLogout, theme, setTheme }) { const [activeTab, setActiveTab] = useState('home'); const [notifications, setNotifications] = useState([]); const [showNotifications, setShowNotifications] = useState(false); const socketRef = useRef(); const fetchNotifications = async () => { const res = await api.get('/notifications'); setNotifications(res.data); }; useEffect(() => { const connectSocket = async () => { try { const userRes = await api.get('/users/me'); const userId = userRes.data._id; if (userId) { socketRef.current = io(SOCKET_URL); socketRef.current.emit('join', userId); socketRef.current.on('notification', (newNotification) => { setNotifications(prev => [newNotification, ...prev]); }); } } catch (error) { console.error("Error connecting socket:", error); } }; fetchNotifications(); connectSocket(); return () => { if (socketRef.current) { socketRef.current.disconnect(); } }; }, []); const unreadCount = notifications.filter(n => !n.isRead).length; const handleBellClick = async () => { setShowNotifications(!showNotifications); if (unreadCount > 0) { await api.post('/notifications/read'); fetchNotifications(); } }; const renderContent = () => { switch (activeTab) { case 'home': return <UserHome />; case 'profile': return <Profile />; case 'developers': return <Developers />; case 'my-requests': return <MyRequests />; case 'add-request': return <AddRequest setActiveTab={setActiveTab} />; case 'history': return <History />; case 'about': return <About />; case 'help': return <Help />; case 'settings': return <Settings theme={theme} setTheme={setTheme} />; default: return <UserHome />; } }; return ( <div className="flex h-screen"> <Sidebar setActiveTab={setActiveTab} handleLogout={handleLogout} /> <main className="flex-1 flex flex-col"> <header className="flex justify-end items-center p-4 bg-white dark:bg-slate-800 border-b dark:border-slate-700 gap-4"> <div className="relative"> <button onClick={handleBellClick} className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300"> <BellIcon /> {unreadCount > 0 && ( <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span> )} </button> {showNotifications && ( <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border dark:border-slate-700 overflow-hidden z-10"> <div className="p-3 font-bold text-sm border-b dark:border-slate-700 text-gray-800 dark:text-slate-200">Notifications</div> <div className="max-h-96 overflow-y-auto"> {notifications.length > 0 ? notifications.map(n => ( <div key={n._id} className={`p-3 text-sm border-b dark:border-slate-700 ${!n.isRead ? 'bg-blue-50 dark:bg-blue-900/50' : ''}`}> <p className="text-gray-800 dark:text-slate-300">{n.message}</p> <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{new Date(n.date).toLocaleString()}</p> </div> )) : <p className="p-4 text-center text-sm text-gray-500 dark:text-slate-400">No new notifications.</p>} </div> </div> )} </div> </header> <div className="flex-1 p-10 overflow-y-auto bg-slate-100 dark:bg-slate-900"> {renderContent()} </div> </main> </div> ); }
function Sidebar({ setActiveTab, handleLogout }) { const navItems = [ { id: 'home', label: 'Home', icon: <HomeIcon /> }, { id: 'profile', label: 'Profile', icon: <ProfileIcon /> }, { id: 'developers', label: 'Developers', icon: <CodeIcon /> }, { id: 'my-requests', label: 'My Requests', icon: <ListIcon /> }, { id: 'add-request', label: 'Add Request', icon: <PlusSquareIcon /> }, { id: 'history', label: 'History', icon: <HistoryIcon /> }, { id: 'about', label: 'About', icon: <InfoIcon /> }, { id: 'help', label: 'Help & Contact', icon: <HelpCircleIcon /> }, { id: 'settings', label: 'Settings', icon: <SettingsIcon /> }, ]; return ( <div className="w-64 bg-slate-900 text-slate-300 flex flex-col"> <div className="p-5 text-2xl font-bold text-white border-b border-slate-700">Client Portal</div> <nav className="flex-1 px-4 py-4 space-y-2"> {navItems.map(item => ( <button key={item.id} onClick={() => setActiveTab(item.id)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 hover:text-white focus:outline-none focus:bg-slate-700 transition-all duration-200"> {item.icon} <span>{item.label}</span> </button> ))} </nav> <div className="p-4 border-t border-slate-700"> <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 hover:text-white focus:outline-none focus:bg-slate-700 transition-all duration-200"> <LogOutIcon /> <span>Logout</span> </button> </div> </div> ); }
function UserHome() { return ( <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg"> <h1 className="text-4xl font-bold text-gray-800 dark:text-slate-200 mb-4">Welcome to your Dashboard!</h1> <p className="text-gray-600 dark:text-slate-400 text-lg">Here you can manage your website requests, view our talented developers, and get help if you need it. Use the sidebar to navigate.</p> </div> ); }
function Developers() { const [developers, setDevelopers] = useState([]); const [loading, setLoading] = useState(true); useEffect(() => { const fetchDevelopers = async () => { try { const res = await api.get('/developers'); setDevelopers(res.data); } catch (err) { console.error("Failed to fetch developers", err); } finally { setLoading(false); } }; fetchDevelopers(); }, []); if (loading) return <div>Loading developers...</div>; return ( <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg"> <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-slate-200">Our Developers</h1> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {developers.map(dev => ( <div key={dev.uniqueId} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-md p-6 text-center transform hover:-translate-y-1 transition-transform duration-300"> <img src={dev.photoURL || 'https://placehold.co/150/475569/FFFFFF?text=Dev'} alt={dev.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover ring-4 ring-slate-200 dark:ring-slate-600" /> <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{dev.name}</h2> <p className="text-gray-600 dark:text-slate-400">ID: {dev.uniqueId}</p> <p className="text-gray-500 dark:text-slate-400 mt-2">{dev.info}</p> </div> ))} </div> </div> ); }
function MyRequests() { const [requests, setRequests] = useState([]); const [loading, setLoading] = useState(true); const [activeStatusTab, setActiveStatusTab] = useState('approval'); useEffect(() => { const fetchRequests = async () => { try { const res = await api.get('/requests'); setRequests(res.data); } catch (err) { console.error("Failed to fetch requests", err); } finally { setLoading(false); } }; fetchRequests(); }, []); const filteredRequests = requests.filter(req => req.status === activeStatusTab); if (loading) return <div>Loading requests...</div>; return ( <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg"> <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-slate-200">My Requests</h1> <div className="flex border-b dark:border-slate-700 mb-6"> <button onClick={() => setActiveStatusTab('approval')} className={`py-2 px-4 text-sm font-medium ${activeStatusTab === 'approval' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 dark:text-slate-400'}`}>Approval</button> <button onClick={() => setActiveStatusTab('pending')} className={`py-2 px-4 text-sm font-medium ${activeStatusTab === 'pending' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 dark:text-slate-400'}`}>Pending</button> <button onClick={() => setActiveStatusTab('rejected')} className={`py-2 px-4 text-sm font-medium ${activeStatusTab === 'rejected' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 dark:text-slate-400'}`}>Rejected</button> </div> <div className="overflow-x-auto"> <table className="min-w-full"> <thead className="bg-slate-50 dark:bg-slate-700"> <tr> <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Website Name</th> <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th> <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th> <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Requested</th> </tr> </thead> <tbody className="bg-white dark:bg-slate-800 divide-y dark:divide-slate-700"> {filteredRequests.map((req) => ( <tr key={req._id}> <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-200">{req.websiteName}</td> <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{req.description}</td> <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{req.status}</td> <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{new Date(req.requestedDate).toLocaleDateString()}</td> </tr> ))} </tbody> </table> {filteredRequests.length === 0 && <p className="text-center py-4 text-gray-500 dark:text-slate-400">No requests in this category.</p>} </div> </div> ); }
function AddRequest({ setActiveTab }) { const [websiteName, setWebsiteName] = useState(''); const [description, setDescription] = useState(''); const handleSubmit = async (e) => { e.preventDefault(); try { await api.post('/requests', { websiteName, description }); alert('Request submitted successfully!'); setActiveTab('my-requests'); } catch (err) { alert('Failed to submit request.'); } }; return ( <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg max-w-2xl mx-auto"> <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-slate-200">Submit a New Website Request</h1> <form onSubmit={handleSubmit} className="space-y-6"> <div> <label htmlFor="websiteName" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Website Name</label> <input id="websiteName" type="text" value={websiteName} onChange={e => setWebsiteName(e.target.value)} required className="mt-1 block w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200"/> </div> <div> <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Description</label> <textarea id="description" rows="5" value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-200"/> </div> <div> <button type="submit" className="w-full py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700">Submit Request</button> </div> </form> </div> ); }
function History() { const [requests, setRequests] = useState([]); const [loading, setLoading] = useState(true); useEffect(() => { const fetchRequests = async () => { try { const res = await api.get('/requests'); setRequests(res.data.filter(r => r.status === 'completed' || r.status === 'rejected')); } catch (err) { console.error("Failed to fetch history", err); } finally { setLoading(false); } }; fetchRequests(); }, []); if (loading) return <div>Loading history...</div>; return ( <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg"> <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-slate-200">Request History</h1> <div className="overflow-x-auto"> <table className="min-w-full"> <thead className="bg-slate-50 dark:bg-slate-700"> <tr> <th className="py-3 px-4 text-left text-gray-800 dark:text-slate-200">Website Name</th> <th className="py-3 px-4 text-left text-gray-800 dark:text-slate-200">Status</th> <th className="py-3 px-4 text-left text-gray-800 dark:text-slate-200">Requested</th> <th className="py-3 px-4 text-left text-gray-800 dark:text-slate-200">Completed/Rejected On</th> </tr> </thead> <tbody className="dark:text-slate-400"> {requests.map((req) => ( <tr key={req._id} className="border-t dark:border-slate-700"> <td className="py-4 px-4">{req.websiteName}</td> <td className="py-4 px-4">{req.status}</td> <td className="py-4 px-4">{new Date(req.requestedDate).toLocaleDateString()}</td> <td className="py-4 px-4">{req.submissionDate ? new Date(req.submissionDate).toLocaleDateString() : 'N/A'}</td> </tr> ))} </tbody> </table> {requests.length === 0 && <p className="text-center py-4 text-gray-500 dark:text-slate-400">No past requests found.</p>} </div> </div> ); }
function About() { return ( <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg"> <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-slate-200">About Us</h1> <p className="text-gray-600 dark:text-slate-400">We are a dedicated team of developers committed to delivering high-quality web solutions for our clients. Our platform allows you to seamlessly request new projects, track their progress, and communicate with our team. We believe in transparency and efficiency, ensuring your vision is brought to life exactly as you imagined.</p> </div> ); }
function Help() { const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [message, setMessage] = useState(''); const [status, setStatus] = useState(''); const handleSubmit = async (e) => { e.preventDefault(); setStatus('Submitting...'); try { await axios.post(`${API_URL}/contact`, { name, email, message }); setStatus('Your message has been sent successfully!'); setName(''); setEmail(''); setMessage(''); } catch (err) { setStatus('Failed to send message. Please try again.'); } }; return ( <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg"> <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-slate-200">Help & Contact</h1> <p className="text-gray-600 dark:text-slate-400 mb-6">Have a question or need support? Fill out the form below or email us directly at <span className="font-semibold text-blue-600 dark:text-blue-400">sumanb9938@gmail.com</span>.</p> <form onSubmit={handleSubmit} className="space-y-4"> <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" required className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-slate-700 dark:border-slate-600"/> <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your Email" required className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-slate-700 dark:border-slate-600"/> <textarea rows="5" value={message} onChange={e => setMessage(e.target.value)} placeholder="Your Message" required className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-slate-700 dark:border-slate-600"/> <button type="submit" className="w-full py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700">Send Message</button> </form> {status && <p className="mt-4 text-center text-sm">{status}</p>} </div> ); }

// --- Admin Dashboard and Components ---
function AdminDashboard({ handleLogout, theme, setTheme }) { const [activeTab, setActiveTab] = useState('requests'); const renderContent = () => { switch (activeTab) { case 'requests': return <ManageRequests />; case 'users': return <ManageUsers />; case 'developers': return <ManageDevelopers />; case 'messages': return <ManageContactMessages />; case 'profile': return <Profile />; case 'settings': return <Settings theme={theme} setTheme={setTheme} />; default: return <ManageRequests />; } }; return ( <div className="flex h-screen"> <AdminSidebar setActiveTab={setActiveTab} handleLogout={handleLogout} /> <main className="flex-1 flex flex-col">  <header className="flex justify-end items-center p-4 bg-white dark:bg-slate-800 border-b dark:border-slate-700 gap-4"> {/* ThemeToggle is now in Settings */} </header> <div className="flex-1 p-10 overflow-y-auto bg-slate-100 dark:bg-slate-900"> {renderContent()} </div> </main> </div> ); }
function AdminSidebar({ setActiveTab, handleLogout }) { const navItems = [ { id: 'requests', label: 'Manage Requests', icon: <ListIcon /> }, { id: 'developers', label: 'Manage Developers', icon: <CodeIcon /> }, { id: 'users', label: 'Manage Users', icon: <UsersIcon /> }, { id: 'messages', label: 'Contact Messages', icon: <MailIcon /> }, { id: 'profile', label: 'Profile', icon: <ProfileIcon /> }, { id: 'settings', label: 'Settings', icon: <SettingsIcon /> }, ]; return ( <div className="w-64 bg-slate-900 text-slate-300 flex flex-col"> <div className="p-5 text-2xl font-bold text-white border-b border-slate-700">Admin Panel</div> <nav className="flex-1 px-4 py-4 space-y-2"> {navItems.map(item => ( <button key={item.id} onClick={() => setActiveTab(item.id)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 hover:text-white"> {item.icon} <span>{item.label}</span> </button> ))} </nav> <div className="p-4 border-t border-slate-700"> <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 hover:text-white"> <LogOutIcon /> <span>Logout</span> </button> </div> </div> ); }
function ManageRequests() { const [requests, setRequests] = useState([]); const [loading, setLoading] = useState(true); const [selectedRequest, setSelectedRequest] = useState(null); const [activeTab, setActiveTab] = useState('pending'); const fetchRequests = async () => { try { const res = await api.get('/admin/requests'); setRequests(res.data); } catch (err) { console.error(err); } finally { setLoading(false); } }; useEffect(() => { fetchRequests(); }, []); const handleUpdateRequest = async (status, comment, submissionDate, amount) => { try { await api.put(`/admin/requests/${selectedRequest._id}`, { status, adminComment: comment, submissionDate, amount }); setSelectedRequest(null); fetchRequests(); } catch (err) { alert('Failed to update request'); } }; const pendingRequests = requests.filter(r => r.status === 'approval' || r.status === 'pending'); const pastRequests = requests.filter(r => r.status === 'completed' || r.status === 'rejected'); if (loading) return <div>Loading requests...</div>; return ( <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg"> <h1 className="text-3xl font-bold mb-4 dark:text-slate-200">Manage Requests</h1> <div className="flex border-b dark:border-slate-700 mb-6"> <button onClick={() => setActiveTab('pending')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'pending' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>Pending Requests ({pendingRequests.length})</button> <button onClick={() => setActiveTab('past')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'past' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>Past Requests ({pastRequests.length})</button> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> <div> <h2 className="text-xl font-semibold mb-4 dark:text-slate-300">{activeTab === 'pending' ? 'Pending' : 'Past'} Requests</h2> <div className="space-y-2 max-h-[60vh] overflow-y-auto"> {(activeTab === 'pending' ? pendingRequests : pastRequests).map(req => ( <div key={req._id} onClick={() => setSelectedRequest(req)} className="p-3 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 border dark:border-slate-700"> <p className="font-semibold dark:text-slate-200">{req.websiteName}</p> <p className="text-sm text-gray-500 dark:text-slate-400">By: {req.userId.username} ({req.userId.email})</p> <p className="text-xs text-gray-400 dark:text-slate-500">Status: {req.status}</p> </div> ))} </div> </div> <div> <h2 className="text-xl font-semibold mb-4 dark:text-slate-300">Request Details</h2> {selectedRequest ? ( <RequestDetails request={selectedRequest} onUpdate={handleUpdateRequest} onCancel={() => setSelectedRequest(null)}/> ) : ( <p className="text-gray-500 dark:text-slate-400">Select a request to view details.</p> )} </div> </div> </div> ); }
function RequestDetails({ request, onUpdate, onCancel }) { const [status, setStatus] = useState(request.status); const [comment, setComment] = useState(request.adminComment || ''); const [submissionDate, setSubmissionDate] = useState(request.submissionDate ? new Date(request.submissionDate).toISOString().split('T')[0] : ''); const [amount, setAmount] = useState(request.amount || ''); const handleUpdate = () => { onUpdate(status, comment, submissionDate, amount); }; return ( <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"> <h3 className="font-bold text-lg dark:text-slate-200">{request.websiteName}</h3> <p className="text-sm my-2 dark:text-slate-400"><span className="font-semibold dark:text-slate-300">User:</span> {request.userId.username}</p> <p className="text-sm my-2 dark:text-slate-400"><span className="font-semibold dark:text-slate-300">Description:</span> {request.description}</p> <hr className="my-4 dark:border-slate-600"/> <div className="space-y-4"> <div> <label className="block text-sm font-medium dark:text-slate-300">Status</label> <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-2 border rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600"> <option value="approval">Approval</option> <option value="pending">Pending</option> <option value="rejected">Rejected</option> <option value="completed">Completed</option> </select> </div> <div> <label className="block text-sm font-medium dark:text-slate-300">Amount ($)</label> <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600" /> </div> <div> <label className="block text-sm font-medium dark:text-slate-300">Submission Date</label> <input type="date" value={submissionDate} onChange={e => setSubmissionDate(e.target.value)} className="w-full p-2 border rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600" /> </div> <div> <label className="block text-sm font-medium dark:text-slate-300">Admin Comment</label> <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full p-2 border rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600" /> </div> <div className="flex gap-4"> <button onClick={handleUpdate} className="flex-1 py-2 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700">Save Changes</button> <button onClick={onCancel} className="flex-1 py-2 px-4 rounded-lg text-gray-700 dark:text-slate-200 bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500">Cancel</button> </div> </div> </div> ); }
function ManageUsers() { const [users, setUsers] = useState([]); const [loading, setLoading] = useState(true); const fetchUsers = async () => { setLoading(true); try { const res = await api.get('/admin/users'); setUsers(res.data); } catch (err) { console.error(err); } finally { setLoading(false); } }; useEffect(() => { fetchUsers(); }, []); const toggleAdmin = async (userId) => { try { await api.put(`/admin/users/${userId}/toggle-admin`); alert('User admin status updated.'); fetchUsers(); } catch (err) { alert('Failed to update user status.'); } }; const removeUser = async (userId) => { if (window.confirm('Are you sure you want to remove this user? This is permanent.')) { try { await api.delete(`/admin/users/${userId}`); alert('User removed'); fetchUsers(); } catch (err) { alert('Failed to remove user'); } } }; if (loading) return <div>Loading users...</div>; return ( <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg"> <h1 className="text-3xl font-bold mb-6 dark:text-slate-200">Manage Users</h1> <div className="overflow-x-auto"> <table className="min-w-full"> <thead className="bg-slate-50 dark:bg-slate-700"> <tr> <th className="py-2 px-4 text-left dark:text-slate-300">Username</th> <th className="py-2 px-4 text-left dark:text-slate-300">Email</th> <th className="py-2 px-4 text-left dark:text-slate-300">Role</th> <th className="py-2 px-4 text-left dark:text-slate-300">Actions</th> </tr> </thead> <tbody className="dark:text-slate-400"> {users.map(user => ( <tr key={user._id} className="border-t dark:border-slate-700"> <td className="py-2 px-4">{user.username}</td> <td className="py-2 px-4">{user.email}</td> <td className="py-2 px-4">{user.isAdmin ? 'Admin' : 'User'}</td> <td className="py-2 px-4 space-x-4"> <button onClick={() => toggleAdmin(user._id)} className="text-sm text-blue-500 hover:text-blue-700"> {user.isAdmin ? 'Revoke Admin' : 'Make Admin'} </button> <button onClick={() => removeUser(user._id)} className="text-sm text-red-500 hover:text-red-700">Remove</button> </td> </tr> ))} </tbody> </table> </div> </div> ); }
function ManageDevelopers() { const [developers, setDevelopers] = useState([]); const [loading, setLoading] = useState(true); const [name, setName] = useState(''); const [info, setInfo] = useState(''); const [photoURL, setPhotoURL] = useState(''); const [editingDev, setEditingDev] = useState(null); const fetchDevelopers = async () => { setLoading(true); try { const res = await api.get('/developers'); setDevelopers(res.data); } catch (err) { console.error(err); } finally { setLoading(false); } }; useEffect(() => { fetchDevelopers(); }, []); const handleFormSubmit = async (e) => { e.preventDefault(); const devData = { name, info, photoURL }; try { if (editingDev) { await api.put(`/admin/developers/${editingDev._id}`, devData); } else { await api.post('/admin/developers', devData); } setName(''); setInfo(''); setPhotoURL(''); setEditingDev(null); fetchDevelopers(); } catch (err) { alert('Failed to save developer'); } }; const handleEdit = (dev) => { setEditingDev(dev); setName(dev.name); setInfo(dev.info); setPhotoURL(dev.photoURL); }; const handleDelete = async (devId) => { if (window.confirm('Are you sure you want to delete this developer?')) { try { await api.delete(`/admin/developers/${devId}`); fetchDevelopers(); } catch (err) { alert('Failed to delete developer'); } } }; if (loading) return <div>Loading developers...</div>; return ( <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> <div className="md:col-span-1"> <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg"> <h2 className="text-2xl font-bold mb-6 dark:text-slate-200">{editingDev ? 'Edit Developer' : 'Add New Developer'}</h2> <form onSubmit={handleFormSubmit} className="space-y-4"> <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required className="w-full p-2 border rounded bg-gray-50 dark:bg-slate-700 dark:border-slate-600"/> <textarea value={info} onChange={e => setInfo(e.target.value)} placeholder="Info/Skills" required className="w-full p-2 border rounded bg-gray-50 dark:bg-slate-700 dark:border-slate-600"/> <input type="text" value={photoURL} onChange={e => setPhotoURL(e.target.value)} placeholder="Photo URL" className="w-full p-2 border rounded bg-gray-50 dark:bg-slate-700 dark:border-slate-600"/> <button type="submit" className="w-full py-2 px-4 rounded text-white bg-blue-600 hover:bg-blue-700">{editingDev ? 'Save Changes' : 'Add Developer'}</button> {editingDev && <button type="button" onClick={() => {setEditingDev(null); setName(''); setInfo(''); setPhotoURL('');}} className="w-full py-2 mt-2 rounded bg-gray-200 dark:bg-slate-600 dark:text-slate-200">Cancel Edit</button>} </form> </div> </div> <div className="md:col-span-2"> <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg"> <h2 className="text-2xl font-bold mb-6 dark:text-slate-200">Existing Developers</h2> <div className="space-y-4 max-h-[70vh] overflow-y-auto"> {developers.map(dev => ( <div key={dev._id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-between"> <div className="flex items-center gap-4"> <img src={dev.photoURL || 'https://placehold.co/60'} alt={dev.name} className="w-12 h-12 rounded-full object-cover"/> <div> <p className="font-bold dark:text-slate-200">{dev.name}</p> <p className="text-sm text-gray-500 dark:text-slate-400">{dev.info.substring(0, 50)}...</p> </div> </div> <div className="flex gap-2"> <button onClick={() => handleEdit(dev)} className="text-sm text-blue-500">Edit</button> <button onClick={() => handleDelete(dev._id)} className="text-sm text-red-500">Delete</button> </div> </div> ))} </div> </div> </div> </div> ); }
function ManageContactMessages() { const [messages, setMessages] = useState([]); const [loading, setLoading] = useState(true); const fetchMessages = async () => { setLoading(true); try { const res = await api.get('/admin/contacts'); setMessages(res.data); } catch (err) { console.error(err); } finally { setLoading(false); } }; useEffect(() => { fetchMessages(); }, []); const deleteMessage = async (messageId) => { if (window.confirm('Delete this message?')) { try { await api.delete(`/admin/contacts/${messageId}`); fetchMessages(); } catch (err) { alert('Failed to delete message'); } } }; if (loading) return <div>Loading messages...</div>; return ( <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg"> <h1 className="text-3xl font-bold mb-6 dark:text-slate-200">Contact Messages</h1> <div className="space-y-4"> {messages.length > 0 ? messages.map(msg => ( <div key={msg._id} className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-700"> <div className="flex justify-between items-center"> <div> <p className="font-bold dark:text-slate-200">{msg.name} <span className="font-normal text-gray-500 dark:text-slate-400">&lt;{msg.email}&gt;</span></p> <p className="text-xs text-gray-500 dark:text-slate-500">{new Date(msg.date).toLocaleString()}</p> </div> <button onClick={() => deleteMessage(msg._id)} className="text-red-500 text-sm">Delete</button> </div> <p className="mt-4 dark:text-slate-300">{msg.message}</p> </div> )) : <p className="dark:text-slate-400">No messages found.</p>} </div> </div> ); }

