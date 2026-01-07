import React, { useState } from 'react';
import { User } from '../types';
import { Lock, User as UserIcon, Ticket, LogIn, ChevronRight } from 'lucide-react';
import { supabase, parseDatabaseUser } from '../supabaseClient';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const u = username.trim().toLowerCase();
    const p = password.trim();

    if (!u || !p) return setError('Preencha os campos');
    setLoading(true);

    // LOGIN MESTRE (Prioridade máxima)
    if (u === 'admin' && p === 'admin') {
      onLogin({
        username: 'admin',
        role: 'ADMIN',
        balance: 10000,
        createdBy: 'sistema',
        pixKey: 'carlinhosvolpony@hotmail.com'
      });
      setLoading(false);
      return;
    }

    try {
      const localUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
      if (isRegistering) {
        if (localUsers.some((x: any) => x.username === u)) {
          setError('Usuário já cadastrado');
        } else {
          const newUser = { username: u, password: p, role: 'CLIENT' as const, balance: 0, createdBy: 'auto', pixKey: '' };
          localStorage.setItem('app_users', JSON.stringify([...localUsers, newUser]));
          onLogin(newUser);
        }
      } else {
        const found = localUsers.find((x: any) => x.username === u && x.password === p);
        if (found) {
          onLogin({ ...found, balance: found.balance || 0 });
        } else {
          const { data, error: dbError } = await supabase.from('users').select('*').eq('username', u).eq('password', p).single();
          if (data) onLogin(parseDatabaseUser(data));
          else setError('Credenciais incorretas');
        }
      }
    } catch { setError('Erro de conexão. Tente login admin.'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CE1126] rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-2xl w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl border border-white/5 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#CE1126]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-[#CE1126]/20 rotate-6 shadow-xl">
            <Ticket className="text-[#CE1126]" size={40} />
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">RODADA <span className="text-[#CE1126]">D'GRAU</span></h1>
          <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-widest">A maior banca online do Brasil</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="group relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#CE1126] transition-colors" size={18} />
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-black/40 text-white pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent focus:border-[#CE1126] outline-none transition-all placeholder:text-slate-600" placeholder="Usuário" />
          </div>
          <div className="group relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#CE1126] transition-colors" size={18} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 text-white pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent focus:border-[#CE1126] outline-none transition-all placeholder:text-slate-600" placeholder="Senha" />
          </div>

          {error && <div className="text-red-500 text-xs text-center font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-[#CE1126] hover:bg-red-700 text-white font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-2 uppercase text-sm tracking-widest transition-all active:scale-95">
            {loading ? 'Acessando...' : isRegistering ? 'Criar Conta' : 'Entrar na Arena'} <ChevronRight size={18} />
          </button>
        </form>

        <button onClick={() => setIsRegistering(!isRegistering)} className="w-full mt-8 text-xs text-slate-500 font-bold uppercase tracking-widest hover:text-white transition-colors">
          {isRegistering ? 'Já tem conta? Login' : 'Novo por aqui? Cadastre-se'}
        </button>
      </div>
    </div>
  );
};

export default Login;