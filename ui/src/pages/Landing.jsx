import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { formatDistanceToNow, isValid } from 'date-fns';
import {
  BookOpen,
  TerminalSquare,
  Network,
  LayoutTemplate,
  ArrowRight,
  Code2,
  Clock,
  Loader2
} from 'lucide-react';

const FEATURE_CARDS = [
  {
    title: 'DSA Guidelines',
    dbCategory: 'DSA',
    description: 'Master Data Structures and Algorithms with curated notes and problems.',
    icon: <TerminalSquare className="w-8 h-8 text-orange-500" />,
    bgColor: 'bg-orange-500/10',
    borderColor: 'group-hover:border-orange-500/50'
  },
  {
    title: 'System Design',
    description: 'Complete LLD & HLD concepts to help you build scalable applications.',
    icon: <Network className="w-8 h-8 text-blue-500" />,
    bgColor: 'bg-blue-500/10',
    borderColor: 'group-hover:border-blue-500/50'
  },
  {
    title: 'CS Fundamentals',
    description: 'Deep dive into OS, DBMS, and Networking for core technical interviews.',
    icon: <BookOpen className="w-8 h-8 text-green-500" />,
    bgColor: 'bg-green-500/10',
    borderColor: 'group-hover:border-green-500/50'
  },
  {
    title: 'Interview Experiences',
    description: 'Real interview experiences, roadmaps, and last-minute revision guides.',
    icon: <LayoutTemplate className="w-8 h-8 text-purple-500" />,
    bgColor: 'bg-purple-500/10',
    borderColor: 'group-hover:border-purple-500/50'
  }
];

const stripMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/[#*`>~]/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .trim();
};

const formatDate = (dateString) => {
  if (!dateString || !isValid(new Date(dateString))) return '';
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

export default function Landing() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    api.get('/api/posts')
      .then((res) => {
        const allPosts = res.data.data || res.data.posts || res.data || [];
        // Sort by latest and take the top 3
        const sorted = [...allPosts].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setRecentPosts(sorted.slice(0, 3));
      })
      .catch(() => setRecentPosts([]))
      .finally(() => setLoadingPosts(false));
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] w-full">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 w-full py-20 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Welcome to the ultimate tech blog
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
            Master Tech Concepts By <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-purple-500">
              Intuition & Logic
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The best place to learn DSA, System Design, Core CS Fundamentals, and explore awesome articles on software engineering.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full sm:w-auto"
            >
              Start Reading <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full sm:w-auto"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Feature Cards Section */}
      <section className="w-full py-20 bg-muted/30 border-t border-border mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Explore Categories</h2>
            <p className="text-muted-foreground mt-2">Notes to help you crack SDE interviews and build better software.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURE_CARDS.map((card, index) => (
              <Link to={`/posts?category=${encodeURIComponent(card.dbCategory || card.title)}`} key={card.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md h-full ${card.borderColor}`}
                >
                  <div className={`mb-6 inline-flex p-3 rounded-xl ${card.bgColor}`}>
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>

                  {/* Visual Arrow appears on hover */}
                  <div className="absolute bottom-6 right-6 opacity-0 translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="w-full py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Latest Articles</h2>
            <p className="text-muted-foreground mt-2">Fresh reads from our community of writers.</p>
          </div>

          {loadingPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((post, index) => {
                const postId = post.id || post._id || post.postId;
                const wordCount = (post.data || post.content || '').split(' ').length;
                const readTime = Math.max(1, Math.ceil(wordCount / 200));
                return (
                  <motion.div
                    key={postId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                        {post.category?.name || 'Uncategorized'}
                      </span>
                      <span className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />{readTime} min read
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title || 'Untitled'}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 flex-grow leading-relaxed">
                      {stripMarkdown(post.data || post.content) || 'No preview available.'}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        By {post.user?.username || 'Anonymous'} · {formatDate(post.createdAt)}
                      </span>
                    </div>
                    {/* Overlay CTA for logged-out users */}
                    <Link
                      to="/signup"
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:bg-primary/5 transition-all flex items-center justify-center"
                      aria-label={`Read ${post.title}`}
                    />
                  </motion.div>
                );
              })}
            </div>
          ) : null}

          <div className="mt-10 text-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow"
            >
              Read All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-background py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center font-mono text-xl font-bold">
            <span className="text-primary mr-1">&lt;</span>
            BlogSpace
            <span className="text-primary ml-1">/&gt;</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BlogSpace. Inspiring the creative community.
          </p>
          <div className="flex space-x-6">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
