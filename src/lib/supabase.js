import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────
// Supabase 연결 모듈
//
// 브라우저에서 실행되는 코드이므로 "공개용 키(publishable / anon)"만 사용한다.
// 방문자는 조회(select)만 하며, 쓰기 권한은 Supabase의 RLS 정책으로 막는다.
// ─────────────────────────────────────────────────────────────

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

export const storageBucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET?.trim()

// 실수로 비밀키(service_role / secret)를 넣었는지 검사한다.
// VITE_ 로 시작하는 값은 브라우저 번들에 그대로 들어가므로
// 비밀키가 들어오면 연결을 만들지 않고 막는다.
function looksLikeSecretKey(key) {
  if (!key) return false
  if (key.startsWith('sb_secret_')) return true
  // 구형 키는 JWT 형식이며, payload 의 role 이 service_role 이면 비밀키다.
  const parts = key.split('.')
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
      if (payload?.role === 'service_role') return true
    } catch {
      // JWT 가 아니면 검사할 것이 없다.
    }
  }
  return false
}

// 설정에 문제가 있으면 그 이유를 담는다. 문제가 없으면 null.
function detectConfigError() {
  const missing = []
  if (!url) missing.push('VITE_SUPABASE_URL')
  if (!publishableKey) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY')
  if (!storageBucket) missing.push('VITE_SUPABASE_STORAGE_BUCKET')

  if (missing.length > 0) {
    return {
      kind: 'missing-config',
      message: 'Supabase 설정이 아직 입력되지 않았습니다.',
      detail: `.env.local 파일에 다음 값을 넣고 개발 서버를 재시작해 주세요: ${missing.join(', ')}`,
    }
  }

  if (looksLikeSecretKey(publishableKey)) {
    return {
      kind: 'secret-key',
      message: '보안 위험: 비밀키가 입력되어 연결을 중단했습니다.',
      detail:
        'VITE_SUPABASE_PUBLISHABLE_KEY 에는 service_role / secret key 를 넣을 수 없습니다. ' +
        'VITE_ 값은 브라우저에 그대로 노출되므로, Publishable(anon) key 로 바꿔 주세요.',
    }
  }

  return null
}

export const supabaseConfigError = detectConfigError()

export const supabase = supabaseConfigError
  ? null
  : createClient(url, publishableKey, {
      auth: {
        // 방문자는 로그인하지 않는다. 세션을 저장하거나 갱신하지 않는다.
        persistSession: false,
        autoRefreshToken: false,
      },
    })

// Storage 에 올린 경로(예: "works/dog.jpg")를 공개 URL 로 바꾼다.
// 버킷이 Public 으로 설정되어 있어야 한다.
export function getStorageUrl(path) {
  if (!path || !supabase || !storageBucket) return null
  // 이미 전체 URL 이면 그대로 쓴다.
  if (/^https?:\/\//i.test(path)) return path
  const cleaned = path.replace(/^\/+/, '')
  const { data } = supabase.storage.from(storageBucket).getPublicUrl(cleaned)
  return data?.publicUrl ?? null
}
