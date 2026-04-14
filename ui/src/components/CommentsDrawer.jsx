import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { formatDistanceToNow } from 'date-fns';
import { X, Send, Trash2, Loader2, MessageSquare } from 'lucide-react';

const CommentsDrawer = ({ open, onClose, postId, onCommentAdded }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && postId) {
      fetchComments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, postId]);

  const fetchComments = async () => {
    if (!postId) {
      setError('No post ID provided');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/comments/post/${postId}`);
      const commentsData = res.data?.data || res.data || [];
      const actualComments = Array.isArray(commentsData) ? commentsData : commentsData.comments || [];
      setComments(actualComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user?.id || !postId) return;

    setSubmitting(true);
    setError('');
    try {
      await api.post(`/api/comments/user/${user.id}/post/${postId}/createComment`, {
        comment: newComment
      });
      setNewComment('');
      await fetchComments();
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!commentId) return;
    
    try {
      await api.delete(`/api/comments/${commentId}`);
      await fetchComments();
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-all duration-300 ease-in-out ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-sm sm:max-w-md bg-card border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card sticky top-0 z-10">
          <h2 className="text-lg font-mono font-bold flex items-center text-foreground uppercase tracking-wider">
            <span className="text-primary mr-2 cursor-pointer">&gt;</span> Comments
          </h2>
          <button 
            onClick={onClose}
            className="p-1 px-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted font-mono text-sm border border-transparent hover:border-border transition-all focus:outline-none"
            aria-label="Close comments"
          >
            [esc]
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-5 scroll-smooth custom-scrollbar">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-primary/40" />
              </div>
              <p className="text-sm">No comments yet.<br/>Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.commentId || comment.id || Math.random()} className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 group mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-muted border border-border flex items-center justify-center text-[9px] font-mono font-bold text-foreground">
                        {comment.user?.username?.[0]?.toUpperCase() || comment.user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <h4 className="text-xs font-mono font-semibold truncate text-foreground">
                        @{comment.user?.username || comment.user?.name || 'Anonymous'}
                      </h4>
                    </div>
                    <div className="flex items-center">
                      <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                        {comment.commentedAt || comment.createdAt 
                          ? formatDistanceToNow(new Date(comment.commentedAt || comment.createdAt), { addSuffix: true }) 
                          : 'Just now'}
                      </span>
                      {user?.id === comment.user?.id && (
                        <button 
                          onClick={() => handleDelete(comment.commentId || comment.id)}
                          className="ml-2 p-1 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          title="Delete comment"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="border border-border bg-card p-3 font-mono text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed break-words border-l-2 border-l-primary/50">
                    {comment.comment || comment.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Input Form */}
        <div className="p-4 border-t border-border bg-card">
          {!user ? (
            <div className="text-center p-3 font-mono text-xs text-muted-foreground bg-muted border border-border">
              &gt; Log in to join the conversation.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="❯ Write a comment..."
                disabled={submitting}
                className="flex-1 px-3 py-2 bg-background border border-input focus:outline-none focus:border-foreground font-mono text-sm placeholder:text-muted-foreground transition-colors rounded-none"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="flex items-center justify-center bg-foreground text-background px-4 py-2 hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-mono text-sm rounded-none tracking-wider uppercase font-bold"
                aria-label="Send comment"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SEND'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsDrawer; 