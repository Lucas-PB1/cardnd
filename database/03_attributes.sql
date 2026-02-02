-- 03_attributes.sql
-- Character Attributes (Stats) Table
-- One-to-One relationship with characters table

create table public.character_attributes (
  id uuid default gen_random_uuid() primary key,
  character_id uuid references public.characters(id) on delete cascade not null unique,
  
  strength int default 10,
  dexterity int default 10,
  constitution int default 10,
  intelligence int default 10,
  wisdom int default 10,
  charisma int default 10,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.character_attributes enable row level security;

-- Policies link back to the character's owner
create policy "Users can view own char attributes" on public.character_attributes
  for select using (
    exists (select 1 from public.characters where id = character_attributes.character_id and user_id = auth.uid())
  );

create policy "Users can insert own char attributes" on public.character_attributes
  for insert with check (
    exists (select 1 from public.characters where id = character_attributes.character_id and user_id = auth.uid())
  );

create policy "Users can update own char attributes" on public.character_attributes
  for update using (
    exists (select 1 from public.characters where id = character_attributes.character_id and user_id = auth.uid())
  );
