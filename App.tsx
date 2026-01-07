
import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Globe, 
  MonitorPlay, 
  Smartphone, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { Plan, CategoryType } from './types';

const INITIAL_PLANS: Plan[] = [
  // INTERNET
  { id: 'int-200', title: 'Fibra Start 200 Mbps', category: 'INTERNET', price: 70.00, period: 'MENSAL', color: '#6366f1', specs: [{ label: 'Velocidade', value: '200 Mbps' }, { label: 'Upload', value: '100 Mbps' }, { label: 'Wi-Fi', value: 'Dual Band' }] },
  { id: 'int-300', title: 'Fibra Home 300 Mbps', category: 'INTERNET', price: 80.00, period: 'MENSAL', color: '#6366f1', specs: [{ label: 'Velocidade', value: '300 Mbps' }, { label: 'Upload', value: '150 Mbps' }, { label: 'Wi-Fi', value: 'Dual Band' }] },
  { id: 'int-400', title: 'Fibra Plus 400 Mbps', category: 'INTERNET', price: 90.00, period: 'MENSAL', color: '#6366f1', isPopular: true, specs: [{ label: 'Velocidade', value: '400 Mbps' }, { label: 'Upload', value: '200 Mbps' }, { label: 'Wi-Fi', value: 'Dual Band' }] },
  { id: 'int-600', title: 'Fibra Gamer 600 Mbps', category: 'INTERNET', price: 100.00, period: 'MENSAL', color: '#6366f1', specs: [{ label: 'Velocidade', value: '600 Mbps' }, { label: 'Upload', value: '300 Mbps' }, { label: 'Wi-Fi', value: 'Wi-Fi 6' }] },
  
  // IPTV (Apenas Smart TV)
  { id: 'iptv-tv1', title: 'IPTV Smart TV - 1 Mês', category: 'IPTV', subCategory: 'Smart TV', price: 40.00, period: 'MENSAL', color: '#a855f7', specs: [{ label: 'Telas', value: '2 Conexões' }, { label: 'Canais', value: '18k+ Mundiais' }, { label: 'Qualidade', value: '4K/UHD' }] },
  { id: 'iptv-tv3', title: 'IPTV Smart TV - 3 Meses', category: 'IPTV', subCategory: 'Smart TV', price: 105.00, period: '3 MESES', color: '#a855f7', isPopular: true, specs: [{ label: 'Telas', value: '2 Conexões' }, { label: 'Economia', value: 'R$ 15,00' }, { label: 'VOD', value: 'Filmes & Séries' }] },
  { id: 'iptv-tv6', title: 'IPTV Smart TV - 6 Meses', category: 'IPTV', subCategory: 'Smart TV', price: 177.00, period: '6 MESES', color: '#a855f7', specs: [{ label: 'Telas', value: '2 Conexões' }, { label: 'Economia', value: 'R$ 63,00' }, { label: 'Status', value: 'Premium VIP' }] },

  // IPTV SMARTPHONE
  { id: 'iptv-sm', title: 'IPTV Smartphone', category: 'COMBO', subCategory: 'Smartphone', price: 25.00, period: 'MENSAL', color: '#ec4899', specs: [{ label: 'Dispositivo', value: 'Celular/Tablet' }, { label: 'Telas', value: '1 Acesso' }, { label: 'Qualidade', value: 'HD/Full HD' }] },
];

