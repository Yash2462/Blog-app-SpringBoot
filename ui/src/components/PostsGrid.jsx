import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, isValid } from 'date-fns';
import PropTypes from 'prop-types';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { Heart, MessageSquare, Trash2 } from 'lucide-react';

const PostsGrid = ({ posts = [], onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [postStats, setPostStats] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    const initialLikedPosts = new Set();
    if (user && posts.length > 0) {
      posts.forEach((post) => {
        const postId = post._id || post.id || post.postId;
        if (post.likedBy?.some((like) => like.id === user.id)) {
          initialLikedPosts.add(postId);
        }
      });
      setLikedPosts(initialLikedPosts);
    }

    const fetchAllStats = async () => {
      if (posts.length === 0) return;

      // Fetch stats for all posts concurrently instead of sequentially
      const entries = await Promise.all(
        posts
          .map((post) => post._id || post.id || post.postId)
          .filter((postId) => postId && !postStats[postId])
          .map(async (postId) => {
            try {
              const response = await api.get(`/api/posts/${postId}/stats`);
              return [postId, response.data.data || { likes: 0, comments: 0 }];
            } catch {
              return [postId, { likes: 0, comments: 0 }];
            }
          })
      );

      if (entries.length > 0) {
        setPostStats((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
      }
    };

    fetchAllStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, user]);

  const handleLikeClick = async (e, postId) => {
    e.stopPropagation();
    if (!user) return;

    const wasLiked = likedPosts.has(postId);
    const originalStats = { ...postStats };
    const originalLikedPosts = new Set(likedPosts);

    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (wasLiked) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });

    setPostStats((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        likes: (prev[postId]?.likes || 0) + (wasLiked ? -1 : 1),
      },
    }));

    try {
      await api.post(`/api/posts/${postId}/like/user/${user.id}`);
    } catch (error) {
      console.error('Failed to update like status', error);
      setPostStats(originalStats);
      setLikedPosts(originalLikedPosts);
    }
  };

  const handlePostClick = (post) => {
    const postId = post._id || post.id || post.postId;
    if (postId) {
      navigate(`/posts/${postId}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || !isValid(new Date(dateString))) return 'No date';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const stripMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/[#*`>~]/g, '') // Remove basic symbols
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Keep link text, remove URL
      .trim();
  };


  if (!posts || posts.length === 0) {
    return (
      <div className="w-full py-12 text-center text-muted-foreground">
        No posts available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      {posts.map((post) => {
        const postId = post._id || post.id || post.postId;
        if (!postId) return null;
        const isLiked = likedPosts.has(postId);
        const stats = postStats[postId] || { likes: 0, comments: 0 };

        return (
          <div
            key={postId}
            onClick={() => handlePostClick(post)}
            className="group flex flex-col glass-card rounded-sm overflow-hidden cursor-pointer hover:border-foreground transition-colors duration-300 h-full w-full"
          >
            {(post.postImage || post.imageUrl) && (
              <div className="w-full h-48 overflow-hidden bg-muted relative border-b border-border">
                <img
                  src={post.postImage || post.imageUrl}
                  alt={post.title || 'Post image'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            
            <div className="flex flex-col flex-grow p-5">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-flex items-center rounded-sm bg-muted px-2 py-0.5 text-[11px] font-mono text-foreground border border-border uppercase tracking-wide">
                  {post.category?.name || 'Uncategorized'}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground whitespace-nowrap pt-1">
                  {formatDate(post.createdAt || post.updatedAt)}
                </span>
              </div>
              
              <h2 className="text-lg font-bold text-foreground mb-3 line-clamp-2 leading-snug group-hover:underline decoration-foreground/50 transition-all duration-300">
                {post.title || 'Untitled Post'}
              </h2>
              
              <p className="text-sm font-mono text-muted-foreground/80 line-clamp-3 mb-5 flex-grow leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                {stripMarkdown(post.data || post.content) || 'No content available'}
              </p>


              {/* Reading time */}
              <div className="flex items-center space-x-1.5 text-[10px] font-mono text-muted-foreground mb-4 uppercase tracking-widest">
                <span>[{Math.max(1, Math.ceil(((post.data || post.content || '').split(' ').length) / 200))} min read]</span>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <div className="flex items-center space-x-2.5 w-32 truncate">
                  <div className="w-5 h-5 bg-muted border border-border flex items-center justify-center text-[10px] font-mono font-bold text-foreground">
                    {post.user?.username?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <span className="text-xs font-mono font-semibold text-foreground truncate">
                    @{post.user?.username || 'Anonymous'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <button
                    onClick={(e) => handleLikeClick(e, postId)}
                    className="flex items-center space-x-1.5 hover:text-foreground transition-colors group/btn"
                    title={isLiked ? 'Unlike' : 'Like'}
                  >
                    <Heart 
                      className={`w-[14px] h-[14px] transition-all duration-300 ${isLiked ? 'fill-foreground text-foreground' : ''}`} 
                    />
                    <span className="text-xs">{stats.likes}</span>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePostClick(post);
                    }}
                    className="flex items-center space-x-1 hover:text-primary transition-colors group/btn"
                    title="View Comments"
                  >
                    <MessageSquare className="w-[14px] h-[14px] transition-all duration-300" />
                    <span className="text-xs font-mono">{stats.comments}</span>
                  </button>

                  {onDelete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(postId); }}
                      className="flex items-center space-x-1 hover:text-red-500 transition-colors group/btn ml-auto"
                      title="Delete post"
                    >
                      <Trash2 className="w-[14px] h-[14px] transition-all duration-300" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

PostsGrid.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      data: PropTypes.string,
      content: PropTypes.string,
      postImage: PropTypes.string,
      imageUrl: PropTypes.string,
      category: PropTypes.shape({ name: PropTypes.string }),
      user: PropTypes.shape({ username: PropTypes.string }),
      likedBy: PropTypes.array,
    })
  ),
};

export default PostsGrid; 