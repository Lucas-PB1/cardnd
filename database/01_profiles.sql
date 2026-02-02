-- Create a specific table for public profiles
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  display_name text,
  character_class text,
  bio text,
  level int default 1,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  primary key (id)
);

-- Turn on Row Level Security
alter table public.profiles enable row level security;

-- Create policies (Rules for who can see/edit what)
-- Public can see all profiles
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

-- Users can insert their own profile
create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( (select auth.uid()) = id );

-- Users can update own profile
create policy "Users can update own profile."
  on public.profiles for update
  using ( (select auth.uid()) = id );

-- Trigger to create profile on signup
-- This ensures every new user gets a profile row automatically
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Optional: Backfill existing users if you have them
-- insert into public.profiles (id, email)
-- select id, email from auth.users
-- on conflict do nothing;
