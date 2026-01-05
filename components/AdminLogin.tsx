import React, { useState } from 'react';
import { Lock, User, Key, ArrowRight, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulasi delay network
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onLogin();
      } else {
        setError('Username atau Password salah!');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mb-6 shadow-inner text-violet-600">
        <Lock className="w-10 h-10" />
      </div>
      
      <h2 className="text-2xl font-black text-slate-800 mb-2">Akses Wali Kelas</h2>
      <p className="text-slate-500 mb-8 max-w-xs">Silahkan masuk untuk melakukan persetujuan dan melihat rekap data.</p>

      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors">
            <User className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-violet-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors">
            <Key className="w-5 h-5" />
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-violet-500 focus:bg-white transition-all font-medium"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-500 text-sm font-bold rounded-xl flex items-center justify-center gap-2 animate-pulse">
            <ShieldCheck className="w-4 h-4" /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-200 hover:shadow-violet-400 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isLoading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Masuk Dashboard <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;