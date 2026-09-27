-- Diagnóstico M&K — tabela de submissões
create table if not exists public.diagnosticos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome text not null,
  whatsapp text,
  autocontrole int not null,
  autoeficacia int not null,
  estagio_mudanca int not null,
  conscienciosidade int not null,
  indice_geral int not null,
  fase text not null,
  respostas jsonb not null
);

alter table public.diagnosticos enable row level security;

-- Qualquer pessoa (mesmo sem login) pode ENVIAR uma resposta.
-- Isso é o que permite o formulário público funcionar sem exigir cadastro.
create policy "Inserção pública do diagnóstico"
  on public.diagnosticos
  for insert
  to anon
  with check (true);

-- Só usuários autenticados (o admin) podem LER as respostas.
-- Não há cadastro público de usuários: você cria o(s) login(s) de admin
-- manualmente no painel do Supabase (Authentication → Users → Add user).
create policy "Somente admin lê as respostas"
  on public.diagnosticos
  for select
  to authenticated
  using (true);