const CATEGORIES: { id: CategoryType; label: string; icon: any }[] = [
  { id: 'INTERNET', label: 'Internet', icon: Globe },
  { id: 'IPTV', label: 'Smart TV', icon: MonitorPlay },
  { id: 'COMBO', label: 'Celular', icon: Smartphone },
];

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('INTERNET');
  
  const filteredPlans = useMemo(() => 
    INITIAL_PLANS.filter(p => p.category === activeCategory), 
  [activeCategory]);

  const handleAction = (plan: Plan, type: 'HIRE' | 'RENEW') => {
    const actionText = type === 'HIRE' ? 'assinar' : 'RENOVAR';
    const message = `Olá! Quero ${actionText} o plano "${plan.title}" (R$ ${plan.price.toFixed(2)})`;
    window.open(`https://wa.me/5598984595785?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col pb-10">
      {/* Header Fixo */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Zap size={18} className="text-white fill-current" />
          </div>
          <h1 className="text-lg font-black tracking-tighter uppercase italic">NETSTREAM <span className="text-indigo-500">PRO</span></h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase text-green-500 tracking-wider">Online</span>
        </div>
      </header>

      <main className="flex-1 p-5 max-w-lg mx-auto w-full">
        {/* Banner de Título */}
        <div className="mb-8 text-center animate-in fade-in slide-in-from-top-2 duration-500">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-3">
            {activeCategory === 'INTERNET' ? 'Navegue no Máximo' : 
             activeCategory === 'IPTV' ? 'Cinema em Casa' : 
             'TV no seu Bolso'}
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            {activeCategory === 'INTERNET' ? 'Fibra óptica de alta fidelidade' : 
             'Qualidade 4K e estabilidade total'}
          </p>
        </div>

        {/* Navegação de Categorias - Mobile Friendly */}
        <div className="flex gap-2 mb-8 sticky top-20 z-40 py-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-3xl transition-all border-2 duration-300 ${
                activeCategory === cat.id 
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/30' 
                  : 'bg-white/5 border-transparent text-slate-500'
              }`}
            >
              <cat.icon size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Texto de Apresentação Dinâmico */}
        <div className="mb-8 animate-in fade-in zoom-in duration-700">
          <div className={`p-6 rounded-[2rem] border glass relative overflow-hidden ${
            activeCategory === 'INTERNET' ? 'border-indigo-500/20 shadow-indigo-500/5' : 
            activeCategory === 'IPTV' ? 'border-purple-500/20 shadow-purple-500/5' : 
            'border-pink-500/20 shadow-pink-500/5'
          }`}>
             <div className="relative z-10">
                <p className="text-sm font-bold text-white mb-2">
                  {activeCategory === 'INTERNET' && "🚀 Internet rápida de verdade chegou!"}
                  {activeCategory === 'IPTV' && "📺 Entretenimento sem limites!"}
                  {activeCategory === 'COMBO' && "📱 TV completa na palma da sua mão!"}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {activeCategory === 'INTERNET' && "Navegue sem travar, assista e jogue com estabilidade total."}
                  {activeCategory === 'IPTV' && "Milhares de canais, filmes e séries para toda a família."}
                  {activeCategory === 'COMBO' && "Assista direto no seu celular. Onde estiver, quando quiser."}
                </p>
             </div>
          </div>
        </div>

        {/* Listagem de Planos */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {filteredPlans.map(plan => (
            <div key={plan.id} className={`group relative p-6 rounded-[2.5rem] glass border border-white/5 transition-all duration-300 active:scale-[0.97] ${plan.isPopular ? 'border-indigo-500/30' : ''}`}>
              {plan.isPopular && (
                <div className="absolute -top-3 left-6 bg-indigo-600 text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  🔥 Mais Vendido
                </div>
              )}
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight italic uppercase">{plan.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {plan.specs.slice(0, 2).map((s, i) => (
                      <span key={i} className="text-[9px] font-black text-slate-500 uppercase tracking-tighter bg-white/5 px-2 py-1 rounded-lg">
                        {s.value}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">A partir de</div>
                  <div className="text-2xl font-black text-white tracking-tighter">R$ {plan.price.toFixed(0)}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleAction(plan, 'HIRE')}
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Assinar <ChevronRight size={14} />
                </button>
                {(activeCategory === 'IPTV' || activeCategory === 'COMBO') && (
                  <button 
                    onClick={() => handleAction(plan, 'RENEW')}
                    className="p-4 bg-white/5 text-slate-400 rounded-2xl border border-white/5 active:bg-white/10"
                  >
                    <RefreshCw size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-10 px-10 text-center">
        <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">NETSTREAM PRO 2025</p>
      </footer>
    </div>
  );
};

export default App;
