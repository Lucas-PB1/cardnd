-- 05_character_skills.sql
-- Junction Table: Characters <-> Skills

create table public.character_skills (
  id uuid default gen_random_uuid() primary key,
  character_id uuid references public.characters(id) on delete cascade not null,
  skill_id uuid references public.skills(id) on delete cascade not null,
  
  is_proficient boolean default false,
  is_expertise boolean default false,

  -- Ensure a character only has one entry per skill
  unique(character_id, skill_id)
);

-- RLS
alter table public.character_skills enable row level security;

-- Policies link back to the character's owner
create policy "Users can view own char skills" on public.character_skills
  for select using (
    exists (select 1 from public.characters where id = character_skills.character_id and user_id = auth.uid())
  );

create policy "Users can insert own char skills" on public.character_skills
  for insert with check (
    exists (select 1 from public.characters where id = character_skills.character_id and user_id = auth.uid())
  );

create policy "Users can update own char skills" on public.character_skills
  for update using (
    exists (select 1 from public.characters where id = character_skills.character_id and user_id = auth.uid())
  );

create policy "Users can delete own char skills" on public.character_skills
  for delete using (
    exists (select 1 from public.characters where id = character_skills.character_id and user_id = auth.uid())
  );
