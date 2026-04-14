import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Sun, Moon, Home as HomeIcon, PlusSquare, User, LogOut, Search, ChevronDown, Settings } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(
    typeof window !== 'undefined' ? document.documentElement.className.includes('dark') ? 'dark' : 'light' : 'light'
  );

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() && location.pathname === '/posts') {
        const params = new URLSearchParams(window.location.search);
        params.set('query', searchQuery);
        navigate(`/posts?${params.toString()}`, { replace: true });
      } else if (!searchQuery.trim() && location.pathname === '/posts') {
        const params = new URLSearchParams(window.location.search);
        params.delete('query');
        navigate(`/posts?${params.toString()}`, { replace: true });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, location.pathname, navigate]);

  // Sync search input with URL on page load/navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query');
    if (query) setSearchQuery(query);
  }, [location.search]);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
      setTheme('light');
    }
  };

  useEffect(() => {
    // Check theme on mount
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    // Close menus on click outside
    const handleClickOutside = (e) => {
      if (isProfileOpen && !e.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isProfileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  const authLinks = [
    { to: '/posts', label: 'Home', icon: <HomeIcon className="w-4 h-4 mr-2" /> },
    ...(user && user.isAdmin ? [{ to: '/create-post', label: 'Write', icon: <PlusSquare className="w-4 h-4 mr-2" /> }] : []),
  ];

  const publicLinks = [
    { to: '/', label: 'Home', icon: <HomeIcon className="w-4 h-4 mr-2" /> },
  ];

  const linksToUse = user ? authLinks : publicLinks;

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/posts')}>
            <span className="text-xl font-mono font-bold text-foreground flex items-center">
              <span className="text-primary mr-1">&lt;</span>
              BlogSpace
              <span className="text-primary ml-1">/&gt;</span>
            </span>
          </div>

          {/* Search Bar - Desktop */}
          {user && location.pathname === '/posts' && (
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-1.5 border border-border rounded-lg bg-muted/50 text-sm placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-mono"
                  placeholder="Search posts..."
                />
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2 items-center">
            {linksToUse.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center text-sm font-medium transition-all hover:text-primary px-3 py-1.5 rounded-md ${
                    isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
            
            <div className="w-px h-6 bg-border mx-2" />

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-border mb-1">
                      <p className="text-sm font-bold text-foreground truncate">{user.username || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                      className="flex w-full items-center px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </button>
                    <button
                      onClick={() => { navigate('/dashboard'); setIsProfileOpen(false); }}
                      className="flex w-full items-center px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Dashboard
                    </button>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              location.pathname !== '/login' && location.pathname !== '/signup' && (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
              )
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-foreground p-2 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">

            {/* Mobile Search — only on /posts */}
            {user && location.pathname === '/posts' && (
              <div className="relative mb-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-muted/50 text-sm placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-mono"
                  placeholder="Search posts..."
                />
              </div>
            )}

            {linksToUse.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <button
                  onClick={() => { navigate('/profile'); closeMenu(); }}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </button>
                <button
                  onClick={() => { navigate('/dashboard'); closeMenu(); }}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              location.pathname !== '/login' && location.pathname !== '/signup' && (
                <button
                  onClick={() => {
                    navigate('/login');
                    closeMenu();
                  }}
                  className="flex w-full mt-4 items-center justify-center bg-primary text-primary-foreground px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign In
                </button>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar; 