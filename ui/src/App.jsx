import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import './App.css';

// Check system preference or localStorage for initial theme
const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('color-theme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs;
    }
    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }
  return 'light';
};

// Add the class to html element immediately on load to prevent flash
if (typeof window !== 'undefined') {
  const theme = getInitialTheme();
  if (theme === 'dark') document.documentElement.classList.add('dark');
}

// Layout wrapper component
function PageWrapper({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-16 md:pt-[72px] flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loadingUser } = useAuth();
  if (loadingUser) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  return <PageWrapper>{children}</PageWrapper>;
}

const AdminRoute = ({ children }) => {
  const { user, loadingUser } = useAuth();
  if (loadingUser) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!user || !user.isAdmin) return <Navigate to="/" />;
  return <PageWrapper>{children}</PageWrapper>;
};

function AppRoutes() {
  const location = useLocation();
  const { logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

  // Listen for global auth events dispatched by the axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      navigate('/login');
    };
    const handleForbidden = (e) => {
      addToast({
        type: 'error',
        message: e.detail?.message || 'You are not authorized to perform this action.',
      });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('auth:forbidden', handleForbidden);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('auth:forbidden', handleForbidden);
    };
  }, [logout, navigate, addToast]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 antialiased">
      {!hideNavbar && <Navbar />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/posts" element={<PageWrapper><Posts /></PageWrapper>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/posts/:postId" element={<PageWrapper><PostDetail /></PageWrapper>} />
        <Route path="/create-post" element={<AdminRoute><CreatePost /></AdminRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {

  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
