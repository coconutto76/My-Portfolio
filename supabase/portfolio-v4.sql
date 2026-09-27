-- ============================================================================
--  v4 — 고정(pinned) 기능 추가 + 기존 projects 작품을 games 로 옮기기
--
--  적용 위치:
--    Supabase 대시보드 → 왼쪽 메뉴 SQL Editor → New query
--    → 이 파일 전체를 복사해 붙여넣고 오른쪽 아래 Run 클릭
--
--  ⚠️ 먼저 portfolio-v3.sql 을 실행해 두셔야 합니다.
--     (games / papers / records / profile 표가 있어야 합니다)
--
--  ⚠️ 기존 데이터는 지우지 않습니다.
--     DROP TABLE / DELETE / TRUNCATE 가 하나도 없습니다.
--     projects 표도 그대로 남습니다 (백업 역할).
--
--  여러 번 실행해도 안전합니다.
-- ============================================================================


-- ────────────────────────────────────────────────────────────────────────────
--  1. pinned 컬럼 추가 — 홈 화면에 고정으로 띄울 항목을 고르기 위한 것
-- ────────────────────────────────────────────────────────────────────────────

alter table public.games   add column if not exists pinned boolean not null default false;
alter table public.papers  add column if not exists pinned boolean not null default false;
alter table public.records add column if not exists pinned boolean not null default false;

-- 홈 화면은 "고정 1개 + 최신 2개"를 뽑는다. 정렬용 인덱스.
create index if not exists games_pinned_created_idx   on public.games   (pinned desc, created_at desc);
create index if not exists papers_pinned_created_idx  on public.papers  (pinned desc, created_at desc);
create index if not exists records_pinned_created_idx on public.records (pinned desc, created_at desc);


-- ────────────────────────────────────────────────────────────────────────────
--  2. 기존 projects 3건을 games 로 복사
--
--  projects 표는 지우지 않고 그대로 둡니다. 복사만 합니다.
--  같은 제목이 이미 games 에 있으면 건너뛰므로 여러 번 실행해도
--  중복으로 쌓이지 않습니다.
-- ────────────────────────────────────────────────────────────────────────────

insert into public.games (title, description, cover_image_url, video_url, link_url, created_at)
select
  p.title,
  p.description,
  p.image_url,      -- Storage 경로와 전체 URL 이 섞여 있어도 앱이 둘 다 처리합니다
  p.video_url,
  p.site_url,
  p.created_at
from public.projects p
where not exists (
  select 1 from public.games g where g.title = p.title
);


-- ────────────────────────────────────────────────────────────────────────────
--  3. 확인
-- ────────────────────────────────────────────────────────────────────────────

select table_name, column_name, data_type, column_default
from information_schema.columns
where table_schema = 'public' and column_name = 'pinned'
order by table_name;

select 'projects (원본, 그대로 유지)' as 구분, count(*) as 건수 from public.projects
union all select 'games (복사됨)', count(*) from public.games
union all select 'papers',         count(*) from public.papers
union all select 'records',        count(*) from public.records;
