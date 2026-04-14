import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CommentsDrawer from '../components/CommentsDrawer';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, ArrowLeft, Loader2, MessageSquare, Share2, Calendar, Clock, Heart, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mt-6 mb-4 rounded-xl overflow-hidden bg-[#1e1e1e] border border-border">
      <div className="absolute right-2 top-2 z-10 flex items-center">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          padding: '2.5rem 1rem 1rem 1rem',
          fontSize: '0.9rem',
          backgroundColor: 'transparent'
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [sharecopied, setShareCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);

  // Fetch the current post and the full post list to enable Prev/Next navigation
  const [postsList, setPostsList] = useState([]);
  const [prevPostId, setPrevPostId] = useState(null);
  const [nextPostId, setNextPostId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, listRes] = await Promise.all([
          api.get(`/api/posts/${postId}`),
          api.get('/api/posts')
        ]);
        const postData = postRes.data.data || postRes.data.post || postRes.data;
        if (postData && (postData.id || postData._id || postData.postId)) {
          setPost(postData);
          const likedByList = postData.likedBy || [];
          setLikeCount(likedByList.length);
          if (user) {
            setLiked(likedByList.some(u => u.id === user.id));
          }
        } else {
          setError('Post not found');
        }
        const listData = listRes.data.data || listRes.data.posts || listRes.data;
        const sorted = (Array.isArray(listData) ? listData : []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setPostsList(sorted);
        const currentId = postData.id || postData._id || postData.postId;
        const idx = sorted.findIndex(p => (p.id || p._id || p.postId) === currentId);
        if (idx !== -1) {
          setPrevPostId(idx > 0 ? (sorted[idx - 1].id || sorted[idx - 1]._id || sorted[idx - 1].postId) : null);
          setNextPostId(idx < sorted.length - 1 ? (sorted[idx + 1].id || sorted[idx + 1]._id || sorted[idx + 1].postId) : null);
        }
      } catch (err) {
        console.error('Error fetching post or list:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId, user]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleLike = async () => {
    if (!user || liking) return;
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount(prev => prev + (wasLiked ? -1 : 1));
    setLiking(true);
    try {
      await api.post(`/api/posts/${postId}/like/user/${user.id}`);
    } catch (err) {
      console.error('Failed to like post:', err);
      // Revert on error
      setLiked(wasLiked);
      setLikeCount(prev => prev + (wasLiked ? 1 : -1));
    } finally {
      setLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="relative min-h-[calc(100vh-64px)] p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="max-w-2xl mx-auto mt-12 bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 flex items-center">
          <span className="font-semibold">{error || 'Post not found'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-background py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="flex items-center mb-6 space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          {prevPostId && (
            <button
              onClick={() => navigate(`/posts/${prevPostId}`)}
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Prev
            </button>
          )}
          {nextPostId && (
            <button
              onClick={() => navigate(`/posts/${nextPostId}`)}
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Next
              <ArrowLeft className="w-4 h-4 ml-1 transform rotate-180" />
            </button>
          )}
        </div>

        {/* Post Card */}
        <div className="bg-card border border-border shadow-sm rounded-3xl overflow-hidden p-6 sm:p-10 md:p-12">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="post-title">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm text-muted-foreground border-b border-border pb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider text-[10px]">
                {post.category?.name || 'Uncategorized'}
              </span>
              
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 opacity-70" />
                <span>{post.createdAt ? format(new Date(post.createdAt), 'MMMM dd, yyyy') : 'Recently Published'}</span>
              </div>

              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 opacity-70" />
                <span>{Math.max(1, Math.ceil(((post.data || post.content || '').split(' ').length) / 200))} min read</span>
              </div>

              <div className="flex items-center">
                By <strong className="ml-1.5 text-foreground">{post.user?.username || 'Writer'}</strong>
              </div>

              <div className="ml-auto flex items-center gap-2">
                {/* Like button */}
                <button
                  onClick={handleLike}
                  disabled={liking || !user}
                  className={`flex items-center gap-1.5 font-medium border px-3 py-1.5 rounded-lg transition-all ${
                    liked 
                      ? 'border-red-400/50 bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                      : 'border-border hover:text-red-500 hover:border-red-400/50 hover:bg-red-500/10'
                  }`}
                  title={!user ? 'Log in to like' : liked ? 'Unlike' : 'Like'}
                >
                  <Heart className={`w-4 h-4 transition-transform ${liked ? 'fill-red-500 scale-110' : ''}`} />
                  <span>{likeCount}</span>
                </button>

                {/* Edit button — only for the post author */}
                {user && post.user?.id === user.id && (
                  <button
                    onClick={() => navigate(`/create-post?edit=${postId}`)}
                    className="flex items-center gap-2 hover:text-primary transition-colors font-medium border border-border px-3 py-1.5 rounded-lg hover:bg-accent"
                    title="Edit this post"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 hover:text-primary transition-colors font-medium border border-border px-3 py-1.5 rounded-lg hover:bg-accent"
                >
                  {sharecopied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                  {sharecopied ? 'Copied!' : 'Share'}
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.postImage && (
            <div className="mb-10 rounded-2xl overflow-hidden bg-muted border border-border/50 max-h-[500px] flex items-center justify-center">
              <img
                src={post.postImage}
                alt={post.title}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Post Content */}
          <div className="max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <div className="post-heading">
                    <span className="aryan-syntax">#</span>
                    <span className="font-bold text-xl">{children}</span>
                  </div>
                ),
                h2: ({ children }) => (
                  <div className="post-heading">
                    <span className="aryan-syntax">##</span>
                    <span className="font-bold text-lg">{children}</span>
                  </div>
                ),
                h3: ({ children }) => (
                  <div className="post-heading">
                    <span className="aryan-syntax">###</span>
                    <span className="font-bold">{children}</span>
                  </div>
                ),
                p: ({ children }) => {
                  // If children is empty or just whitespace/newlines, don't render a block
                  const isEmpty = React.Children.toArray(children).every(child => 
                    typeof child === 'string' && child.trim() === ''
                  );
                  if (isEmpty) return null;
                  
                  return (
                    <div className="aryan-block">
                      {children}
                    </div>
                  );
                },
                ul: ({ children }) => (
                  <div className="aryan-block space-y-2">
                    {children}
                  </div>
                ),
                li: ({ children }) => (
                  <div className="flex items-start">
                    <span className="aryan-syntax">•</span>
                    <span>{children}</span>
                  </div>
                ),
                blockquote: ({ children }) => (
                  <div className="aryan-block border-l-4 border-primary/20">
                    <span className="aryan-syntax">&gt;</span>
                    <span className="italic opacity-80">{children}</span>
                  </div>
                ),
                img: ({ src, alt, title }) => {
                  let width = '100%';
                  if (title && title.startsWith('width=')) width = title.replace('width=', '');
                  return <img src={src} alt={alt} style={{ width, margin: '20px auto' }} className="rounded-lg shadow-md border border-border" />;
                },
                code({inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <CodeBlock
                      language={match[1]}
                      value={String(children).replace(/\n$/, '')}
                      {...props}
                    />
                  ) : (
                    <code className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {post.data || post.content}
            </ReactMarkdown>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 pt-12 border-t border-border">
            
            {/* Author Section */}
            <div className="flex items-center gap-4 mb-12 p-6 rounded-2xl bg-muted/40 border border-border/50">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
                {(post.user?.username || 'W')[0].toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-foreground">Written by {post.user?.username || 'Writer'}</h4>
                <p className="text-sm text-muted-foreground">Passionate about sharing knowledge and exploring the depth of tech and logic.</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground italic">
                Thanks for reading this article.
              </div>
              <button
                onClick={() => setCommentsOpen(true)}
                className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                View Comments
              </button>
            </div>
          </div>

        </div>
      </div>

      <CommentsDrawer
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        postId={postId}
      />
    </div>
  );
};

export default PostDetail;