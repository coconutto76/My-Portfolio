import { useCallback, useEffect, useState } from 'react'
import { supabase, supabaseConfigError, getStorageUrl } from '../lib/supabase'

// ─────────────────────────────────────────────────────────────
// Supabase 의 projects 표에서 작품을 최신순으로 읽어온다. (조회 전용)
//
// status 는 네 가지 중 하나다.
//   'loading' — 불러오는 중
//   'ready'   — 작품을 하나 이상 불러왔음
//   'empty'   — 연결은 됐지만 등록된 작품이 0건
//   'error'   — 설정 누락 또는 연결/조회 실패
//
// ⚠️ 실패했을 때 예시 데이터로 대체하지 않는다. 실패는 실패로 보여준다.
// ─────────────────────────────────────────────────────────────

const SELECT_COLUMNS = 'id, title, description, image_url, video_url, created_at'

// DB 한 줄을 화면 컴포넌트가 쓰는 형태로 바꾼다.
function toWork(row, position) {
  const hasVideo = Boolean(row.video_url && String(row.video_url).trim())
  const createdAt = row.created_at ? new Date(row.created_at) : null

  return {
    id: String(row.id),
    index: String(position + 1).padStart(2, '0'),
    title: row.title || '제목 없음',
    subtitle: createdAt
      ? createdAt.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
      : '',
    year: createdAt ? String(createdAt.getFullYear()) : '',
    description: row.description || '',
    image: getStorageUrl(row.image_url),
    videoUrl: hasVideo ? getStorageUrl(row.video_url) : null,
    category: hasVideo ? 'video' : 'image',
    meta: [],
    featured: position === 0,

    // 관리자 수정 폼에서 쓰는 원본 값 (전체 주소가 아니라 Storage 경로)
    rawId: row.id,
    imagePath: row.image_url || '',
    videoPath: row.video_url || '',
  }
}

export default function useProjects() {
  const [state, setState] = useState({ status: 'loading', works: null, error: null })
  const [tick, setTick] = useState(0)

  // 작품을 등록/수정/삭제한 뒤 목록을 다시 읽기 위해 호출한다.
  const reload = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    // 설정이 없거나 비밀키가 들어온 경우 — 조회를 시도하지 않고 바로 알린다.
    if (supabaseConfigError) {
      setState({ status: 'error', works: null, error: supabaseConfigError })
      return
    }

    let cancelled = false

    async function load() {
      setState({ status: 'loading', works: null, error: null })

      const { data, error } = await supabase
        .from('projects')
        .select(SELECT_COLUMNS)
        .order('created_at', { ascending: false })

      if (cancelled) return

      if (error) {
        setState({
          status: 'error',
          works: null,
          error: {
            kind: 'query-failed',
            message: '작품 데이터를 불러오지 못했습니다.',
            detail: error.message,
          },
        })
        return
      }

      const rows = data ?? []
      if (rows.length === 0) {
        setState({ status: 'empty', works: { image: [], video: [] }, error: null })
        return
      }

      // 최신순을 유지한 채 video_url 유무로 나눈다.
      const image = []
      const video = []
      for (const row of rows) {
        const bucket = row.video_url && String(row.video_url).trim() ? video : image
        bucket.push(row)
      }

      setState({
        status: 'ready',
        works: {
          image: image.map(toWork),
          video: video.map(toWork),
        },
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
