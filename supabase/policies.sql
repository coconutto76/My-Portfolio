-- ============================================================================
--  관리자 1명만 작품을 등록/수정/삭제할 수 있게 만드는 권한 설정
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
--  관리자 UID: 483d3ea5-3598-47f7-9885-03db302ec696
-- ============================================================================


-- ────────────────────────────────────────────────────────────────────────────
--  1. projects 표 — 읽기는 누구나, 쓰기는 관리자만
-- ────────────────────────────────────────────────────────────────────────────

-- RLS(행 단위 보안)를 켠다. 이미 켜져 있으면 아무 일도 일어나지 않는다.
alter table public.projects enable row level security;


-- ── 표 접근 권한(GRANT) ──────────────────────────────────────
--  권한은 2단으로 작동한다.
--    1단 GRANT : 이 역할이 이 작업을 "시도"라도 할 수 있는가
--    2단 RLS   : 시도할 수 있는 사람 중에서 "어떤 행"을 건드릴 수 있는가
--
--  GRANT 가 없으면 RLS 정책을 아무리 잘 만들어도
--  "permission denied for table projects" 오류가 난다.
--
--  ⚠️ anon(비로그인) 에게는 읽기만 준다. 쓰기는 authenticated 에게만 주고,
--     그 안에서 다시 RLS 로 관리자 UID 한 명만 통과시킨다.

grant usage on schema public to anon, authenticated;

grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

-- 혹시 예전에 anon 에게 쓰기 권한이 들어가 있었다면 회수한다.
revoke insert, update, delete on public.projects from anon;


-- (1) 조회 — 로그인하지 않은 방문자도 볼 수 있어야 한다. (기존 동작 유지)
drop policy if exists "누구나 조회 가능" on public.projects;
create policy "누구나 조회 가능"
  on public.projects
  for select
  to anon, authenticated
  using (true);


-- (2) 등록(INSERT) — 새로 만들려는 사람이 관리자인지 검사한다.
--     with check = "새로 들어갈 내용"에 대한 검사
drop policy if exists "관리자만 등록" on public.projects;
create policy "관리자만 등록"
  on public.projects
  for insert
  to authenticated
  with check (
    auth.uid() = '483d3ea5-3598-47f7-9885-03db302ec696'::uuid
  );


-- (3) 수정(UPDATE) — 기존 행과 새 값을 모두 검사한다.
--     using      = "지금 있는 행"을 건드릴 자격이 있는지
--     with check = "바꾼 뒤의 값"이 규칙에 맞는지
--     둘 다 있어야 한다. using 만 있으면 수정 후 값을 검사하지 않는다.
drop policy if exists "관리자만 수정" on public.projects;
create policy "관리자만 수정"
  on public.projects
  for update
  to authenticated
  using (
    auth.uid() = '483d3ea5-3598-47f7-9885-03db302ec696'::uuid
  )
  with check (
    auth.uid() = '483d3ea5-3598-47f7-9885-03db302ec696'::uuid
  );


-- (4) 삭제(DELETE) — 지우려는 행을 건드릴 자격이 있는지 검사한다.
drop policy if exists "관리자만 삭제" on public.projects;
create policy "관리자만 삭제"
  on public.projects
  for delete
  to authenticated
  using (
    auth.uid() = '483d3ea5-3598-47f7-9885-03db302ec696'::uuid
  );


-- ────────────────────────────────────────────────────────────────────────────
--  2. Storage — portfolio-media 버킷의 images/ · videos/ 폴더
--
--  storage.objects 는 Supabase가 파일 목록을 저장하는 표다.
--  RLS는 이미 켜져 있으므로 따로 켜지 않는다.
--
--  (storage.foldername(name))[1] 은 파일 경로의 첫 번째 폴더 이름이다.
--    예) images/dog.jpg      → 'images'
--        videos/teaser.mp4   → 'videos'
--        secret/hack.jpg     → 'secret'  ← 규칙에 안 맞아서 거부됨
-- ────────────────────────────────────────────────────────────────────────────

-- (1) 파일 읽기 — 누구나 (포트폴리오 이미지가 보여야 하므로)
drop policy if exists "portfolio-media 공개 읽기" on storage.objects;
create policy "portfolio-media 공개 읽기"
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'portfolio-media'
  );


-- (2) 파일 올리기 — 관리자만, images/ 또는 videos/ 폴더에만
drop policy if exists "portfolio-media 관리자만 업로드" on storage.objects;
create policy "portfolio-media 관리자만 업로드"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and auth.uid() = '483d3ea5-3598-47f7-9885-03db302ec696'::uuid
    and (storage.foldername(name))[1] in ('images', 'videos')
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
    and (storage.foldername(name))[1] in ('images', 'videos')
  )
  with check (
    bucket_id = 'portfolio-media'
    and auth.uid() = '483d3ea5-3598-47f7-9885-03db302ec696'::uuid
    and (storage.foldername(name))[1] in ('images', 'videos')
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
    and (storage.foldername(name))[1] in ('images', 'videos')
  );


-- ────────────────────────────────────────────────────────────────────────────
--  3. 확인 — 잘 적용됐는지 보기
-- ────────────────────────────────────────────────────────────────────────────

-- projects 표의 정책 목록
select policyname, cmd, roles
from pg_policies
where schemaname = 'public' and tablename = 'projects'
order by cmd;

-- Storage 정책 목록
select policyname, cmd, roles
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by policyname;
