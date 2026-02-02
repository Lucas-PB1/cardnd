-- 04_skills_seed.sql
-- Skills Catalog (Reference Table)

create table public.skills (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  associated_attribute text not null, -- 'STR', 'DEX', etc.
  description text
);

-- Enable RLS
alter table public.skills enable row level security;

-- Everyone can read stats
create policy "Skills are viewable by everyone" on public.skills
  for select using (true);

-- SEED DATA (Standard D&D 5e Skills)
insert into public.skills (name, associated_attribute) values
  ('Acrobatics', 'DEX'),
  ('Animal Handling', 'WIS'),
  ('Arcana', 'INT'),
  ('Athletics', 'STR'),
  ('Deception', 'CHA'),
  ('History', 'INT'),
  ('Insight', 'WIS'),
  ('Intimidation', 'CHA'),
  ('Investigation', 'INT'),
  ('Medicine', 'WIS'),
  ('Nature', 'INT'),
  ('Perception', 'WIS'),
  ('Performance', 'CHA'),
  ('Persuasion', 'CHA'),
  ('Religion', 'INT'),
  ('Sleight of Hand', 'DEX'),
  ('Stealth', 'DEX'),
  ('Survival', 'WIS')
on conflict (name) do nothing;
