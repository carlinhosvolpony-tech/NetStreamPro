
import React, { useState, useEffect } from 'react';
import { Match, User, Ticket, Transaction, UserRole } from '../types';
import { Save, RefreshCw, LogOut, Settings, UserPlus, KeyRound, Lock, Unlock, Wallet, Search, Check, TrendingUp, Minus, Plus, DollarSign, X, Users, Calculator, CalendarDays, ArrowRight, Share2, Download, Trash2 } from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User | null;
  matches: Match[];
  tickets: Ticket[];
  transactions: Transaction[];
  pixKey: string;
  isLocked: boolean;
  onUpdateMatches: (matches: Match[]) => void;
  onUpdatePix: (username: string, key: string) => void;
  onUpdateLock: () => void;
  onApproveTicket: (id: string) => void;
  onUpdateBalance: (username: string, amount: number) => void;
  onApproveDeposit: (id: string) => void;
  onRejectDeposit: (id: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  currentUser,
  matches, 
  tickets,
  transactions,
  pixKey,
  isLocked,
  onUpdateMatches, 
  onUpdatePix,
  onUpdateLock,
  onApproveTicket,
  onUpdateBalance,
  onApproveDeposit,
  onRejectDeposit,
  onLogout 
}) => {
  const isAdmin = currentUser?.role === 'ADMIN';
  const [activeTab, setActiveTab] = useState<'DEPOSITS' | 'CLIENTS' | 'TICKETS' | 'ACCOUNTING' | 'CONFIG' | 'MATCHES'>('DEPOSITS');
  
  const [localMatches, setLocalMatches] = useState<Match[]>(matches);
  const [localPix, setLocalPix] = useState(pixKey);
  const [isSaving, setIsSaving] = useState(false);
  const [ticketFilter, setTicketFilter] = useState('');
  const [myClients, setMyClients] = useState<User[]>([]);

  // Cadastro de novo usuário
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('CLIENT');

  const getLocalData = (key: string, fallback: any) => {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : fallback;
  };

  const loadClients = () => {
    const allUsers: User[] = getLocalData('app_users', []);
    if (isAdmin) {
      setMyClients(allUsers.filter(u => u.username !== currentUser?.username));
    } else {
      setMyClients(allUsers.filter(u => u.createdBy === currentUser?.username));
    }
  };

  useEffect(() => { loadClients(); }, [activeTab]);

  const handleSaveMatches = () => {
    setIsSaving(true);
    onUpdateMatches(localMatches);
    setTimeout(() => { setIsSaving(false); alert("Rodada Atualizada!"); }, 500);
  };

  const handleCreateUser = () => {
    if(!newUsername || !newPassword) return alert("Preencha tudo");
    const all = getLocalData('app_users', []);
    if(all.some((u:any) => u.username === newUsername)) return alert("Usuário já existe");
    
    // Fix: Providing a fallback for createdBy to ensure it's always a string.
    const newUser: User = {
      username: newUsername,
      password: newPassword,
      role: isAdmin ? newRole : 'CLIENT',
      balance: 0,
      createdBy: currentUser?.username || 'sistema',
      pixKey: ''
    };
    
    localStorage.setItem('app_users', JSON.stringify([...all, newUser]));
    alert("Usuário Criado!");
    setNewUsername(''); setNewPassword('');
    loadClients();
  };

  // Cálculos Financeiros
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0,0,0,0);

  const calculateStats = (agent: string) => {
    const myTickets = tickets.filter(t => t.agent === agent && t.status === 'PAID' && new Date(t.timestamp) >= startOfWeek);
    const total = myTickets.reduce((acc, t) => acc + t.price, 0);
    const commission = total * 0.20;
    const net = total - commission;
    return { total, commission, net, count: myTickets.length };
  };

  const pendingDeposits = transactions.filter(t => t.status === 'PENDING' && t.agent === currentUser?.username);

  return (
    <div className="min-h-screen bg-sports-dark text-white p-4">
      <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-black italic uppercase text-white flex items-center gap-2">
            <Settings className="text-sports-primary" /> {isAdmin ? 'Painel Master' : 'Área do Agente'}
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Sessão: {currentUser?.username}</p>
        </div>
        <button onClick={onLogout} className="bg-white/5 p-3 rounded-2xl hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition-all"><LogOut size={20}/></button>
      </header>

      <nav className="flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide">
        {[
          { id: 'DEPOSITS', label: 'Depósitos', icon: DollarSign, badge: pendingDeposits.length },
          { id: 'ACCOUNTING', label: 'Prestação', icon: Calculator },
          { id: 'CLIENTS', label: 'Usuários', icon: Users },
          { id: 'TICKETS', label: 'Bilhetes', icon: Search },
          { id: 'MATCHES', label: 'Jogos', icon: RefreshCw, adminOnly: true },
          { id: 'CONFIG', label: 'Ajustes', icon: Settings },
        ].map(tab => (
          (!tab.adminOnly || isAdmin) && (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 relative ${activeTab === tab.id ? 'bg-sports-primary text-white shadow-xl shadow-red-900/20' : 'bg-slate-900 text-slate-500 border border-white/5'}`}
            >
              <tab.icon size={14} /> {tab.label}
              {tab.badge ? <span className="absolute -top-1 -right-1 bg-green-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center border-2 border-sports-dark">{tab.badge}</span> : null}
            </button>
          )
        ))}
      </nav>

      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {activeTab === 'DEPOSITS' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black uppercase italic text-white/90">Solicitações Pendentes</h2>
            {pendingDeposits.length === 0 ? (
              <div className="bg-slate-900/50 p-12 rounded-[2rem] text-center border border-white/5">
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Tudo em dia por aqui!</p>
              </div>
            ) : (
              pendingDeposits.map(d => (
                <div key={d.id} className="bg-slate-900 p-5 rounded-3xl border border-white/5 flex items-center justify-between shadow-2xl">
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 mb-1">{new Date(d.timestamp).toLocaleString()}</div>
                    <div className="text-lg font-black text-white">{d.username}</div>
                    <div className="text-green-500 font-mono font-black text-xl">R$ {d.amount.toFixed(2)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onRejectDeposit(d.id)} className="p-4 bg-red-900/20 text-red-500 rounded-2xl border border-red-500/20"><X size={20}/></button>
                    <button onClick={() => onApproveDeposit(d.id)} className="p-4 bg-green-600 text-white rounded-2xl shadow-xl shadow-green-900/40 active:scale-95 transition-all"><Check size={24} strokeWidth={3}/></button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'ACCOUNTING' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 bg-sports-primary/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
               <div className="relative z-10">
                  <h2 className="text-2xl font-black italic uppercase text-white mb-2">Prestação Semanal</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">Desde {startOfWeek.toLocaleDateString()}</p>
                  
                  {(() => {
                    const stats = calculateStats(currentUser!.username);
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                            <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Vendas (Pagos)</span>
                            <div className="text-2xl font-black text-white">R$ {stats.total.toFixed(2)}</div>
                         </div>
                         <div className="bg-green-900/20 p-6 rounded-3xl border border-green-500/20 text-center">
                            <span className="text-[10px] font-black text-green-500 uppercase block mb-1">Comissão (20%)</span>
                            <div className="text-2xl font-black text-green-400">R$ {stats.commission.toFixed(2)}</div>
                         </div>
                         <div className="bg-sports-primary/10 p-6 rounded-3xl border border-sports-primary/20 text-center">
                            <span className="text-[10px] font-black text-sports-primary uppercase block mb-1">Líquido Master</span>
                            <div className="text-2xl font-black text-white">R$ {stats.net.toFixed(2)}</div>
                         </div>
                      </div>
                    );
                  })()}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'CLIENTS' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
              <h3 className="text-xl font-black uppercase italic text-white mb-6">Novo Cadastro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input placeholder="Usuário" className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-sports-primary outline-none" value={newUsername} onChange={e=>setNewUsername(e.target.value)} />
                <input placeholder="Senha" type="text" className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-sports-primary outline-none" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
              </div>
              <div className="flex gap-4 items-center">
                 {isAdmin && (
                   <select value={newRole} onChange={e=>setNewRole(e.target.value as any)} className="bg-black border border-white/10 rounded-2xl px-4 py-4 text-sm font-bold text-white uppercase outline-none">
                     <option value="CLIENT">Cliente</option>
                     <option value="CAMBISTA">Cambista</option>
                   </select>
                 )}
                 <button onClick={handleCreateUser} className="flex-1 bg-white text-black font-black uppercase text-xs py-4 rounded-2xl shadow-xl hover:bg-slate-200 transition-all">Cadastrar Usuário</button>
              </div>
            </div>

            <div className="space-y-3">
              {myClients.map(c => (
                <div key={c.username} className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${c.role === 'CAMBISTA' ? 'bg-purple-900 text-purple-200' : 'bg-slate-800 text-slate-400'}`}>{c.username.substring(0,2).toUpperCase()}</div>
                    <div>
                      <div className="font-black text-white text-lg flex items-center gap-2">{c.username} {c.role === 'CAMBISTA' && <span className="bg-purple-900/40 text-purple-300 text-[8px] px-2 py-0.5 rounded-full font-black uppercase border border-purple-500/20">Agente</span>}</div>
                      <div className="text-[10px] font-bold text-slate-600 uppercase">Saldo: R$ {(c.balance || 0).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onUpdateBalance(c.username, -5)} className="bg-red-900/10 text-red-500 px-3 py-2 rounded-xl text-xs font-black">-5</button>
                    <button onClick={() => onUpdateBalance(c.username, 5)} className="bg-green-900/10 text-green-500 px-3 py-2 rounded-xl text-xs font-black">+5</button>
                    <button onClick={() => onUpdateBalance(c.username, 20)} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-green-900/20 transition-all active:scale-95">+20</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'MATCHES' && isAdmin && (
          <div className="space-y-4 pb-20">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 flex gap-4 sticky top-24 z-30 shadow-2xl backdrop-blur-xl">
               <button onClick={handleSaveMatches} disabled={isSaving} className="flex-1 bg-sports-primary text-white font-black uppercase text-sm py-4 rounded-2xl shadow-2xl shadow-red-900/40 flex items-center justify-center gap-2">
                 {isSaving ? <RefreshCw className="animate-spin" /> : <Save size={20} />} Atualizar Rodada
               </button>
            </div>
            {localMatches.map(m => (
              <div key={m.id} className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-2">Jogo {m.id}</div>
                <input className="bg-black/40 border border-white/10 p-4 rounded-2xl text-white font-bold" value={m.homeTeam.name} onChange={e=>{
                  const upd = [...localMatches];
                  const i = upd.findIndex(x=>x.id===m.id);
                  upd[i].homeTeam.name = e.target.value;
                  setLocalMatches(upd);
                }} placeholder="Casa" />
                <input className="bg-black/40 border border-white/10 p-4 rounded-2xl text-white font-bold" value={m.awayTeam.name} onChange={e=>{
                  const upd = [...localMatches];
                  const i = upd.findIndex(x=>x.id===m.id);
                  upd[i].awayTeam.name = e.target.value;
                  setLocalMatches(upd);
                }} placeholder="Fora" />
                <input className="bg-black/40 border border-white/10 p-4 rounded-2xl text-white text-xs" value={m.league} onChange={e=>{
                  const upd = [...localMatches];
                  const i = upd.findIndex(x=>x.id===m.id);
                  upd[i].league = e.target.value;
                  setLocalMatches(upd);
                }} placeholder="Liga" />
                <input className="bg-black/40 border border-white/10 p-4 rounded-2xl text-white text-xs" value={m.time} onChange={e=>{
                  const upd = [...localMatches];
                  const i = upd.findIndex(x=>x.id===m.id);
                  upd[i].time = e.target.value;
                  setLocalMatches(upd);
                }} placeholder="Hora" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'CONFIG' && (
          <div className="space-y-6">
            <div className={`p-8 rounded-[2.5rem] border transition-all ${isLocked ? 'bg-red-900/10 border-red-500/50' : 'bg-slate-900 border-white/5'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black italic uppercase text-white flex items-center gap-2">
                   {isLocked ? <Lock size={20}/> : <Unlock size={20}/>} Mercado
                </h3>
                <button onClick={onUpdateLock} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isLocked ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}>
                  {isLocked ? 'Desbloquear' : 'Bloquear Mercado'}
                </button>
              </div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                {isLocked ? 'Ninguém consegue fazer novas apostas no momento.' : 'O mercado está aberto e recebendo bilhetes.'}
              </p>
            </div>

            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
              <h3 className="text-xl font-black italic uppercase text-white mb-6 flex items-center gap-2"><Wallet size={20}/> Recebimento PIX</h3>
              <input className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white font-mono text-xs mb-6 outline-none focus:border-sports-primary" value={localPix} onChange={e=>setLocalPix(e.target.value)} />
              <button onClick={() => onUpdatePix(currentUser!.username, localPix)} className="w-full bg-white text-black font-black uppercase text-xs py-5 rounded-2xl hover:bg-slate-200 shadow-xl transition-all">Salvar Configurações</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
