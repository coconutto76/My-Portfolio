import { useCallback, useEffect, useState } from 'react'
import { supabase, supabaseConfigError, getStorageUrl } from '../lib/supabase'

// profile 표에서 한 줄만 읽어온다. (소개 / 이력서)
// 행이 없어도 오류가 아니다 — 아직 안 적은 것뿐이다.
export default function useProfileRow() {
  const [state, setState] = useState({ status: 'loading', row: null, error: null })
  const [tick, setTick] = useState(0)
  const reload = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    if (supabaseConfigError) {
      setState({ status: 'error', row: null, error: supabaseConfigError })
      return
    }

    let cancelled = false

    async function load() {
      setState({ status: 'loading', row: null, error: null })

      const { data, error } = await supabase
        .from('profile')
        .select('id, name, bio, interests, profile_image_url, resume_url, updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)

      if (cancelled) return

      if (error) {
        setState({
          status: 'error',
          row: null,
          error: { kind: 'query-failed', message: '소개 정보를 불러오지 못했습니다.', detail: error.message },
        })
        return
      }

      const row = data?.[0] ?? null
      setState({
        status: row ? 'ready' : 'empty',
        row: row
          ? { ...row, image: getStorageUrl(row.profile_image_url), resume: getStorageUrl(row.resume_url) }
          : null,
        error: null,
      })
    }

    load()
    return () => {
      cancelled = true
    }
  }, [tick])

  return { ...state, reload }
}
