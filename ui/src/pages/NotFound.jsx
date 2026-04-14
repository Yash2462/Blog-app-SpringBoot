import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Big 404 */}
        <div className="mb-8">
          <span className="font-mono font-extrabold text-[10rem] leading-none bg-gradient-to-br from-primary/40 via-primary to-indigo-500 bg-clip-text text-transparent select-none">
            404
          </span>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
          Page not found
        </h1>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          Check the URL and try again.
        </p>

        {/* Code-style block */}
        <div className="bg-muted/50 border border-border rounded-xl px-6 py-4 mb-10 text-left font-mono text-sm text-muted-foreground">
          <span className="text-primary/70">{'> '}</span>
          <span className="text-foreground">Error: </span>
          <span className="text-destructive">404 Not Found</span>
          <br />
          <span className="text-primary/70">{'> '}</span>
          <span className="opacity-60">at Router {'<'}Route path="*"{'>'}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate(user ? '/posts' : '/')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            {user ? 'Back to Posts' : 'Home'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
