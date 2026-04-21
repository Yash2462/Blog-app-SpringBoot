import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import PostsGrid from '../components/PostsGrid';
import { Search, ChevronLeft, ChevronRight, LayoutGrid, FileText, Code2, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const PAGE_SIZE = 12;

const Posts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const params = new URLSearchParams(location.search);
  const selectedType = params.get('type') || 'BLOG';
  const urlQuery = params.get('query') || '';

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPage = async (page) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/posts?page=${page}&size=${PAGE_SIZE}&type=${selectedType}`);
      const wrapper = res.data.data || {};
      setPosts(wrapper.data || []);
      setTotalPages(wrapper.totalPages ?? 1);
      setCurrentPage(wrapper.currentPage ?? page);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const catRes = await api.get('/api/category');
        setCategories(catRes.data.data || res.data || []);
      } catch (err) { console.error(err); }
      
      if (selectedType !== 'BLOG') {
        const typeRes = await api.get(`/api/posts/type/${selectedType}`);
        const data = typeRes.data.data || typeRes.data || [];
        setPosts(data);
        setTotalPages(1);
        setLoading(false);
      } else {
        await fetchPage(0);
      }
    };
    fetchInitial();
  }, [selectedType]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];
    if (selectedType === 'BLOG' && selectedCategory !== 'All') {
      result = result.filter(p => p.category?.name === selectedCategory);
    }
    if (searchQuery) {
      result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [posts, selectedCategory, selectedType, searchQuery]);

  const typeInfo = {
    BLOG: { title: 'Technical Articles', icon: <FileText className="w-5 h-5" />, desc: 'Deep dives into system design, frameworks, and architecture.' },
    PRACTICE_PROBLEM: { title: 'Practice Problems', icon: <Code2 className="w-5 h-5" />, desc: 'Sharpen your logic with algorithmic challenges and optimal solutions.' },
    CHEAT_SHEET: { title: 'Cheat Sheets', icon: <Layers className="w-5 h-5" />, desc: 'Rapid reference guides for languages, APIs, and devops tools.' }
  };

  const currentInfo = typeInfo[selectedType] || typeInfo.BLOG;

  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-background pt-32 pb-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-20 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
            {currentInfo.icon} {selectedType.replace('_', ' ')}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground uppercase">
            {currentInfo.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
            {currentInfo.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-12">
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/50 flex items-center gap-3">
                <Search className="w-4 h-4" /> Filter Records
              </h3>
              <input
                type="text"
                placeholder="Search by title..."
                className="w-full px-6 py-4 bg-white dark:bg-card border border-border rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* ONLY SHOW CATEGORIES FOR BLOGS (ARTICLES) */}
            {selectedType === 'BLOG' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/50 flex items-center gap-3">
                  <LayoutGrid className="w-4 h-4" /> Article Categories
                </h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`text-left px-6 py-3.5 rounded-2xl text-sm font-black transition-all ${
                      selectedCategory === 'All' 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    ALL ARTICLES
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`text-left px-6 py-3.5 rounded-2xl text-sm font-black transition-all ${
                        selectedCategory === cat.name 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {cat.name.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUICK NAV FOR PROBLEMS */}
            {selectedType === 'PRACTICE_PROBLEM' && (
              <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                <h4 className="text-xs font-black text-primary uppercase tracking-widest">Problem Sheets</h4>
                <p className="text-xs text-slate-500 font-bold leading-relaxed uppercase">
                  Curated algorithmic challenges categorized by difficulty and pattern.
                </p>
                <Link to="/posts?type=BLOG" className="block text-[10px] font-black text-primary hover:underline uppercase tracking-tighter">
                  &gt; Switch to Articles
                </Link>
              </div>
            )}
          </aside>

          {/* Main Grid */}
          <main className="lg:col-span-9 space-y-12">
            <div className="flex items-center justify-between border-b border-border pb-8">
              <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                Found {filteredPosts.length} Matching Records
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-96 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] animate-pulse" />
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="py-32 text-center space-y-6 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-border">
                <Search className="w-16 h-12 text-slate-200 mx-auto" />
                <p className="text-slate-400 font-black uppercase tracking-widest">No entries detected.</p>
                <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="text-primary font-black uppercase text-xs hover:underline">Clear Search</button>
              </div>
            ) : (
              <PostsGrid posts={filteredPosts} />
            )}

            {selectedType === 'BLOG' && totalPages > 1 && (
              <div className="flex justify-center items-center gap-8 pt-16">
                <button
                  onClick={() => fetchPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-4 rounded-2xl bg-white dark:bg-card border border-border hover:border-primary disabled:opacity-20 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-xs font-black uppercase tracking-widest">SYSTEM_PAGE {currentPage + 1} / {totalPages}</span>
                <button
                  onClick={() => fetchPage(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="p-4 rounded-2xl bg-white dark:bg-card border border-border hover:border-primary disabled:opacity-20 transition-all shadow-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Posts;
