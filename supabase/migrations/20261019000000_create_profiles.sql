create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  mbti text check (mbti ~ '^[EI][SN][TF][JP]$'),
  tested_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "own profile select" on public.profiles
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "own profile insert" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own profile update" on public.profiles
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (user_id) values (new.id);
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
