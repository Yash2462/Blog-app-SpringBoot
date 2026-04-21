import React, { useEffect, useState } from 'react';
import { Terminal, ArrowRight, ChevronRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const DsaSheets = () => {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const res = await api.get('/api/dsa/sheets');
        setSheets(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSheets();
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-[#0b1120] pt-32 pb-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-20 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
             <Terminal className="w-4 h-4" /> Curriculum Center
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tight text-foreground uppercase leading-[1]">
            DSA Preparation <br/> Sheets
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Proven roadmaps and problem sets categorized by patterns to help you master algorithms and data structures.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {[1, 2].map(i => <div key={i} className="h-80 bg-slate-100 dark:bg-slate-800 rounded-[3rem] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {sheets.map((sheet, index) => (
              <motion.div
                key={sheet.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group clean-card overflow-hidden bg-card"
              >
                <Link to={`/dsa-sheets/${sheet.id}`}>
                  <div className="relative aspect-video overflow-hidden border-b border-border">
                    {sheet.thumbnailUrl ? (
                      <img src={sheet.thumbnailUrl} alt={sheet.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Terminal className="w-20 h-20 text-slate-200" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                  </div>
                  
                  <div className="p-10 space-y-6">
                    <div className="flex justify-between items-center">
                       <h3 className="text-3xl font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">
                        {sheet.title}
                       </h3>
                       <ChevronRight className="w-8 h-8 text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                      {sheet.description}
                    </p>
                    <div className="pt-8 border-t border-border flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {sheet.topics?.length || 0} Modules Detected
                       </span>
                       <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                          Launch Path
                       </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DsaSheets;
