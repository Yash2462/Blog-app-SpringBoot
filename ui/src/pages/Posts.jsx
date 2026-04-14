import { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

import PostsGrid from '../components/PostsGrid';
import { Loader2, AlertCircle, Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 9;

const Posts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    new URLSearchParams(location.search).get('category') || 'All'
  );
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [urlQuery, setUrlQuery] = useState(new URLSearchParams(location.search).get('query') || '');
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const isFiltered = !!(urlQuery || selectedCategory !== 'All');

  // Helper to fetch paginated posts
  const fetchPage = async (page) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/posts?page=${page}&size=${PAGE_SIZE}`);
      const wrapper = res.data.data || {};
      const items = wrapper.data || [];
      setPosts(items);
      setTotalPages(wrapper.totalPages ?? 1);
      setTotalElements(wrapper.totalElements ?? items.length);
      setCurrentPage(wrapper.currentPage ?? page);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setAlert({ type: 'error', message: 'Failed to load posts. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const catRes = await api.get('/api/category');
        const categoriesData = catRes.data.categories || catRes.data.data || catRes.data || [];
        setCategories([{ id: 'All', name: 'All' }, ...categoriesData]);

        // Handle initial query from URL
        const params = new URLSearchParams(window.location.search);
        const query = params.get('query');
        
        if (query) {
          setUrlQuery(query);
          setSearchQuery(query);
          const searchRes = await api.get(`/api/posts/search?query=${encodeURIComponent(query)}`);
          const postsData = searchRes.data.posts || searchRes.data.data || searchRes.data || [];
          setPosts(postsData);
          setTotalPages(1);
        } else {
          await fetchPage(0);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setAlert({
          type: 'error',
          message: 'Failed to load the page. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Debounced search: auto-trigger 500ms after user stops typing in the inline search bar
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchQuery.trim();
      const params = new URLSearchParams(location.search);
      const currentQuery = params.get('query') || '';
      // Only fire if the typed value differs from the current URL query
      if (trimmed !== currentQuery) {
        const newParams = new URLSearchParams(location.search);
        if (trimmed) {
          newParams.set('query', trimmed);
        } else {
          newParams.delete('query');
        }
        navigate(`/posts?${newParams.toString()}`, { replace: true });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, location.search, navigate]);

  // Effect to handle URL search parameter changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';
    if (query !== urlQuery) {
      setUrlQuery(query);
      setSearchQuery(query);
      setCurrentPage(0);
      
      const fetchSearchResults = async () => {
        setLoading(true);
        try {
          if (query) {
            const res = await api.get(`/api/posts/search?query=${encodeURIComponent(query)}`);
            const postsData = res.data.posts || res.data.data || res.data || [];
            setPosts(postsData);
            setTotalPages(1);
          } else {
            await fetchPage(0);
          }
        } catch (err) {
          console.error('Search error:', err);
          setPosts([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSearchResults();
    }
  }, [location.search, urlQuery]);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const fetchPostsByCategory = async () => {
      if (selectedCategory === 'All') {
        setCurrentPage(0);
        await fetchPage(0);
        return;
      }

      const selected = categories.find((c) => c.name === selectedCategory);
      if (!selected || selected.id === 'All') return;

      setLoading(true);
      try {
        const res = await api.get(`/api/posts/category/${selected.id}/posts`);
        const postsData = res.data.posts || res.data.data || res.data || [];
        setPosts(postsData);
        setTotalPages(1);
      } catch (error) {
        console.error(`Error fetching posts for category ${selectedCategory}:`, error);
        setAlert({ type: 'error', message: `Failed to fetch posts for ${selectedCategory}.` });
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByCategory();
  }, [selectedCategory, categories]);

  const handleCategoryClick = (categoryName) => {
    if (categoryName !== selectedCategory) {
      setSelectedCategory(categoryName);
    }
  };

  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    // Client-side category filtering if not already filtered by server (though server-side is better)
    // Server-side category filtering is handled by the other useEffect

    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt || a.updatedAt || 0) - new Date(b.createdAt || b.updatedAt || 0));
        break;
      case 'a-z':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'latest':
      default:
        result.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0));
        break;
    }

    return result;
  }, [posts, sortBy]);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {alert && (
          <div className="mb-6 p-4 rounded-lg flex items-center gap-2 bg-destructive/10 text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{alert.message}</span>
            <button 
              className="ml-auto opacity-70 hover:opacity-100" 
              onClick={() => setAlert(null)}
            >
              ×
            </button>
          </div>
        )}

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Discover Great Articles
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the best thoughts, ideas, and stories from our creative community.
          </p>
        </div>

        {/* Search and Sort Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search articles by title or content..."
              className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-shadow shadow-sm hover:shadow-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const params = new URLSearchParams(location.search);
                  if (searchQuery.trim()) {
                    params.set('query', searchQuery.trim());
                  } else {
                    params.delete('query');
                  }
                  navigate(`/posts?${params.toString()}`, { replace: true });
                } else if (e.key === 'Escape') {
                  setSearchQuery('');
                  const params = new URLSearchParams(location.search);
                  params.delete('query');
                  navigate(`/posts?${params.toString()}`, { replace: true });
                }
              }}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground hidden md:block" />
            <select
              className="block w-full md:w-auto py-2.5 px-4 border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-shadow shadow-sm hover:shadow-md font-medium cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="a-z">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-border overflow-x-auto">
          <span className="text-sm font-semibold text-muted-foreground mr-2">Categories:</span>
          {categories.map((category) => (
            <button
              key={category.id || category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.name
                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                  : 'bg-card border border-border text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Post list or loader */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div>
            {filteredAndSortedPosts.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-xl border border-border">
                <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No posts found</h3>
                <p className="text-muted-foreground">Try adjusting your search query or category filter.</p>
              </div>
            ) : (
              <PostsGrid posts={filteredAndSortedPosts} />
            )}

            {/* Pagination controls — only shown for non-filtered browsing */}
            {!isFiltered && totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  onClick={() => fetchPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                <span className="text-sm text-muted-foreground font-mono">
                  Page {currentPage + 1} of {totalPages}
                  <span className="ml-2 opacity-60">({totalElements} posts)</span>
                </span>

                <button
                  onClick={() => fetchPage(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
