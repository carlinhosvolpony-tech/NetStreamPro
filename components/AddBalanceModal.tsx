import React, { useState } from 'react';
import { X, Copy, CheckCircle, Smartphone, DollarSign, Loader2 } from 'lucide-react';

interface AddBalanceModalProps {
  username: string;
  agent: string;
  pixKey: string;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

const AddBalanceModal: React.FC<AddBalanceModalProps> = ({ username, agent, pixKey, onClose, onConfirm }) => {
  const [amount, setAmount] = useState<string>('');
  const [step, setStep] = useState<'INPUT' | 'PAYMENT'>('INPUT');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const numericAmount = parseFloat(amount.replace(',', '.'));
  const isValidAmount = !isNaN(numericAmount) && numericAmount >= 2;

  // Mock PIX Code generation
  const pixCode = `00020126460014BR.GOV.BCB.PIX01${pixKey.length}${pixKey}52040000530398654042.005802BR5912DEPOSITO ${username}6008BRASILIA62070503***63041D3D`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinish = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirm(numericAmount);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-sports-card border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
            <DollarSign className="text-green-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Adicionar Saldo</h2>
          <p className="text-slate-400 text-sm">Crédito rápido via PIX</p>
        </div>

        {step === 'INPUT' ? (
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Valor a depositar (Min R$ 2,00)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-bold text-lg">R$</span>
                <input 
                  type="number" 
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-slate-900 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-xl text-2xl font-bold focus:outline-none focus:border-green-500 transition-colors"
                  autoFocus
                />
              </div>
            </div>

            <button 
              onClick={() => setStep('PAYMENT')}
              disabled={!isValidAmount}
              className={`w-full font-bold py-4 rounded-xl transition-all uppercase tracking-wide flex items-center justify-center gap-2
                ${isValidAmount ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              Gerar PIX
            </button>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="bg-white p-3 rounded-xl mx-auto w-40 h-40 flex items-center justify-center shadow-inner">
                <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ExamplePayment')] bg-contain bg-no-repeat bg-center opacity-90"></div>
            </div>

            <div className="relative">
                <input 
                    readOnly 
                    value={pixCode} 
                    className="w-full bg-slate-900 border border-slate-700 text-slate-400 text-xs p-3 rounded-lg pr-12 font-mono truncate"
                />
                <button 
                    onClick={handleCopy}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-700 rounded-md text-green-500 transition-colors"
                >
                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                </button>
            </div>
            
            <div className="text-center text-xs text-slate-400">
                <p>Valor: <strong className="text-white text-sm">R$ {numericAmount.toFixed(2)}</strong></p>
                <p className="mt-1">Pagamento para: {agent}</p>
            </div>

            <button 
                onClick={handleFinish}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] active:scale-95 flex items-center justify-center gap-2"
            >
                {isProcessing ? <Loader2 className="animate-spin" /> : "Já fiz o pagamento"}
            </button>
            
            <button onClick={() => setStep('INPUT')} className="w-full text-slate-500 text-xs hover:text-white py-2">
                Voltar / Alterar Valor
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBalanceModal;