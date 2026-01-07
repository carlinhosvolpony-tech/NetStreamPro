
import React from 'react';
import { Match, Outcome } from '../types';
import { Check } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  selection?: Outcome;
  onSelect: (matchId: number, selection: Outcome) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, selection, onSelect }) => {
  
  const getButtonClass = (type: Outcome) => {
    const isSelected = selection === type;
    const baseClass = "flex-1 py-4 px-1 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all duration-300 flex flex-col items-center justify-center gap-1 border border-white/5 active:scale-90";
    
    if (isSelected) {
      if (type === 'HOME') return `${baseClass} bg-indigo-600 text-white border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.3)]`;
      if (type === 'AWAY') return `${baseClass} bg-red-600 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]`;
      return `${baseClass} bg-slate-700 text-white border-slate-500`;
    }
    return `${baseClass} bg-white/5 text-slate-500 hover:bg-white/10`;
  };

  return (
    <div className="glass rounded-[2rem] p-5 relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 px-3 py-1 bg-white/5 rounded-full">{match.league}</span>
        <span className="text-[10px] font-mono font-bold text-indigo-400">{match.time}</span>
      </div>

      <div className="flex justify-between items-center gap-4 mb-6">
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 p-2 shadow-inner">
             <img src={match.homeTeam.logoPlaceholder} alt="" className="w-full h-full object-contain" />
          </div>
          <span className="text-[11px] font-black text-center text-white leading-tight">{match.homeTeam.name}</span>
        </div>

        <div className="text-[10px] font-black text-slate-700 italic">VS</div>

        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 p-2 shadow-inner">
             <img src={match.awayTeam.logoPlaceholder} alt="" className="w-full h-full object-contain" />
          </div>
          <span className="text-[11px] font-black text-center text-white leading-tight">{match.awayTeam.name}</span>
        </div>
      </div>

      <div className="flex gap-2.5">
        <button onClick={() => onSelect(match.id, 'HOME')} className={getButtonClass('HOME')}>
          Casa {selection === 'HOME' && <Check size={10} strokeWidth={4} />}
        </button>
        <button onClick={() => onSelect(match.id, 'DRAW')} className={getButtonClass('DRAW')}>
          X {selection === 'DRAW' && <Check size={10} strokeWidth={4} />}
        </button>
        <button onClick={() => onSelect(match.id, 'AWAY')} className={getButtonClass('AWAY')}>
          Fora {selection === 'AWAY' && <Check size={10} strokeWidth={4} />}
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
