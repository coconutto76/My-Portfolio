-- ============================================================================
--  포트폴리오 v3 — games / papers / records / profile 표 + 권한 설정
--
--  적용 위치:
--    Supabase 대시보드 → 왼쪽 메뉴 SQL Editor → New query
--    → 이 파일 전체를 복사해 붙여넣고 오른쪽 아래 Run 클릭
--
--  ⚠️ 기존 데이터는 건드리지 않습니다.
--     DROP TABLE / DELETE / TRUNCATE 가 하나도 없습니다.
--     지우는 것은 "정책(policy)" 뿐이고, 정책은 데이터가 아니라 규칙입니다.
--     (같은 이름의 정책을 다시 만들 때 충돌을 막으려고 먼저 지웁니다)
--
--  여러 번 실행해도 안전합니다. (create table if not exists / add column if not exists)
--
--  읽기  : 누구나
--  쓰기  : 관리자 UID 483d3ea5-3598-47f7-9885-03db302ec696 한 명만
--          (supabase/policies.sql 의 projects 표와 같은 방식)
-- ============================================================================

create extension if not exists "pgcrypto";


-- ────────────────────────────────────────────────────────────────────────────
--  1. games — 내가 만든 게임 프로젝트
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  year text,
  role text,
  project_type text,
  link_url text,
  cover_image_url text,
  video_url text,
  youtube_url text,
  created_at timestamp with time zone default now()
);

alter table public.games
  add column if not exists description text,
  add column if not exists year text,
  add column if not exists role text,
  add column if not exists project_type text,
  add column if not exists link_url text,
  add column if not exists cover_image_url text,
  add column if not exists video_url text,
  add column if not exists youtube_url text,
  add column if not exists created_at timestamp with time zone default now();


-- ────────────────────────────────────────────────────────────────────────────
--  2. papers — 내가 쓴 게임 논문 / 발표
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  venue text,
  year text,
  abstract text,
  keywords text,
  pdf_url text,
  link_url text,
  cover_image_url text,
  created_at timestamp with time zone default now()
);

alter table public.papers
  add column if not exists venue text,
  add column if not exists year text,
  add column if not exists abstract text,
  add column if not exists keywords text,
  add column if not exists pdf_url text,
  add column if not exists link_url text,
  add column if not exists cover_image_url text,
  add column if not exists created_at timestamp with time zone default now();


-- ────────────────────────────────────────────────────────────────────────────
--  3. records — 내 글, 내 작업이 언급된 문서 / 기사 / 페이지
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.records (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  description text,
  source text,
  year text,
  cover_image_url text,
  created_at timestamp with time zone default now()
);

alter table public.records
  add column if not exists description text,
  add column if not exists source text,
  add column if not exists year text,
  add column if not exists cover_image_url text,
  add column if not exists created_at timestamp with time zone default now();


-- ────────────────────────────────────────────────────────────────────────────
--  4. profile — 이름 / 한 줄 소개 / 관심 분야 / 프로필 사진 / 이력서
--     행은 항상 1개만 씁니다. (가장 최근 행을 읽습니다)
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  name text,
  bio text,
  interests text,
  profile_image_url text,
  resume_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profile
  add column if not exists name text,
  add column if not exists bio text,
  add column if not exists interests text,
  add column if not exists profile_image_url text,
  add column if not exists resume_url text,
  add column if not exists created_at timestamp with time zone default now(),
  add column if not exists updated_at timestamp with time zone default now();

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profile_updated_at on public.profile;
create trigger set_profile_updated_at
  before update on public.profile
  for each row execute function public.set_updated_at();


-- ────────────────────────────────────────────────────────────────────────────
--  5. 표 접근 권한(GRANT)
--
--  권한은 2단으로 작동합니다.
--    1단 GRANT : 이 역할이 이 작업을 "시도"라도 할 수 있는가
--    2단 RLS   : 시도할 수 있는 사람 중 "어떤 행"을 건드릴 수 있는가
--
--  GRANT 가 없으면 RLS 정책을 아무리 잘 만들어도
--  "permission denied for table ..." 오류가 납니다.
--
--  ⚠️ anon(비로그인) 에게는 읽기만 줍니다. 쓰기는 authenticated 에게만 주고,
--     그 안에서 다시 RLS 로 관리자 UID 한 명만 통과시킵니다.
-- ────────────────────────────────────────────────────────────────────────────

grant usage on schema public to anon, authenticated;

grant select on public.games, public.papers, public.records, public.profile
  to anon, authenticated;

grant insert, update, delete
  on public.games, public.papers, public.records, public.profile
  to authenticated;

-- 혹시 예전에 anon 에게 쓰기 권한이 들어가 있었다면 회수합니다.
revoke insert, update, delete
  on public.games, public.papers, public.records, public.profile
  from anon;


