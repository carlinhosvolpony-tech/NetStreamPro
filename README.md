# Rodada D'grau 🦁

App de apostas esportivas pronto para produção.

## 🚀 Como colocar no ar (Vercel + Supabase)

### Passo 1: Supabase (Banco de Dados)
1. Crie uma conta em [supabase.com](https://supabase.com).
2. Crie um novo projeto.
3. No menu lateral, clique em **SQL Editor**.
4. Copie o conteúdo do arquivo `db_setup.sql` deste projeto e cole lá. Clique em **Run**.
5. Vá em **Project Settings (ícone engrenagem) > API**.
6. Copie a `URL` e a `anon public` key.

### Passo 2: Google Gemini (IA)
1. Gere uma API Key em [aistudio.google.com](https://aistudio.google.com).

### Passo 3: Vercel (Hospedagem)
1. Suba este código para o seu GitHub.
2. Crie uma conta na Vercel e importe o projeto do GitHub.
3. Na tela de configuração de deploy, abra **Environment Variables** e adicione:
   - `VITE_SUPABASE_URL`: (Sua URL do Supabase)
   - `VITE_SUPABASE_ANON_KEY`: (Sua chave Anon do Supabase)
   - `VITE_GOOGLE_API_KEY`: (Sua chave do Google Gemini)
4. Clique em **Deploy**.

## 📱 Funcionalidades
- **IA Volpony**: Gera palpites automáticos baseados nos jogos.
- **Painel Admin**: Controle total de usuários, bilhetes e caixa.
- **Sistema de Agentes (Cambistas)**: Cálculo automático de comissão (20%).
- **Impressão/WhatsApp**: Envio de comprovantes direto para o Zap.
