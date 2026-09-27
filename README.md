# Diagnóstico M&K Fitness Center

Formulário público de diagnóstico comportamental (Autocontrole, Autoeficácia,
Estágio de Mudança, Conscienciosidade) + painel administrativo para ver todas
as respostas.

- **Formulário público** (`/`): sem login, qualquer pessoa preenche.
- **Painel admin** (`/admin`): login básico (e-mail/senha), mostra todas as
  respostas em tabela, com detalhe expansível.
- **Banco**: Supabase (Postgres).
- **Download**: a pessoa que responde pode baixar o próprio diagnóstico em
  PDF ao final (usa a função de impressão do navegador — sem dependência
  extra, funciona em qualquer navegador).

---

## 1. Criar o projeto no Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Vá em **SQL Editor** e rode o conteúdo de [`supabase/schema.sql`](./supabase/schema.sql).
   Isso cria a tabela `diagnosticos` e as duas regras de acesso:
   - qualquer pessoa pode **inserir** uma resposta (formulário público);
   - só usuário **logado** pode **ler** as respostas (o admin).
3. Vá em **Project Settings → API** e copie:
   - `Project URL`
   - `anon public key`

## 2. Criar o(s) usuário(s) admin

Não existe cadastro público de admin — você cria manualmente:

1. No Supabase, vá em **Authentication → Users → Add user**.
2. Cadastre e-mail + senha para cada pessoa da equipe M&K que vai acessar
   `/admin`.

## 3. Configurar o projeto localmente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` e cole a URL e a anon key do passo 1:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

Instale e rode:

```bash
npm install
npm run dev
```

- Formulário: http://localhost:3000
- Admin: http://localhost:3000/admin

## 4. Subir para o GitHub

```bash
git init
git add .
git commit -m "Diagnóstico M&K — versão inicial"
git branch -M main
git remote add origin https://github.com/SUA-ORG/SEU-REPO.git
git push -u origin main
```

## 5. Deploy (Vercel, recomendado pelo stack que vocês já usam)

1. Importe o repositório no [vercel.com](https://vercel.com).
2. Em **Environment Variables**, adicione as duas mesmas variáveis do
   `.env.local` (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. Deploy.

O link público (ex: `https://diagnostico-mk.vercel.app`) é o que vai no bio
do Instagram, WhatsApp, etc. O link `/admin` (ex:
`https://diagnostico-mk.vercel.app/admin`) é só para a equipe.

---

## Estrutura

```
app/
  page.js              → formulário público (intro + quiz + resultado)
  admin/
    page.js            → login do admin
    AdminDashboard.js  → tabela com todas as respostas
  lib/
    questions.js        → banco de perguntas + lógica de pontuação
    supabaseClient.js    → cliente Supabase
supabase/
  schema.sql            → tabela + regras de acesso (RLS)
```

## Decisões que tomei (me avisa se quiser mudar)

- **Coletei nome e WhatsApp no início do formulário.** A versão anterior
  (arquivo HTML avulso) era 100% anônima — sem isso, o admin não teria como
  saber de quem é cada resposta. WhatsApp ficou opcional, nome obrigatório.
- **Download em PDF via impressão do navegador** (`window.print()`), em vez
  de uma biblioteca como jsPDF. É mais simples, mais confiável entre
  navegadores, e não adiciona dependência — mas o layout do PDF é o mesmo da
  tela (com uma folha de estilo `@media print` mais limpa). Se vocês
  preferirem um PDF com um layout totalmente diferente da tela (com logo,
  marca d'água etc.), aí vale investir numa geração de PDF no servidor.
- **Não há exclusão de respostas nem exportação em CSV no admin ainda** —
  só visualização. Se for necessário, é rápido de adicionar.
- **A logo da M&K não está neste projeto**, conforme combinado — fica de
  fora até vocês definirem onde ela entra.
