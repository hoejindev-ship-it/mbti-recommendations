-- 닉네임: 친구 목록에 이메일 대신 보여 줄 이름
alter table public.profiles add column nickname text;

update public.profiles p
set nickname = split_part(u.email, '@', 1)
from auth.users u
where u.id = p.user_id;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (user_id, nickname)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;

-- 친구 관계
create table public.friendships (
  id bigint generated always as identity primary key,
  requester uuid not null references auth.users(id) on delete cascade,
  addressee uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  check (requester <> addressee)
);

create unique index friendships_pair_idx
  on public.friendships (least(requester, addressee), greatest(requester, addressee));
create index friendships_addressee_idx on public.friendships (addressee);

alter table public.friendships enable row level security;

create policy "friendships visible to participants" on public.friendships
  for select to authenticated
  using ((select auth.uid()) in (requester, addressee));

-- 요청을 받은 사람만 수락(status 변경)할 수 있다
create policy "addressee accepts" on public.friendships
  for update to authenticated
  using ((select auth.uid()) = addressee)
  with check ((select auth.uid()) = addressee and status = 'accepted');

revoke update on public.friendships from authenticated;
grant update (status) on public.friendships to authenticated;

-- 거절/취소/친구 끊기: 양쪽 모두 가능
create policy "participants delete" on public.friendships
  for delete to authenticated
  using ((select auth.uid()) in (requester, addressee));

-- 이메일로 친구 요청 (이메일 목록은 노출하지 않는다)
create function public.send_friend_request(target_email text) returns text
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := auth.uid();
  target uuid;
  existing public.friendships;
begin
  if me is null then
    return 'unauthorized';
  end if;

  select id into target from auth.users where lower(email) = lower(trim(target_email));
  if target is null then
    return 'not_found';
  end if;
  if target = me then
    return 'self';
  end if;

  select * into existing from public.friendships
  where least(requester, addressee) = least(me, target)
    and greatest(requester, addressee) = greatest(me, target);

  if found then
    if existing.status = 'accepted' then
      return 'already_friends';
    end if;
    if existing.addressee = me then
      update public.friendships set status = 'accepted' where id = existing.id;
      return 'accepted';
    end if;
    return 'already_sent';
  end if;

  insert into public.friendships (requester, addressee) values (me, target);
  return 'sent';
end;
$$;

-- 내 친구/요청 목록. MBTI는 수락된 친구에게만 보인다.
create function public.list_friendships()
returns table (
  friendship_id bigint,
  friend_id uuid,
  nickname text,
  mbti text,
  status text,
  i_am_requester boolean
)
language sql security definer set search_path = '' stable as $$
  select
    f.id,
    other.user_id,
    coalesce(other.nickname, '친구'),
    case when f.status = 'accepted' then other.mbti else null end,
    f.status,
    f.requester = auth.uid()
  from public.friendships f
  join public.profiles other
    on other.user_id = case when f.requester = auth.uid() then f.addressee else f.requester end
  where auth.uid() in (f.requester, f.addressee)
  order by f.created_at desc;
$$;

revoke execute on function public.send_friend_request(text) from public, anon;
revoke execute on function public.list_friendships() from public, anon;
grant execute on function public.send_friend_request(text) to authenticated;
grant execute on function public.list_friendships() to authenticated;
