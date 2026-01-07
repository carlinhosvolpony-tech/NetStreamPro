
import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Globe, 
  MonitorPlay, 
  Smartphone, 
  Fingerprint, 
  ChevronRight,
  ShieldCheck,
  Wallet
} from 'lucide-react';
import { Plan, CategoryType } from './types';

const INITIAL_PLANS: Plan[] = [
  // INTERNET
  { id: 'int-200', title: 'Fibra Start 200 Mbps', category: 'INTERNET', price: 70.00, period: 'MENSAL', color: '#6366f1', specs: [{ label: 'Velocidade', value: '200 Mbps' }, { label: 'Wi-Fi', value: 'Dual Band' }] },
  { id: 'int-300', title: 'Fibra Home 300 Mbps', category: 'INTERNET', price: 80.00, period: 'MENSAL', color: '#6366f1', specs: [{ label: 'Velocidade', value: '300 Mbps' }, { label: 'Wi-Fi', value: 'Dual Band' }] },
  { id: 'int-400', title: 'Fibra Plus 400 Mbps', category: 'INTERNET', price: 90.00, period: 'MENSAL', color: '#6366f1', isPopular: true, specs: [{ label: 'Velocidade', value: '400 Mbps' }, { label: 'Wi-Fi', value: 'Dual Band' }] },
  { id: 'int-600', title: 'Fibra Gamer 600 Mbps', category: 'INTERNET', price: 100.00, period: 'MENSAL', color: '#6366f1', specs: [{ label: 'Velocidade', value: '600 Mbps' }, { label: 'Wi-Fi', value: 'Wi-Fi 6' }] },
  { id: 'int-800', title: 'Fibra Premium 800 Mbps', category: 'INTERNET', price: 120.00, period: 'MENSAL', color: '#6366f1', specs: [{ label: 'Velocidade', value: '800 Mbps' }, { label: 'Wi-Fi', value: 'Wi-Fi 6' }] },
  { id: 'int-1000', title: 'Fibra Ultra 1 Giga', category: 'INTERNET', price: 160.00, period: 'MENSAL', color: '#6366f1', specs: [{ label: 'Velocidade', value: '1 Giga' }, { label: 'Wi-Fi', value: 'Wi-Fi 6 Plus' }] },
  
  // IPTV (SMART TV)
  { id: 'iptv-tv1', title: 'Smart TV - 1 Mês', category: 'IPTV', subCategory: 'Smart TV', price: 40.00, period: 'MENSAL', color: '#a855f7', specs: [{ label: 'Canais', value: '18k+' }, { label: 'Qualidade', value: '4K/UHD' }] },
  { id: 'iptv-tv2', title: 'Smart TV - 2 Meses', category: 'IPTV', subCategory: 'Smart TV', price: 75.00, period: '2 MESES', color: '#a855f7', specs: [{ label: 'Canais', value: '18k+' }, { label: 'Economia', value: 'R$ 5,00' }] },
  { id: 'iptv-tv3', title: 'Smart TV - 3 Meses', category: 'IPTV', subCategory: 'Smart TV', price: 105.00, period: '3 MESES', color: '#a855f7', isPopular: true, specs: [{ label: 'Canais', value: '18k+' }, { label: 'Economia', value: 'R$ 15,00' }] },
  { id: 'iptv-tv4', title: 'Smart TV - 4 Meses', category: 'IPTV', subCategory: 'Smart TV', price: 132.00, period: '4 MESES', color: '#a855f7', specs: [{ label: 'Canais', value: '18k+' }, { label: 'Economia', value: 'R$ 28,00' }] },
  { id: 'iptv-tv5', title: 'Smart TV - 5 Meses', category: 'IPTV', subCategory: 'Smart TV', price: 156.00, period: '5 MESES', color: '#a855f7', specs: [{ label: 'Canais', value: '18k+' }, { label: 'Economia', value: 'R$ 44,00' }] },
  { id: 'iptv-tv6', title: 'Smart TV - 6 Meses', category: 'IPTV', subCategory: 'Smart TV', price: 177.00, period: '6 MESES', color: '#a855f7', specs: [{ label: 'Canais', value: '18k+' }, { label: 'Economia', value: 'R$ 63,00' }] },

  // IPTV SMARTPHONE
  { id: 'iptv-sm', title: 'IPTV Smartphone', category: 'COMBO', subCategory: 'Smartphone', price: 25.00, period: 'MENSAL', color: '#ec4899', specs: [{ label: 'Telas', value: '1 Acesso' }, { label: 'Qualidade', value: 'Full HD' }] },

  // CERTIFICADO DIGITAL
  { id: 'cert-ecpf-a1', title: 'e-CPF A1 (Digital)', category: 'CERTIFICADO', price: 80.00, period: 'ANUAL', color: '#06b6d4', specs: [{ label: 'Validade', value: '12 Meses' }, { label: 'Instalação', value: 'No Computador' }] },
  { id: 'cert-ecnpj-a1', title: 'e-CNPJ A1 (Empresarial)', category: 'CERTIFICADO', price: 200.00, period: 'ANUAL', color: '#06b6d4', isPopular: true, specs: [{ label: 'Validade', value: '12 Meses' }, { label: 'Uso', value: 'Notas Fiscais' }] },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CategoryType>('INTERNET');

  const handleHire = (plan: Plan) => {
    const message = `Olá! Quero contratar o plano ${plan.title} (${plan.category}) por R$ ${plan.price.toFixed(2)}`;
    window.open(`https://wa.me/5598984595785?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredPlans = useMemo(() => 
    INITIAL_PLANS.filter(p => p.category === activeTab), 
  [activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col pb-20 font-['Plus_Jakarta_Sans']">
      
      {/* Header Fixo */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Zap size={16} className="text-white fill-current" />
          </div>
          <span className="text-sm font-black tracking-tighter uppercase italic">NetStream <span className="text-indigo-500">Pro</span></span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase text-slate-400">Atendimento Ativo</span>
        </div>
      </header>

      <main className="flex-1 p-5 max-w-lg mx-auto w-full">
        
        {/* Banner de Categoria */}
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
            {activeTab === 'INTERNET' && "Ultra Fibra"}
            {activeTab === 'IPTV' && "Cinema 4K"}
            {activeTab === 'COMBO' && "TV Mobile"}
            {activeTab === 'CERTIFICADO' && "Identidade Digital"}
          </h2>
          <div className="h-1.5 w-12 bg-indigo-600 mt-2 rounded-full"></div>
        </div>

        {/* Navegação - Menu Rápido Superior */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar py-2 sticky top-[72px] z-40 bg-slate-950/80 backdrop-blur-md">
          {[
            { id: 'INTERNET', label: 'Internet', icon: Globe },
            { id: 'IPTV', label: 'Smart TV', icon: MonitorPlay },
            { id: 'COMBO', label: 'Celular', icon: Smartphone },
            { id: 'CERTIFICADO', label: 'Certificado Digital', icon: Fingerprint },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CategoryType)}
              className={`min-w-[95px] flex-1 flex flex-col items-center gap-2 py-4 px-2 rounded-[2rem] transition-all border-2 duration-300 ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
              }`}
            >
              <tab.icon size={18} />
              <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Área de Conteúdo Dinâmico */}
        <div className="space-y-4">
          
          {/* Mensagem de Destaque por Categoria */}
          <div className="bg-white/5 border border-white/5 p-4 rounded-[2rem] mb-6 animate-in zoom-in duration-500">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                    {activeTab === 'INTERNET' && <Globe size={24} />}
                    {activeTab === 'IPTV' && <MonitorPlay size={24} />}
                    {activeTab === 'COMBO' && <Smartphone size={24} />}
                    {activeTab === 'CERTIFICADO' && <ShieldCheck size={24} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">
                      {activeTab === 'INTERNET' && "Navegue sem limites"}
                      {activeTab === 'IPTV' && "O melhor do entretenimento"}
                      {activeTab === 'COMBO' && "Sua TV no bolso"}
                      {activeTab === 'CERTIFICADO' && "Assinatura Digital Segura"}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {activeTab === 'INTERNET' && "Conexão de ultra velocidade com estabilidade garantida para toda sua casa."}
                      {activeTab === 'IPTV' && "Milhares de canais, filmes e séries em alta definição diretamente na sua Smart TV."}
                      {activeTab === 'COMBO' && "Leve seu streaming para onde quiser com nosso acesso exclusivo mobile."}
                      {activeTab === 'CERTIFICADO' && "Emissão rápida de e-CPF e e-CNPJ com validade jurídica oficial."}
                    </p>
                  </div>
               </div>
          </div>

          {/* Renderização de Planos */}
          <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-bottom-4 duration-500">
            {filteredPlans.map(plan => (
              <div key={plan.id} className="glass p-6 rounded-[2.5rem] border border-white/5 relative overflow-hidden active:scale-95 transition-all">
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">🔥 Destaque</div>
                )}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-black text-white italic uppercase leading-tight">{plan.title}</h3>
                    <div className="flex gap-2 mt-2">
                      {plan.specs.map((s, i) => (
                        <span key={i} className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                          {s.value}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-600 uppercase">R$</div>
                    <div className="text-2xl font-black text-white leading-none">{plan.price.toFixed(0)}</div>
                    <div className="text-[8px] text-slate-600 font-bold uppercase mt-1">{plan.period}</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleHire(plan)}
                  className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'CERTIFICADO' ? 'bg-cyan-600 text-white' : 'bg-indigo-600 text-white'
                  }`}
                >
                  Contratar Agora <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Footer Simples */}
      <footer className="mt-10 px-10 text-center">
        <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">NetStream Pro 2025</p>
      </footer>
    </div>
  );
};

export default App;
