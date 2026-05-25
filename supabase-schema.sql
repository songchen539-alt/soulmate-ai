-- SoulMate Auth + Profiles Schema

-- 1. Profiles (linked to auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  bio text,
  looking_for text,
  soul_type text,
  dimensions jsonb,
  avatar_color text default '#8B5CF6',
  created_at timestamp default now()
);

-- 2. Soul Reports
create table if not exists soul_reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
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

-- 3. Conversations
create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  role text,
  content text,
  created_at timestamp default now()
);

-- 4. Matches
create table if not exists matches (
  id uuid default gen_random_uuid() primary key,
  from_user_id uuid references auth.users(id) on delete cascade,
  to_user_id uuid references auth.users(id) on delete cascade,
  status text default 'pending',
  compatibility_score int,
  created_at timestamp default now()
);

-- Drop old tables if they exist
drop table if exists waitlist;

-- Enable RLS
alter table profiles enable row level security;
alter table soul_reports enable row level security;
alter table conversations enable row level security;
alter table matches enable row level security;

-- RLS Policies
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

create policy "Soul reports viewable by owner" on soul_reports for select using (auth.uid() = user_id);
create policy "Users can insert their own reports" on soul_reports for insert with check (auth.uid() = user_id);

create policy "Matches viewable by participants" on matches for select using (auth.uid() = from_user_id or auth.uid() = to_user_id);
create policy "Users can create matches" on matches for insert with check (auth.uid() = from_user_id);


