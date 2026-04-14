import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import PostsGrid from '../components/PostsGrid';
import { Loader2, PlusSquare, User, BookOpen, Heart, TrendingUp } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';


const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-primary/30 hover:shadow-md transition-all group">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground font-mono group-hover:text-primary transition-colors">{value}</p>
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [myPosts, setMyPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [totalLikesReceived, setTotalLikesReceived] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // postId to confirm delete

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const [myPostsRes, likedPostsRes] = await Promise.all([
          api.get(`/api/posts/user/${user.id}/posts`),
          api.get(`/api/posts/user/${user.id}/liked/posts`),
        ]);

        const myPostsData = myPostsRes.data.data || myPostsRes.data.posts || myPostsRes.data || [];
        const likedPostsData = likedPostsRes.data.data || likedPostsRes.data.posts || likedPostsRes.data || [];

        setMyPosts(Array.isArray(myPostsData) ? myPostsData : []);
        setLikedPosts(Array.isArray(likedPostsData) ? likedPostsData : []);

        // Compute total likes received on user's posts
        const totalLikes = myPostsData.reduce((sum, post) => sum + (post.likedBy?.length || 0), 0);
        setTotalLikesReceived(totalLikes);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleDeleteRequest = (postId) => {
    setDeleteConfirm(postId);
  };

  const handleDeleteConfirm = async () => {
    const postId = deleteConfirm;
    setDeleteConfirm(null);
    // Optimistic update
    setMyPosts((prev) => prev.filter((p) => (p.id || p._id || p.postId) !== postId));
    try {
      await api.delete(`/api/posts/${postId}`);
      addToast({ type: 'success', title: 'Post Deleted', message: 'Your post was deleted successfully.' });
    } catch (err) {
      console.error('Failed to delete post:', err);
      addToast({ type: 'error', title: 'Delete Failed', message: 'Could not delete the post. Please try again.' });
      // Refetch to restore correct state
      const res = await api.get(`/api/posts/user/${user.id}/posts`);
      setMyPosts(res.data.data || res.data.posts || res.data || []);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show only the 3 most recent posts
  const recentPosts = myPosts.slice(0, 3);

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, <span className="text-primary">{user?.username || 'Writer'}</span> 👋
        </h1>
        <p className="mt-1 text-muted-foreground">Here's a summary of your activity on BlogSpace.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-blue-500" />}
          label="Posts Written"
          value={myPosts.length}
          color="bg-blue-500/10"
        />
        <StatCard
          icon={<Heart className="w-6 h-6 text-red-500" />}
          label="Likes Received"
          value={totalLikesReceived}
          color="bg-red-500/10"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-green-500" />}
          label="Posts Liked"
          value={likedPosts.length}
          color="bg-green-500/10"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <button
          onClick={() => navigate('/create-post')}
          className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-2xl hover:bg-primary/20 hover:border-primary/40 transition-all text-primary font-semibold group"
        >
          <PlusSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Write a New Post
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 p-4 bg-muted border border-border rounded-2xl hover:bg-muted/80 hover:border-border/60 transition-all text-foreground font-semibold group"
        >
          <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
          View My Profile
        </button>
      </div>

      {/* Recent Posts */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border pb-3 w-full">
            My Recent Posts
          </h2>
        </div>

        {recentPosts.length > 0 ? (
          <>
            <PostsGrid posts={recentPosts} onDelete={handleDeleteRequest} />
            {myPosts.length > 3 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => navigate('/profile')}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
                >
                  View all {myPosts.length} posts on your profile →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed border-border">
            <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">You haven't written any posts yet.</p>
            <button
              onClick={() => navigate('/create-post')}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <PlusSquare className="w-4 h-4" />
              Write your first post
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Delete Post?</h3>
            <p className="text-sm text-muted-foreground mb-6">This action cannot be undone. The post will be permanently removed.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;