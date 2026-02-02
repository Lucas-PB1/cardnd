-- 06_dnd_2024_schema.sql

-- Classes Table
create table public.classes (
  id text primary key, -- slug like 'barbarian'
  name text not null,
  hit_die int not null,
  primary_ability text[] not null,
  saves text[] not null
);

alter table public.classes enable row level security;
create policy "Classes are viewable by everyone" on public.classes for select using (true);

-- Races Table
create table public.races (
  id text primary key, -- slug like 'human'
  name text not null
);

alter table public.races enable row level security;
create policy "Races are viewable by everyone" on public.races for select using (true);

-- Subclasses Table
create table public.subclasses (
  id text primary key, -- slug
  class_id text references public.classes(id) on delete cascade not null,
  name text not null
);

alter table public.subclasses enable row level security;
create policy "Subclasses are viewable by everyone" on public.subclasses for select using (true);

-- Character Saving Throws
create table public.character_saving_throws (
  id uuid default gen_random_uuid() primary key,
  character_id uuid references public.characters(id) on delete cascade not null,
  ability text not null, -- 'Strength', 'Dexterity', etc.
  is_proficient boolean default false,
  unique(character_id, ability)
);

alter table public.character_saving_throws enable row level security;

create policy "Users can view own char saves" on public.character_saving_throws
  for select using (
    exists (select 1 from public.characters where id = character_saving_throws.character_id and user_id = auth.uid())
  );

create policy "Users can insert own char saves" on public.character_saving_throws
  for insert with check (
    exists (select 1 from public.characters where id = character_saving_throws.character_id and user_id = auth.uid())
  );

create policy "Users can update own char saves" on public.character_saving_throws
  for update using (
    exists (select 1 from public.characters where id = character_saving_throws.character_id and user_id = auth.uid())
  );

create policy "Users can delete own char saves" on public.character_saving_throws
  for delete using (
    exists (select 1 from public.characters where id = character_saving_throws.character_id and user_id = auth.uid())
  );

-- SEED DATA

-- Classes (D&D 2024)
insert into public.classes (id, name, hit_die, primary_ability, saves) values
('barbarian', 'Barbarian', 12, '{Strength}', '{Strength,Constitution}'),
('bard', 'Bard', 8, '{Charisma}', '{Dexterity,Charisma}'),
('cleric', 'Cleric', 8, '{Wisdom}', '{Wisdom,Charisma}'),
('druid', 'Druid', 8, '{Wisdom}', '{Intelligence,Wisdom}'),
('fighter', 'Fighter', 10, '{Strength,Dexterity}', '{Strength,Constitution}'),
('monk', 'Monk', 8, '{Dexterity,Wisdom}', '{Strength,Dexterity}'),
('paladin', 'Paladin', 10, '{Strength,Charisma}', '{Wisdom,Charisma}'),
('ranger', 'Ranger', 10, '{Dexterity,Wisdom}', '{Strength,Dexterity}'),
('rogue', 'Rogue', 8, '{Dexterity}', '{Dexterity,Intelligence}'),
('sorcerer', 'Sorcerer', 6, '{Charisma}', '{Constitution,Charisma}'),
('warlock', 'Warlock', 8, '{Charisma}', '{Wisdom,Charisma}'),
('wizard', 'Wizard', 6, '{Intelligence}', '{Intelligence,Wisdom}')
on conflict (id) do update set 
  name = excluded.name,
  hit_die = excluded.hit_die, 
  primary_ability = excluded.primary_ability,
  saves = excluded.saves;

-- Races
insert into public.races (id, name) values
('human', 'Human'),
('elf', 'Elf'),
('dwarf', 'Dwarf'),
('halfling', 'Halfling'),
('gnome', 'Gnome'),
('dragonborn', 'Dragonborn'),
('tiefling', 'Tiefling'),
('orc', 'Orc'),
('aasimar', 'Aasimar'),
('goliath', 'Goliath')
on conflict (id) do update set name = excluded.name;

-- Subclasses (Sample)
insert into public.subclasses (id, class_id, name) values
('berserker', 'barbarian', 'Path of the Berserker'),
('wild_heart', 'barbarian', 'Path of the Wild Heart'),
('world_tree', 'barbarian', 'Path of the World Tree'),
('zealot', 'barbarian', 'Path of the Zealot'),
('dance', 'bard', 'College of Dance'),
('glamour', 'bard', 'College of Glamour'),
('lore', 'bard', 'College of Lore'),
('valor', 'bard', 'College of Valor'),
('life', 'cleric', 'Life Domain'),
('light', 'cleric', 'Light Domain'),
('trickery', 'cleric', 'Trickery Domain'),
('war', 'cleric', 'War Domain'),
('land', 'druid', 'Circle of the Land'),
('moon', 'druid', 'Circle of the Moon'),
('sea', 'druid', 'Circle of the Sea'),
('stars', 'druid', 'Circle of Stars'),
('battle_master', 'fighter', 'Battle Master'),
('champion', 'fighter', 'Champion'),
('eldritch_knight', 'fighter', 'Eldritch Knight'),
('psi_warrior', 'fighter', 'Psi Warrior'),
('mercy', 'monk', 'Warrior of Mercy'),
('shadow', 'monk', 'Warrior of Shadow'),
('elements', 'monk', 'Warrior of the Elements'),
('open_hand', 'monk', 'Warrior of the Open Hand'),
('devotion', 'paladin', 'Oath of Devotion'),
('glory', 'paladin', 'Oath of Glory'),
('ancients', 'paladin', 'Oath of the Ancients'),
('vengeance', 'paladin', 'Oath of Vengeance'),
('beast_master', 'ranger', 'Beast Master'),
('fey_wanderer', 'ranger', 'Fey Wanderer'),
('gloom_stalker', 'ranger', 'Gloom Stalker'),
('hunter', 'ranger', 'Hunter'),
('arcane_trickster', 'rogue', 'Arcane Trickster'),
('assassin', 'rogue', 'Assassin'),
('soulknife', 'rogue', 'Soulknife'),
('thief', 'rogue', 'Thief'),
('aberrant', 'sorcerer', 'Aberrant Sorcery'),
('clockwork', 'sorcerer', 'Clockwork Sorcery'),
('draconic', 'sorcerer', 'Draconic Sorcery'),
('wild_magic', 'sorcerer', 'Wild Magic Sorcery'),
('archfey', 'warlock', 'Archfey Patron'),
('celestial', 'warlock', 'Celestial Patron'),
('fiend', 'warlock', 'Fiend Patron'),
('great_old_one', 'warlock', 'Great Old One Patron'),
('abjurer', 'wizard', 'Abjurer'),
('diviner', 'wizard', 'Diviner'),
('evoker', 'wizard', 'Evoker'),
('illusionist', 'wizard', 'Illusionist')
on conflict (id) do update set name = excluded.name;
