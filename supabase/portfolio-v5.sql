-- ============================================================================
--  v5 — 고정 순서(1·2·3), 키워드, 게임 진행 상황 추가
--
--  적용 위치:
--    Supabase 대시보드 → 왼쪽 메뉴 SQL Editor → New query
--    → 이 파일 전체를 복사해 붙여넣고 오른쪽 아래 Run 클릭
--
--  ⚠️ 기존 데이터는 지우지 않습니다.
--     DROP TABLE / DROP COLUMN / DELETE / TRUNCATE 가 하나도 없습니다.
--     컬럼을 "추가"만 합니다.
--
--  여러 번 실행해도 안전합니다. (add column if not exists)
-- ============================================================================


-- ────────────────────────────────────────────────────────────────────────────
--  1. pin_order — 홈 화면에 고정할 순서 (1, 2, 3). 비어 있으면 고정 안 함.
--
--     기존 pinned(true/false) 컬럼은 지우지 않고 그대로 둡니다.
--     앞으로는 pin_order 를 기준으로 동작합니다.
-- ────────────────────────────────────────────────────────────────────────────

alter table public.games   add column if not exists pin_order integer;
alter table public.papers  add column if not exists pin_order integer;
alter table public.records add column if not exists pin_order integer;

-- 1~3 이외의 값이 들어가지 않도록 막는다.
do $$
declare t text;
begin
  foreach t in array array['games','papers','records'] loop
    execute format(
      'alter table public.%I drop constraint if exists %I', t, t || '_pin_order_range');
    execute format(
      'alter table public.%I add constraint %I check (pin_order is null or pin_order between 1 and 3)',
      t, t || '_pin_order_range');
  end loop;
end $$;

-- 예전에 pinned = true 로 해둔 것이 있으면 1번 자리로 옮겨준다.
-- (지금은 고정된 것이 없어서 아무 일도 일어나지 않습니다)
update public.games   set pin_order = 1 where pinned is true and pin_order is null;
update public.papers  set pin_order = 1 where pinned is true and pin_order is null;
update public.records set pin_order = 1 where pinned is true and pin_order is null;


-- ────────────────────────────────────────────────────────────────────────────
--  2. keywords — 게임과 기록에도 키워드를 붙일 수 있게 한다.
--     (papers 에는 이미 있습니다)
-- ────────────────────────────────────────────────────────────────────────────

alter table public.games   add column if not exists keywords text;
alter table public.records add column if not exists keywords text;


-- ────────────────────────────────────────────────────────────────────────────
--  3. progress — 게임의 현재 진행 상황
-- ────────────────────────────────────────────────────────────────────────────

alter table public.games add column if not exists progress text;


-- ────────────────────────────────────────────────────────────────────────────
--  4. 정렬용 인덱스
-- ────────────────────────────────────────────────────────────────────────────

create index if not exists games_pin_created_idx   on public.games   (pin_order, created_at desc);
create index if not exists papers_pin_created_idx  on public.papers  (pin_order, created_at desc);
create index if not exists records_pin_created_idx on public.records (pin_order, created_at desc);


-- ────────────────────────────────────────────────────────────────────────────
--  5. 확인
-- ────────────────────────────────────────────────────────────────────────────

select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in ('games','papers','records')
  and column_name in ('pin_order','keywords','progress')
order by table_name, column_name;
