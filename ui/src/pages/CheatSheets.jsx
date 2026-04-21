import React, { useEffect, useState } from 'react';
import { Download, FileText, ExternalLink, Search } from 'lucide-react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const CheatSheets = () => {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const res = await api.get('/api/cheat-sheets');
        setSheets(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSheets();
  }, []);

  const filteredSheets = sheets.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.techTags && s.techTags.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-[#0b1120] pt-32 pb-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-20 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
             <FileText className="w-4 h-4" /> Resource Library
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tight text-foreground uppercase">
            Cheat Sheets
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            High-quality, distilled reference guides for popular technologies and frameworks.
          </p>
        </div>

        <div className="mb-12 max-w-xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search guides (e.g. React, SQL, Java)..."
              className="w-full pl-14 pr-6 py-4 bg-white dark:bg-card border border-border rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSheets.map((sheet, index) => (
              <motion.div
                key={sheet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group clean-card p-10 flex flex-col h-full bg-card"
              >
                <div className="flex justify-between items-start mb-6">
                   <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                      <FileText className="w-8 h-8 text-primary" />
                   </div>
                   {sheet.fileUrl && (
                      <a href={sheet.fileUrl} target="_blank" rel="noreferrer" className="text-primary hover:scale-110 transition-transform">
                         <Download className="w-6 h-6" />
                      </a>
                   )}
                </div>
                
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">
                  {sheet.title}
                </h3>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 flex-grow">
                  {sheet.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                   {sheet.techTags?.split(',').map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-secondary text-[10px] font-black uppercase tracking-widest text-slate-500">
                         {tag.trim()}
                      </span>
                   ))}
                </div>

                <div className="pt-6 border-t border-border flex items-center justify-between">
                   <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline flex items-center gap-2">
                      Read Online <ExternalLink className="w-3 h-3" />
                   </button>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PDF Ready</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheatSheets;
