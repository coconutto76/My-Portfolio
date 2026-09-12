// 관리자로 로그인했을 때 화면 맨 위에 뜨는 막대.
export default function AdminBar({ email, onNewWork, onSignOut }) {
  return (
    <div className="adminbar">
      <span className="adminbar__label">
        관리자 모드 · <strong>{email}</strong>
      </span>
      <span className="adminbar__actions">
        <button className="btn btn--primary btn--sm" onClick={onNewWork}>
          + 새 작품 등록
        </button>
        <button className="btn btn--sm" onClick={onSignOut}>
          로그아웃
        </button>
      </span>
    </div>
  )
}
