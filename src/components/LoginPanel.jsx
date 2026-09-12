import { useEffect, useState } from 'react'

// 관리자 로그인 폼.
// 비밀번호는 이 폼에서만 입력받아 Supabase 로 바로 보낸다. 어디에도 저장하지 않는다.
export default function LoginPanel({ onSignIn, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !busy && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, busy])

  async function handleSubmit(e) {
    e.preventDefault()
    if (busy) return

    setBusy(true)
    setError(null)
    try {
      await onSignIn(email.trim(), password)
      // 성공했을 때만 입력을 비우고 닫는다.
      setPassword('')
      onClose()
    } catch (err) {
      // 실패하면 입력한 이메일은 그대로 두고, 비밀번호만 비운다.
      setError(err.message)
      setPassword('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="관리자 로그인">
      <div className="modal__panel">
        <div className="modal__head">
          <p className="eyebrow">Admin</p>
          <button className="modal__close" onClick={onClose} disabled={busy}>
            닫기 ✕
          </button>
        </div>

        <h2 className="modal__title">관리자 로그인</h2>
        <p className="modal__desc">작품을 등록·수정·삭제하려면 로그인이 필요합니다.</p>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              disabled={busy}
            />
          </label>

          <label className="field">
            <span className="field__label">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={busy}
            />
          </label>

          {error && <p className="field__error">{error}</p>}

          <div className="modal__actions">
            <button type="submit" className="btn btn--primary" disabled={busy}>
              {busy ? '로그인 중…' : '로그인'}
            </button>
            <button type="button" className="btn" onClick={onClose} disabled={busy}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
