import { useCallback, useEffect, useState } from 'react'
import { supabase, supabaseConfigError, getStorageUrl } from '../lib/supabase'
import { SECTIONS, parseKeywords } from '../lib/content'

// ─────────────────────────────────────────────────────────────
// 한 섹션(games / papers / records)의 목록을 읽어온다.
//
// 정렬: 고정(pinned) 먼저 → 그다음 최신순
//
// status
//   'loading' 불러오는 중 / 'ready' 1건 이상 / 'empty' 0건 / 'error' 실패
//
// ⚠️ 실패를 예시 데이터로 가리지 않는다.
// ─────────────────────────────────────────────────────────────

// 표가 아직 없을 때 나오는 오류를 알아보기 쉬운 문구로 바꾼다.
function describeError(error, table) {
  const msg = error?.message ?? ''
  const code = error?.code ?? ''

  // 컬럼이 없는 경우 — 표는 있는데 최신 SQL 을 아직 실행하지 않은 상태
  const col = msg.match(/column\s+\S*?\.?(\w+)\s+does not exist/i)
  if (code === '42703' || col) {
    return {
      kind: 'missing-column',
      message: `${table} 표에 ${col ? `'${col[1]}' ` : ''}컬럼이 없습니다.`,
      detail:
        '표는 있지만 최신 컬럼이 아직 추가되지 않았습니다. ' +
        'Supabase SQL Editor 에서 supabase/portfolio-v5.sql 을 실행해 주세요.',
    }
  }

  // 표 자체가 없는 경우
  if (/could not find the table|relation .* does not exist/i.test(msg)) {
    return {
      kind: 'missing-table',
      message: `${table} 표가 아직 없습니다.`,
      detail:
        'Supabase SQL Editor 에서 supabase/portfolio-v3.sql → v4 → v5 를 차례로 실행해 주세요.',
    }
  }

  if (/failed to fetch|networkerror/i.test(msg)) {
    return {
      kind: 'network',
      message: 'Supabase 에 연결하지 못했습니다.',
      detail: `인터넷 연결 또는 Supabase 주소를 확인해 주세요. (${msg})`,
    }
  }

  return { kind: 'query-failed', message: '데이터를 불러오지 못했습니다.', detail: msg }
}

export function toItem(row, section) {
  const pinOrder = Number.isFinite(row.pin_order) ? row.pin_order : null
  return {
    ...row,
    id: String(row.id),
    sectionKey: section.key,
    image: getStorageUrl(row[section.imageField]),
    subtitle: section.subtitleOf(row),
    body: section.bodyOf(row),
    keywordList: parseKeywords(row.keywords),
    pinOrder,
    pinned: pinOrder !== null,
  }
}

export default function useSection(sectionKey) {
  const section = SECTIONS[sectionKey]
  const [state, setState] = useState({ status: 'loading', items: [], error: null })
  const [tick, setTick] = useState(0)

  const reload = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    if (!section) return

    if (supabaseConfigError) {
      setState({ status: 'error', items: [], error: supabaseConfigError })
      return
    }

    let cancelled = false

    async function load() {
      setState({ status: 'loading', items: [], error: null })

      const { data, error } = await supabase
        .from(section.table)
        .select(section.columns)
        .order('pin_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false })

      if (cancelled) return

      if (error) {
        setState({ status: 'error', items: [], error: describeError(error, section.table) })
        return
      }

      const rows = data ?? []
      setState({
        status: rows.length === 0 ? 'empty' : 'ready',
        items: rows.map((r) => toItem(r, section)),
        error: null,
      })
    }

    load()
    return () => {
      cancelled = true
    }
  }, [sectionKey, tick])

  return { ...state, section, reload }
}
