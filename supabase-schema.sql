-- SoulMate AI - Supabase 建表SQL
-- 在 Supabase SQL Editor 中运行

-- 1. 候补名单
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  email text,
  instagram text,
  tiktok text,
  created_at timestamp default now()
);

-- 2. 对话记录
create table conversations (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  role text,
  content text,
  created_at timestamp default now()
);

-- 3. Soul Reports
create table soul_reports (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  soul_type text,
  personality_summary text,
  emotional_pattern text,
  communication_style text,
  relationship_strengths text,
  relationship_risks text,
  ideal_partner text,
  poetic_summary text,
  created_at timestamp default now()
);

-- 开启RLS
alter table waitlist enable row level security;
alter table conversations enable row level security;
alter table soul_reports enable row level security;

-- 索引
create index idx_conversations_user on conversations(user_id);
create index idx_reports_user on soul_reports(user_id);
