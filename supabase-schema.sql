-- SoulMate 匹配系统表

-- 1. 用户资料
create table profiles (
  id uuid default gen_random_uuid() primary key,
  nickname text,
  bio text,
  looking_for text,
  soul_type text,
  dimensions jsonb,  -- 五维数据
  avatar_color text default '#8B5CF6',
  created_at timestamp default now()
);

-- 2. 匹配请求
create table matches (
  id uuid default gen_random_uuid() primary key,
  from_profile_id uuid references profiles(id),
  to_profile_id uuid references profiles(id),
  status text default 'pending',  -- pending, accepted, rejected
  compatibility_score int,
  created_at timestamp default now()
);

-- 3. Soul Gallery (公开展示)
create view soul_gallery as
  select id, nickname, bio, looking_for, soul_type, dimensions, avatar_color, created_at
  from profiles
  order by created_at desc;

-- RLS
alter table profiles enable row level security;
alter table matches enable row level security;
