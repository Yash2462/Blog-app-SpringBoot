import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, X, Loader2, Code2, BookOpen, Terminal, ShieldAlert, Image as ImageIcon } from 'lucide-react';
import api from '../api/axios';

const PostForm = ({ open, onClose, onSubmit, post, loading = false }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.data || '');
  const [categoryId, setCategoryId] = useState(post?.category?.id || '');
  const [postImage, setPostImage] = useState(post?.postImage || '');
  const [type, setType] = useState(post?.type || 'BLOG');
  const [difficulty, setDifficulty] = useState(post?.difficulty || 'MEDIUM');
  const [solutionCode, setSolutionCode] = useState(post?.solutionCode || '');
  const [techStack, setTechStack] = useState(post?.techStack || '');
  
  const [activeTab, setActiveTab] = useState(0); // 0 = Write, 1 = Preview
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    if (open) fetchCategories();
  }, [open]);

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setContent(post.data || '');
      setCategoryId(post.category?.id || '');
      setPostImage(post.postImage || '');
      setType(post.type || 'BLOG');
      setDifficulty(post.difficulty || 'MEDIUM');
      setSolutionCode(post.solutionCode || '');
      setTechStack(post.techStack || '');
    } else {
      setTitle(''); setContent(''); setCategoryId(''); setPostImage('');
      setType('BLOG'); setDifficulty('MEDIUM'); setSolutionCode(''); setTechStack('');
    }
  }, [post, open]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await api.get('/api/category');
      setCategories(res.data.data || res.data || []);
    } catch (err) { setError('Failed to load categories'); }
    finally { setCategoriesLoading(false); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content || !categoryId) { setError('Please fill all required fields.'); return; }
    onSubmit({
      title, data: content, categoryId, postImage, type,
      difficulty: type === 'PRACTICE_PROBLEM' ? difficulty : null,
      solutionCode: type === 'PRACTICE_PROBLEM' ? solutionCode : null,
      techStack: type === 'CHEAT_SHEET' ? techStack : null,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="bg-card w-full max-w-5xl rounded-3xl shadow-2xl border border-border flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tight uppercase">
              {post ? 'Edit Article' : 'Draft New Insight'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl transition-colors">
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 text-sm font-bold flex items-center gap-3">
              <ShieldAlert className="w-5 h-5" /> {error}
            </div>
          )}
          
          <form className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Article Title</label>
              <input
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all font-bold text-lg"
                placeholder="Enter a descriptive title..."
              />
            </div>

            <div className="md:col-span-4 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
              <select
                value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all font-bold"
              >
                <option value="" disabled>Select Path</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>

            <div className="md:col-span-4 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Log Type</label>
              <select
                value={type} onChange={(e) => setType(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all font-bold"
              >
                <option value="BLOG">BLOG POST</option>
                <option value="PRACTICE_PROBLEM">DSA PROBLEM</option>
                <option value="CHEAT_SHEET">CHEAT SHEET</option>
                <option value="INTERVIEW_QUESTION">INTERVIEW Q</option>
              </select>
            </div>

            <div className="md:col-span-8 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Hero Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="url" value={postImage} onChange={(e) => setPostImage(e.target.value)}
                  className="w-full pl-12 pr-5 py-3 rounded-2xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all font-medium"
                  placeholder="https://assets.yash.com/image.png"
                />
              </div>
            </div>

            {type === 'PRACTICE_PROBLEM' && (
              <>
                <div className="md:col-span-4 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Difficulty</label>
                  <select
                    value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all font-bold"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
                <div className="md:col-span-12 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Optimal Solution Code</label>
                  <div className="rounded-2xl border border-border overflow-hidden">
                    <MDEditor value={solutionCode} onChange={setSolutionCode} preview="edit" height={200} />
                  </div>
                </div>
              </>
            )}

            <div className="md:col-span-12 space-y-4">
              <div className="flex border-b border-border">
                <button type="button" onClick={() => setActiveTab(0)} className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 0 ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>[Write Buffer]</button>
                <button type="button" onClick={() => setActiveTab(1)} className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 1 ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>[Final Render]</button>
              </div>
              <div className="min-h-[400px]">
                {activeTab === 0 ? (
                  <div className="rounded-2xl border border-border overflow-hidden bg-background">
                    <MDEditor value={content} onChange={setContent} preview="edit" height={400} />
                  </div>
                ) : (
                  <div className="p-8 border border-border bg-secondary/20 rounded-2xl min-h-[400px]">
                     <ReactMarkdown className="prose prose-slate dark:prose-invert max-w-none">{content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-border bg-secondary/30 flex justify-end gap-4">
          <button onClick={onClose} className="px-8 py-3 rounded-2xl font-bold text-muted-foreground hover:bg-secondary transition-all">Cancel</button>
          <button
            onClick={handleSubmit} disabled={loading}
            className="px-12 py-3 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : post ? 'Update Post' : 'Publish Article'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PostForm;
