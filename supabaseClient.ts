import { createClient } from '@supabase/supabase-js';

// No Vite/Vercel usamos import.meta.env para acessar variáveis de ambiente
// Casting import.meta to any to avoid "Property 'env' does not exist on type 'ImportMeta'" TS error
const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

let client;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn("⚠️ SUPABASE NÃO CONFIGURADO: Rodando em modo Mock (Apenas Visual). Configure VITE_SUPABASE_URL no Vercel.");
  
  // Mock client básico para evitar crash e permitir visualizar o layout
  const mockChain = () => ({
    select: () => mockChain(),
    insert: () => mockChain(),
    update: () => mockChain(),
    delete: () => mockChain(),
    eq: () => mockChain(),
    single: async () => ({ data: null, error: null }),
    then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb)
  });

  client = {
    from: () => mockChain(),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  } as any;
}

export const supabase = client;

export const parseDatabaseUser = (user: any) => {
    if(!user) return null;
    return {
        username: user.username,
        password: user.password,
        role: user.role,
        balance: user.balance,
        createdBy: user.created_by,
        pixKey: user.pix_key
    };
};