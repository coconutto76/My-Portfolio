import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { isAdminUser } from '../lib/admin'

// ─────────────────────────────────────────────────────────────
// 관리자 로그인 상태를 다룬다.
//
// 비밀번호는 로그인 폼에서만 받아 Supabase 로 바로 보낸다.
// 코드나 환경변수에 저장하지 않는다.
// ─────────────────────────────────────────────────────────────

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) {
      setChecking(false)
      return
    }

    let cancelled = false

    // 이미 로그인되어 있는지 확인한다. (새로고침 후에도 유지)
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setUser(data?.session?.user ?? null)
      setChecking(false)
    })

    // 로그인 / 로그아웃이 일어나면 화면을 따라 바꾼다.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      cancelled = true
      sub?.subscription?.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    if (!supabase) throw new Error('Supabase 에 연결되어 있지 않습니다.')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // Supabase 의 영어 메시지를 이해하기 쉬운 문구로 바꾼다.
      if (/invalid login credentials/i.test(error.message)) {
        throw new Error('이메일 또는 비밀번호가 맞지 않습니다.')
      }
      if (/email not confirmed/i.test(error.message)) {
        throw new Error('이메일 인증이 완료되지 않은 계정입니다.')
      }
      throw new Error(`로그인 실패: ${error.message}`)
    }

    // 관리자 계정이 아니면 바로 로그아웃시킨다.
    if (!isAdminUser(data.user)) {
      await supabase.auth.signOut()
      throw new Error('이 계정은 관리자가 아닙니다.')
    }

    return data.user
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }, [])

  return {
    user,
    isAdmin: isAdminUser(user),
    checking,
    signIn,
    signOut,
  }
}
