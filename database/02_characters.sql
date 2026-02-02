-- 02_characters.sql
-- Main Characters Table
create table public.characters (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  
  -- Core Identity
  name text not null,
  race text,
  class text,
  subclass text,
  level int default 1,
  background text,
  alignment text,
  
  -- Vitals & Combat
  xp int default 0,
  hp_max int default 0,
  hp_current int default 0,
  temp_hp int default 0,
  ac int default 10,
  speed int default 30,
  initiative int default 0,
  
  -- Resources
  hit_dice_total text, -- e.g. "1d8"
  hit_dice_current int,
  
  -- Status
  death_save_successes int default 0,
  death_save_failures int default 0,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.characters enable row level security;

create policy "Users can view own characters" on public.characters
  for select using (auth.uid() = user_id);

create policy "Users can insert own characters" on public.characters
  for insert with check (auth.uid() = user_id);

create policy "Users can update own characters" on public.characters
  for update using (auth.uid() = user_id);

create policy "Users can delete own characters" on public.characters
  for delete using (auth.uid() = user_id);
