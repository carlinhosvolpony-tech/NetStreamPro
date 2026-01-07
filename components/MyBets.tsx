import React from 'react';
import { Ticket, Match, Outcome } from '../types';
import { ArrowLeft, Trash2, Calendar, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface MyBetsProps {
  tickets: Ticket[];
  matches: Match[]; // To resolve team names if needed
  onClose: () => void;
  onDelete: (id: string) => void;
}

const MyBets: React.FC<MyBetsProps> = ({ tickets, matches, onClose, onDelete }) => {
  const [expandedTicket, setExpandedTicket] = React.useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedTicket(expandedTicket === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'text-green-400 border-green-900/50 bg-green-900/20';
      case 'PENDING_PAYMENT': return 'text-yellow-500 border-yellow-900/50 bg-yellow-900/20';
      default: return 'text-slate-400 border-slate-800 bg-slate-800/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle size={14} />;
      case 'PENDING_PAYMENT': return <Clock size={14} />;
      default: return <XCircle size={14} />;
    }
  };

  const getSelectionLabel = (outcome: string) => {
      switch(outcome) {
          case 'HOME': return 'CASA';
          case 'DRAW': return 'EMPATE';
          case 'AWAY': return 'FORA';
          default: return '-';
      }
  }

  return (
    <div className="min-h-screen bg-sports-dark text-white pb-24">
      <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-slate-800 p-4 flex items-center gap-4">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Minhas Apostas</h1>
      </header>

      <main className="p-4 space-y-4 max-w-2xl mx-auto">
        {tickets.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <TicketIcon size={48} className="mx-auto mb-4" />
            <p>Você ainda não fez nenhuma aposta.</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-sports-card border border-white/10 rounded-xl overflow-hidden shadow-lg animate-in slide-in-from-bottom-2">
              {/* Card Header */}
              <div className="p-4 flex justify-between items-start">
                <div className="flex-1" onClick={() => toggleExpand(ticket.id)}>
                   <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono font-bold text-lg text-white">{ticket.id}</span>
                      <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status === 'PAID' ? 'CONFIRMADO' : 'PENDENTE'}
                      </div>
                   </div>
                   <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(ticket.timestamp).toLocaleDateString()}</span>
                      <span className="text-white font-bold">R$ {ticket.price.toFixed(2)}</span>
                   </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                     <button 
                        onClick={() => {
                            if(window.confirm('Tem certeza que deseja excluir este bilhete?')) {
                                onDelete(ticket.id);
                            }
                        }}
                        className="p-2 bg-red-900/20 text-red-500 rounded-lg hover:bg-red-900/40 border border-red-900/30 transition-colors"
                     >
                        <Trash2 size={18} />
                     </button>
                     <button onClick={() => toggleExpand(ticket.id)} className="p-2 text-slate-400 hover:text-white transition-colors self-center">
                        {expandedTicket === ticket.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                     </button>
                </div>
              </div>

              {/* Expandable Details */}
              {expandedTicket === ticket.id && (
                  <div className="bg-black/50 border-t border-white/5 p-4 text-sm">
                      <h3 className="text-xs uppercase font-bold text-slate-500 mb-3">Palpites</h3>
                      <div className="grid grid-cols-1 gap-2">
                          {Object.entries(ticket.selections).map(([matchId, outcome]) => {
                              // Try to find match details to show names (optional, assumes matches are static for the day)
                              const match = matches.find(m => m.id === parseInt(matchId));
                              const selection = outcome as Outcome;
                              return (
                                  <div key={matchId} className="flex justify-between items-center border-b border-white/5 pb-1">
                                      <span className="text-slate-300 text-xs">
                                          {match ? `${match.homeTeam.name} x ${match.awayTeam.name}` : `Jogo ${matchId}`}
                                      </span>
                                      <span className={`font-bold text-xs px-2 py-0.5 rounded ${selection === 'HOME' ? 'bg-indigo-900/50 text-indigo-300' : selection === 'AWAY' ? 'bg-red-900/50 text-red-300' : 'bg-slate-700 text-slate-300'}`}>
                                          {getSelectionLabel(selection)}
                                      </span>
                                  </div>
                              )
                          })}
                      </div>
                      <div className="mt-4 pt-2 border-t border-white/10 text-center">
                          <p className="text-xs text-slate-500">Prêmio Potencial</p>
                          <p className="text-lg font-bold text-sports-primary">R$ {ticket.potentialWin.toLocaleString('pt-BR')}</p>
                      </div>
                  </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
};

// Simple Icon for empty state
function TicketIcon({ size, className }: { size: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
    )
}

export default MyBets;