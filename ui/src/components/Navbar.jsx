import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Sun, Moon, Search, ChevronDown, User, LogOut, Settings, PlusSquare } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const isAdmin = user && user.roles && user.roles.some(r => r.name === 'ADMIN');

  const navLinks = [
    { to: '/posts', label: 'Articles' },
    { to: '/posts?category=Interview+Experience', label: 'Interview Experiences' },
    { to: '/posts?type=INTERVIEW_QUESTION', label: 'Questions' },
    { to: '/dsa-sheets', label: 'DSA Sheets' },
    { to: '/crash-course', label: 'Crash Course' },
    { to: '/posts?category=System+Design', label: 'System Design' },
    { to: '/posts?category=Contest+Solution', label: 'Contest Solutions' },
    { to: '/contact', label: 'Contact Us' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
      isScrolled ? 'glass-effect py-2 shadow-sm' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 group whitespace-nowrap mr-8">
            <span className="text-2xl font-mono font-bold tracking-tighter text-foreground group-hover:text-primary transition-colors">
              &lt;<span className="text-primary">code</span>WithYash&gt;
            </span>
          </Link>

          {/* Desktop Links - Scrollable on small desktops if many items */}
          <div className="hidden xl:flex items-center gap-1 overflow-x-auto no-scrollbar">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-[11px] font-black uppercase tracking-widest transition-colors hover:text-primary whitespace-nowrap ${
                    isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Section: Theme & Auth */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Theme Toggle placeholder if needed later */}
            
            {user ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link 
                    to="/create-post" 
                    className="p-2.5 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                    title="Create Entry"
                  >
                    <PlusSquare className="w-5 h-5" />
                  </Link>
                )}
                
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full border border-border bg-white dark:bg-card hover:border-primary/50 transition-all shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs">
                      {user.username?.[0].toUpperCase() || 'Y'}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-4 w-60 bg-white dark:bg-card border border-border rounded-[2rem] shadow-2xl py-4 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-6 py-4 border-b border-border mb-2">
                        <p className="text-sm font-black text-foreground truncate">{user.username}</p>
                        <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest">{user.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-slate-500 hover:bg-secondary hover:text-primary transition-colors">
                        <User className="w-4 h-4" /> ID_CARD
                      </Link>
                      <Link to="/dashboard" className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-slate-500 hover:bg-secondary hover:text-primary transition-colors">
                        <Settings className="w-4 h-4" /> TERMINAL
                      </Link>
                      <div className="h-px bg-border my-2 mx-6" />
                      <button 
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-6 py-3 text-sm font-black text-rose-500 hover:bg-rose-50 transition-colors uppercase tracking-widest"
                      >
                        <LogOut className="w-4 h-4" /> Disconnect
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="hidden sm:block text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="px-8 py-3 bg-primary text-white text-xs font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
                  Join Now
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-slate-500 hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-card border-t border-border py-6 animate-in slide-in-from-top-4 duration-300">
          <div className="px-6 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${
                    isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-secondary hover:text-foreground'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!user && (
              <div className="pt-6 grid grid-cols-2 gap-4">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-xs font-black text-center border border-border rounded-2xl uppercase tracking-widest">Login</Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 text-xs font-black text-center bg-primary text-white rounded-2xl shadow-lg uppercase tracking-widest">Join</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
