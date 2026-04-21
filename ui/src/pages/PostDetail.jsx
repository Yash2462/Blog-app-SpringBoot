import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import CommentsDrawer from '../components/CommentsDrawer';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Copy, Check, ArrowLeft, Loader2, MessageSquare, 
  Share2, Calendar, Clock, Heart, Pencil, 
  ChevronRight, BookOpen, AlertCircle, Terminal
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const CodeBlock = ({ language, value, title }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-8 rounded-2xl overflow-hidden border border-border shadow-lg">
      <div className="flex items-center justify-between px-6 py-3 bg-[#1a1b26] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">
            {title || language || 'CODE'}
          </span>
        </div>
        <button onClick={handleCopy} className="text-white/40 hover:text-white transition-colors">
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.7',
          backgroundColor: '#1a1b26'
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
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/api/posts/${postId}`);
        const data = res.data.data || res.data;
        setPost(data);
        setLikeCount(data.likedBy?.length || 0);
        if (user) setLiked(data.likedBy?.some(u => u.id === user.id));

        const content = data.data || '';
        const headingRegex = /^#+\s+(.*)$/gm;
        const found = [];
        let match;
        while ((match = headingRegex.exec(content)) !== null) {
          const text = match[1];
          const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          found.push({ id, text, level: match[0].split(' ')[0].length });
        }
        setHeadings(found);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchPost();
  }, [postId, user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground font-bold">
      Article not found.
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation / Breadcrumbs */}
        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-12">
          <Link to="/posts" className="hover:text-primary transition-colors">Archive</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary">{post.type?.replace('_', ' ')}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Content */}
          <main className="lg:col-span-8">
            <article>
              <header className="space-y-8 mb-16">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                    {post.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
                        {post.user?.username?.[0].toUpperCase()}
                      </div>
                      <span className="text-foreground">{post.user?.username}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {format(new Date(post.createdAt || Date.now()), 'MMM dd, yyyy')}</div>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 5 MIN READ</div>
                  </div>
                </div>

                {post.postImage && (
                  <div className="rounded-3xl overflow-hidden border border-border shadow-2xl">
                    <img src={post.postImage} alt={post.title} className="w-full h-full object-cover max-h-[500px]" />
                  </div>
                )}
              </header>

              {/* Specialized Fields */}
              {post.type === 'PRACTICE_PROBLEM' && post.difficulty && (
                <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border mb-8 ${
                  post.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                  post.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                  'bg-rose-500/10 text-rose-600 border-rose-500/20'
                }`}>
                  {post.difficulty} DIFFICULTY
                </div>
              )}

              {/* Content Body */}
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed prose-code:text-primary prose-a:text-primary">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => {
                      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return <h2 id={id} className="scroll-mt-24 pt-8">{children}</h2>;
                    },
                    h3: ({ children }) => {
                      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return <h3 id={id} className="scroll-mt-24 pt-4">{children}</h3>;
                    },
                    code({inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} {...props} />
                      ) : (
                        <code className="px-1.5 py-0.5 rounded-md bg-secondary text-primary font-bold text-sm" {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {post.data}
                </ReactMarkdown>
              </div>

              {/* Practice Solution */}
              {post.type === 'PRACTICE_PROBLEM' && post.solutionCode && (
                <div className="mt-20 border-t border-border pt-16">
                  <div className="bg-secondary/50 rounded-3xl p-8 md:p-12 border border-border space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 uppercase">
                          <Terminal className="w-6 h-6 text-primary" /> Verified Solution
                        </h3>
                        <p className="text-muted-foreground font-medium">Analyze the optimal logic and implementation for this problem.</p>
                      </div>
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                      >
                        {showSolution ? 'Hide Solution' : 'View Solution'}
                      </button>
                    </div>
                    <AnimatePresence>
                      {showSolution && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <CodeBlock language="java" value={post.solutionCode} title="Optimal_Solution.java" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Post Footer */}
              <footer className="mt-24 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-2xl font-black text-primary border border-primary/20 shadow-inner">
                    {post.user?.username?.[0].toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black tracking-tight">{post.user?.username}</h4>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Engineering Lead & Mentor</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCommentsOpen(true)}
                  className="flex items-center gap-3 px-10 py-4 border-2 border-primary text-primary font-black rounded-2xl hover:bg-primary hover:text-white transition-all active:scale-95 uppercase tracking-widest"
                >
                  <MessageSquare className="w-5 h-5" /> Discussion
                </button>
              </footer>
            </article>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-12">
              {headings.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3">
                    <div className="w-8 h-px bg-border" /> On This Page
                  </h3>
                  <nav className="flex flex-col gap-2">
                    {headings.map((h, i) => (
                      <a
                        key={i}
                        href={`#${h.id}`}
                        className={`text-sm font-bold transition-all hover:text-primary ${
                          activeId === h.id ? 'text-primary translate-x-2' : 'text-muted-foreground'
                        }`}
                        style={{ paddingLeft: `${(h.level - 2) * 1.5}rem` }}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              <div className="pt-10 border-t border-border space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Engage</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 py-3 rounded-2xl bg-secondary hover:bg-muted transition-all font-bold text-sm">
                    <Share2 className="w-4 h-4 text-primary" /> Share
                  </button>
                  <button className={`flex items-center justify-center gap-3 py-3 rounded-2xl border-2 transition-all font-bold text-sm ${liked ? 'bg-rose-500 border-rose-500 text-white' : 'border-border hover:border-rose-500 hover:text-rose-500'}`}>
                    <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} /> {likeCount}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <CommentsDrawer open={commentsOpen} onClose={() => setCommentsOpen(false)} postId={postId} />
    </div>
  );
};

export default PostDetail;
