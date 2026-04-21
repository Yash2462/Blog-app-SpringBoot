import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow, isValid } from 'date-fns';
import PropTypes from 'prop-types';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { Heart, MessageSquare, Trash2, Clock, Code2, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PostsGrid = ({ posts = [], onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [postStats, setPostStats] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    const initialLikedPosts = new Set();
    if (user && posts.length > 0) {
      posts.forEach((post) => {
        const postId = post.postId || post.id;
        if (post.likedBy?.some((like) => like.id === user.id)) {
          initialLikedPosts.add(postId);
        }
      });
      setLikedPosts(initialLikedPosts);
    }

    const fetchAllStats = async () => {
      if (posts.length === 0) return;
      const entries = await Promise.all(
        posts
          .map((post) => post.postId || post.id)
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
  }, [posts, user]);

  const handleLikeClick = async (e, postId) => {
    e.stopPropagation();
    if (!user) return;
    const wasLiked = likedPosts.has(postId);
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (wasLiked) next.delete(postId); else next.add(postId);
      return next;
    });
    setPostStats(prev => ({
      ...prev,
      [postId]: { ...prev[postId], likes: (prev[postId]?.likes || 0) + (wasLiked ? -1 : 1) }
    }));
    try { await api.post(`/api/posts/${postId}/like/user/${user.id}`); } catch (err) { console.error(err); }
  };

  const stripMarkdown = (text) => {
    if (!text) return '';
    return text.replace(/[#*`>~]/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').trim();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
      {posts.map((post, index) => {
        const postId = post.postId || post.id;
        const isLiked = likedPosts.has(postId);
        const stats = postStats[postId] || { likes: 0, comments: 0 };
        const wordCount = (post.data || '').split(' ').length;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));

        return (
          <motion.div
            key={postId}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group clean-card overflow-hidden flex flex-col h-full bg-card"
          >
            {/* Image Section */}
            <Link to={`/posts/${postId}`} className="block relative aspect-video overflow-hidden">
              {post.postImage ? (
                <img 
                  src={post.postImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <Code2 className="w-10 h-10 text-muted-foreground/20" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/95 dark:bg-black/95 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10 shadow-sm">
                  {post.type?.replace('_', ' ') || 'ARTICLE'}
                </span>
              </div>
            </Link>

            {/* Content Section */}
            <div className="flex flex-col flex-grow p-6 space-y-4">
              <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {readTime} MIN READ</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'RECENT'}</span>
              </div>

              <Link to={`/posts/${postId}`} className="block group/title">
                <h2 className="text-xl font-bold text-foreground leading-tight group-hover/title:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
              </Link>

              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {stripMarkdown(post.data)}
              </p>

              {/* Bottom Actions */}
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                    {post.user?.username?.[0].toUpperCase() || 'A'}
                  </div>
                  <span className="text-[11px] font-bold text-foreground/70">{post.user?.username || 'Author'}</span>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => handleLikeClick(e, postId)}
                    className={`flex items-center gap-1.5 text-[11px] font-bold transition-all ${isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    {stats.likes}
                  </button>
                  <Link to={`/posts/${postId}`} className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground hover:text-primary transition-all">
                    <MessageSquare className="w-4 h-4" />
                    {stats.comments}
                  </Link>
                  {onDelete && user && (post.user?.id === user.id || user.roles?.some(r => r.name === 'ADMIN')) && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(postId); }}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

PostsGrid.propTypes = {
  posts: PropTypes.array,
  onDelete: PropTypes.func
};

export default PostsGrid;
