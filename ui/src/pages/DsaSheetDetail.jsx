import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Terminal, CheckCircle2, ChevronDown, ChevronRight, ExternalLink, Play, FileText, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const DsaSheetDetail = () => {
  const { id } = useParams();
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState({});

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const res = await api.get(`/api/dsa/sheets/${id}`);
        setSheet(res.data);
        // Expand first topic by default
        if (res.data.topics?.length > 0) {
          setExpandedTopics({ [res.data.topics[0].id]: true });
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSheet();
  }, [id]);

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Terminal className="w-12 h-12 text-primary animate-pulse" />
    </div>
  );

  if (!sheet) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-slate-400">Sheet Entry Missing</div>;

  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-[#0b1120] pt-32 pb-24 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/dsa-sheets" className="inline-flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-12 hover:translate-x-[-4px] transition-transform">
           <ArrowLeft className="w-4 h-4" /> Return to Archive
        </Link>

        <header className="mb-20 space-y-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground uppercase leading-[1.1]">
            {sheet.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-medium leading-relaxed max-w-3xl">
            {sheet.description}
          </p>
          <div className="pt-8 flex flex-wrap gap-8 items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> System Ready
             </div>
             <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" /> {sheet.topics?.length || 0} Modules
             </div>
             <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Progress Tracking v1.0
             </div>
          </div>
        </header>

        <div className="space-y-6">
          {sheet.topics?.map((topic) => (
            <div key={topic.id} className="bg-white dark:bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => toggleTopic(topic.id)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-6">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${expandedTopics[topic.id] ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-primary/5 text-primary'}`}>
                      <span className="font-black text-lg">{topic.orderIndex || 1}</span>
                   </div>
                   <h3 className="text-xl font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">
                     {topic.name}
                   </h3>
                </div>
                <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-500 ${expandedTopics[topic.id] ? 'rotate-180 text-primary' : ''}`} />
              </button>

              <AnimatePresence>
                {expandedTopics[topic.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-border">
                            <th className="px-8 py-4 text-left w-20">Status</th>
                            <th className="px-8 py-4 text-left">Problem Name</th>
                            <th className="px-8 py-4 text-left">Difficulty</th>
                            <th className="px-8 py-4 text-center">Practice</th>
                            <th className="px-8 py-4 text-center">Solution</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {topic.problems?.map((problem) => (
                            <tr key={problem.id} className="group hover:bg-primary/[0.02] transition-colors">
                              <td className="px-8 py-6">
                                <button className="w-6 h-6 rounded-lg border-2 border-border flex items-center justify-center hover:border-primary transition-colors">
                                   <div className="w-3 h-3 bg-primary rounded-sm opacity-0" />
                                </button>
                              </td>
                              <td className="px-8 py-6 font-bold text-foreground text-sm uppercase tracking-tight">
                                {problem.title}
                              </td>
                              <td className="px-8 py-6">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                  problem.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-600' :
                                  problem.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600' :
                                  'bg-rose-500/10 text-rose-600'
                                }`}>
                                  {problem.difficulty}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-center">
                                {problem.practiceLink && (
                                  <a href={problem.practiceLink} target="_blank" rel="noreferrer" className="inline-flex p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-primary hover:text-white transition-all shadow-sm">
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                )}
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center justify-center gap-3">
                                  {problem.videoSolutionUrl && (
                                    <a href={problem.videoSolutionUrl} className="p-2 text-rose-500 hover:scale-110 transition-transform">
                                      <Play className="w-4 h-4" />
                                    </a>
                                  )}
                                  {problem.articleSolution && (
                                    <Link to={`/posts/${problem.articleSolution.id}`} className="p-2 text-primary hover:scale-110 transition-transform">
                                      <FileText className="w-4 h-4" />
                                    </Link>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DsaSheetDetail;
