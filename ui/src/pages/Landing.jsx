import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { formatDistanceToNow } from 'date-fns';
import {
  BookOpen,
  Terminal,
  Cpu,
  Layout,
  ArrowRight,
  Code2,
  Clock,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  Globe,
  Users
} from 'lucide-react';

const FEATURE_CARDS = [
  {
    title: 'DSA Sheets',
    type: 'PRACTICE_PROBLEM',
    description: 'Most popular coding interview patterns and practice problems.',
    icon: <Terminal className="w-8 h-8 text-blue-600" />,
    color: 'bg-blue-500/10 border-blue-500/20'
  },
  {
    title: 'System Design',
    type: 'BLOG',
    description: 'Learn LLD and HLD through deep intuition and real-world examples.',
    icon: <Cpu className="w-8 h-8 text-indigo-600" />,
    color: 'bg-indigo-500/10 border-indigo-500/20'
  },
  {
    title: 'CS Core',
    type: 'BLOG',
    description: 'Master OS, DBMS, and Computer Networks for top tier companies.',
    icon: <BookOpen className="w-8 h-8 text-emerald-600" />,
    color: 'bg-emerald-500/10 border-emerald-500/20'
  },
  {
    title: 'Roadmaps',
    type: 'CHEAT_SHEET',
    description: 'Step-by-step guides to master different tech stacks efficiently.',
    icon: <Zap className="w-8 h-8 text-amber-600" />,
    color: 'bg-amber-500/10 border-amber-500/20'
  }
];

export default function Landing() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    api.get('/api/posts?size=4')
      .then((res) => {
        const allPosts = res.data.data?.data || res.data.data || [];
        setRecentPosts(allPosts);
      })
      .catch(() => setRecentPosts([]))
      .finally(() => setLoadingPosts(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfe] dark:bg-[#0b1120] transition-colors">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-border shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-foreground/70">Mastering Tech by Intuition</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground leading-[1] uppercase">
              Become a Better <br />
              <span className="text-gradient">Engineer.</span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
              Curated technical content to help you master DSA, System Design, and 
              Core CS Fundamentals through deep logical understanding.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link to="/posts" className="btn-primary w-full sm:w-auto h-14 flex items-center justify-center">
                Explore Articles <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
              <Link to="/posts?type=PRACTICE_PROBLEM" className="px-10 py-3.5 border-2 border-border hover:border-primary rounded-2xl font-bold text-sm uppercase tracking-widest transition-all bg-white dark:bg-transparent w-full sm:w-auto h-14 flex items-center justify-center">
                Practice DSA
              </Link>
            </div>

            <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto opacity-50">
               {[
                 { icon: <Users className="w-4 h-4" />, label: "10K+ Students" },
                 { icon: <Star className="w-4 h-4" />, label: "4.9/5 Rating" },
                 { icon: <Globe className="w-4 h-4" />, label: "Global Reach" },
                 { icon: <ShieldCheck className="w-4 h-4" />, label: "Pro Content" }
               ].map((stat, i) => (
                 <div key={i} className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                   {stat.icon} {stat.label}
                 </div>
               ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 border-y border-border bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center md:text-left space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground uppercase">Top Modules</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Focused learning paths to accelerate your career growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURE_CARDS.map((card, index) => (
              <Link to={`/posts?type=${card.type}`} key={card.title}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group clean-card p-10 h-full flex flex-col items-start space-y-8"
                >
                  <div className={`p-5 rounded-2xl ${card.color} group-hover:scale-110 transition-transform duration-500`}>
                    {card.icon}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  <div className="mt-auto pt-8 flex items-center text-[10px] font-black text-primary uppercase tracking-[0.2em] group-hover:translate-x-3 transition-transform duration-500">
                    Access System <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Content */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground uppercase">Latest Insights</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">The most recent updates from our technical research team.</p>
            </div>
            <Link to="/posts" className="px-8 py-3 rounded-2xl bg-secondary hover:bg-border transition-all text-sm font-black uppercase tracking-widest">
              View Database
            </Link>
          </div>

          {loadingPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[400px] bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {recentPosts.map((post, index) => {
                const postId = post.id || post.postId;
                return (
                  <motion.div
                    key={postId}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group space-y-6"
                  >
                    <Link to={`/posts/${postId}`} className="block relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-border shadow-sm group-hover:shadow-2xl transition-all duration-500">
                      {post.postImage ? (
                        <img 
                          src={post.postImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Code2 className="w-16 h-16 text-slate-200" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-8 left-8 right-8 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                         <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg">Read Entry</span>
                      </div>
                    </Link>
                    <div className="px-2 space-y-3">
                       <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span className="text-primary">{post.type || 'LOG'}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span>5M READ</span>
                       </div>
                       <Link to={`/posts/${postId}`}>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-[1.3]">
                          {post.title}
                        </h3>
                       </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-slate-950 text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
            <div className="md:col-span-5 space-y-8 text-center md:text-left">
              <div className="text-3xl font-black tracking-tighter">
                &lt;CODEWITH<span className="text-primary">YASH</span> /&gt;
              </div>
              <p className="text-slate-400 text-lg max-w-md leading-relaxed font-medium">
                The ultimate sanctuary for software engineers seeking deep mastery of core technical principles.
              </p>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Library</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                  <li><Link to="/posts" className="hover:text-white transition-colors uppercase">Articles</Link></li>
                  <li><Link to="/posts?type=PRACTICE_PROBLEM" className="hover:text-white transition-colors uppercase">DSA Sheets</Link></li>
                  <li><Link to="/posts?type=CHEAT_SHEET" className="hover:text-white transition-colors uppercase">Roadmaps</Link></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Follow</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                  <li><a href="#" className="hover:text-white transition-colors uppercase">Twitter</a></li>
                  <li><a href="#" className="hover:text-white transition-colors uppercase">LinkedIn</a></li>
                  <li><a href="#" className="hover:text-white transition-colors uppercase">YouTube</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Legal</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                  <li><a href="#" className="hover:text-white transition-colors uppercase">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors uppercase">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition-colors uppercase">Licensing</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            <p>© {new Date().getFullYear()} CodeWithYash Global Systems.</p>
            <div className="flex gap-4">
               <span className="px-3 py-1 rounded-full border border-slate-800">Status: Operational</span>
               <span className="px-3 py-1 rounded-full border border-slate-800">Version: 4.2.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