-- ────────────────────────────────────────────────────────────────────────────
--  6. RLS 정책 — 읽기는 누구나, 쓰기는 관리자만
--
--     using      = "지금 있는 행"을 건드릴 자격이 있는지
--     with check = "새로 들어갈 / 바뀐 뒤의 값"이 규칙에 맞는지
--     UPDATE 는 둘 다 있어야 합니다.
--
--     표 4개에 같은 규칙을 반복하므로 DO 블록으로 한 번에 만듭니다.
-- ────────────────────────────────────────────────────────────────────────────

do $$
declare
  t text;
  admin_uid constant text := '483d3ea5-3598-47f7-9885-03db302ec696';
begin
  foreach t in array array['games', 'papers', 'records', 'profile'] loop

    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "누구나 조회 가능" on public.%I', t);
    execute format(
      'create policy "누구나 조회 가능" on public.%I
         for select to anon, authenticated using (true)', t);

    execute format('drop policy if exists "관리자만 등록" on public.%I', t);
    execute format(
      'create policy "관리자만 등록" on public.%I
         for insert to authenticated
         with check (auth.uid() = %L::uuid)', t, admin_uid);

    execute format('drop policy if exists "관리자만 수정" on public.%I', t);
    execute format(
      'create policy "관리자만 수정" on public.%I
         for update to authenticated
         using (auth.uid() = %L::uuid)
         with check (auth.uid() = %L::uuid)', t, admin_uid, admin_uid);

    execute format('drop policy if exists "관리자만 삭제" on public.%I', t);
    execute format(
      'create policy "관리자만 삭제" on public.%I
         for delete to authenticated
         using (auth.uid() = %L::uuid)', t, admin_uid);

  end loop;
end $$;


-- ────────────────────────────────────────────────────────────────────────────
--  7. Storage — portfolio-media 버킷
--
--  기존 정책(images/ · videos/ 만 허용)을 폴더 목록만 넓혀서 다시 만듭니다.
--  기존 React 앱이 쓰던 images/ · videos/ 는 그대로 유지되므로
--  이 SQL 을 실행해도 기존 사이트는 계속 동작합니다.
--
--  (storage.foldername(name))[1] 은 파일 경로의 첫 번째 폴더 이름입니다.
--    예) games/abc.jpg        → 'games'
--        profile/image/me.png → 'profile'
--        secret/hack.jpg      → 'secret'  ← 규칙에 안 맞아서 거부됨
-- ────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update set public = true;


-- (1) 파일 읽기 — 누구나 (포트폴리오 이미지가 보여야 하므로)
drop policy if exists "portfolio-media 공개 읽기" on storage.objects;
create policy "portfolio-media 공개 읽기"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'portfolio-media');


-- (2) 파일 올리기 — 관리자만, 정해진 폴더에만
drop policy if exists "portfolio-media 관리자만 업로드" on storage.objects;
create policy "portfolio-media 관리자만 업로드"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and auth.uid() = '483d3ea5-3598-47f7-9885-03db302ec696'::uuid
    and (storage.foldername(name))[1] in
        ('images', 'videos', 'games', 'papers', 'records', 'profile', 'resumes')
  );


-- (3) 파일 덮어쓰기 — 기존 파일과 새 파일 모두 검사
drop policy if exists "portfolio-media 관리자만 교체" on storage.objects;
create policy "portfolio-media 관리자만 교체"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and auth.uid() = '483d3ea5-3598-47f7-9885-03db302ec696'::uuid
    and (storage.foldername(name))[1] in
        ('images', 'videos', 'games', 'papers', 'records', 'profile', 'resumes')
  )
  with check (
    bucket_id = 'portfolio-media'
    and auth.uid() = '483d3ea5-3598-47f7-9885-03db302ec696'::uuid
    and (storage.foldername(name))[1] in
        ('images', 'videos', 'games', 'papers', 'records', 'profile', 'resumes')
  );


-- (4) 파일 삭제 — 관리자만
drop policy if exists "portfolio-media 관리자만 삭제" on storage.objects;
create policy "portfolio-media 관리자만 삭제"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and auth.uid() = '483d3ea5-3598-47f7-9885-03db302ec696'::uuid
    and (storage.foldername(name))[1] in
        ('images', 'videos', 'games', 'papers', 'records', 'profile', 'resumes')
  );


-- ────────────────────────────────────────────────────────────────────────────
--  8. 확인 — 잘 적용됐는지 보기
-- ────────────────────────────────────────────────────────────────────────────

select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename in ('games', 'papers', 'records', 'profile')
order by tablename, cmd;

select policyname, cmd, roles
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by policyname;
