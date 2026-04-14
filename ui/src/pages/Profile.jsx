import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import PostsGrid from '../components/PostsGrid';
import { Loader2, AlertCircle, Pencil, X, Save, Eye, EyeOff, KeyRound, UserIcon } from 'lucide-react';

// ────────────────────────────────────────────────────────────
// Edit Profile Modal
// ────────────────────────────────────────────────────────────
const EditProfileModal = ({ user, onClose, onSaved }) => {
  const { addToast } = useToast();
  const [username, setUsername] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'password'

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { username, email };
      if (activeTab === 'password') {
        if (newPassword.length < 6) {
          addToast({ type: 'error', title: 'Invalid Password', message: 'Password must be at least 6 characters.' });
          setLoading(false);
          return;
        }
        payload.password = newPassword;
      }
      await api.put(`/api/users/${user.id}`, payload);
      addToast({ type: 'success', title: 'Profile Updated', message: 'Your profile has been updated successfully.' });
      onSaved({ ...user, username, email });
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile. Please try again.';
      addToast({ type: 'error', title: 'Update Failed', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'info'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'password'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Change Password
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {activeTab === 'info' ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm"
                  placeholder="Your username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm"
                  placeholder="Your email address"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Your current session will remain active after the change.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {activeTab === 'password' ? 'Change Password' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// Profile Page
// ────────────────────────────────────────────────────────────
const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [createdPosts, setCreatedPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLocalUser(user);

    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const [createdResponse, likedResponse] = await Promise.all([
          api.get(`/api/posts/user/${user.id}/posts`),
          api.get(`/api/posts/user/${user.id}/liked/posts`),
        ]);

        setCreatedPosts(
          createdResponse.data.posts || createdResponse.data.data || createdResponse.data || []
        );
        setLikedPosts(
          likedResponse.data.posts || likedResponse.data.data || likedResponse.data || []
        );
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setAlert({
          type: 'error',
          message: 'Failed to fetch profile data. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center mt-16 p-6 bg-card rounded-xl border border-border shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Please log in to view your profile.</h2>
      </div>
    );
  }

  const displayUser = localUser || user;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Profile Header Card */}
      <div className="aryan-block flex flex-col items-center text-center p-12 mb-10 shadow-md relative">
        {/* Edit button — top right */}
        <button
          onClick={() => setEditOpen(true)}
          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit Profile
        </button>

        <div className="w-24 h-24 bg-primary/10 border-2 border-primary/20 text-primary rounded-full flex items-center justify-center text-4xl font-bold mb-6">
          {displayUser.username?.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-1 tracking-tight">{displayUser.username}</h1>
        <p className="text-muted-foreground mb-8 font-mono text-sm">{displayUser.email}</p>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-md pt-8 border-t border-border/40">
          <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 hover:border-primary/30 transition-all group">
            <p className="text-3xl font-bold text-foreground font-mono group-hover:text-primary transition-colors">{createdPosts.length}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Posts Created</p>
          </div>
          <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 hover:border-primary/30 transition-all group">
            <p className="text-3xl font-bold text-foreground font-mono group-hover:text-primary transition-colors">{likedPosts.length}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Posts Liked</p>
          </div>
        </div>
      </div>

      {alert && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          alert.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-600 dark:text-green-500'
        }`}>
          <AlertCircle className="w-5 h-5" />
          <span>{alert.message}</span>
          <button 
            className="ml-auto opacity-70 hover:opacity-100" 
            onClick={() => setAlert(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border w-full flex justify-center mb-8">
        <div className="flex space-x-8">
          <button
            onClick={() => setTabIndex(0)}
            className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${
              tabIndex === 0 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            My Posts
          </button>
          <button
            onClick={() => setTabIndex(1)}
            className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${
              tabIndex === 1 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            Liked Posts
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="w-full">
        {tabIndex === 0 && (
          <div>
            {createdPosts.length > 0 ? (
              <PostsGrid posts={createdPosts} />
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                You have not created any posts yet.
              </div>
            )}
          </div>
        )}
        
        {tabIndex === 1 && (
          <div>
            {likedPosts.length > 0 ? (
              <PostsGrid posts={likedPosts} />
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                You have not liked any posts yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <EditProfileModal
          user={displayUser}
          onClose={() => setEditOpen(false)}
          onSaved={(updatedUser) => setLocalUser(updatedUser)}
        />
      )}
    </div>
  );
};

export default Profile;
