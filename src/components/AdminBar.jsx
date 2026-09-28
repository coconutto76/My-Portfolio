// 관리자로 로그인했을 때 화면 맨 위에 뜨는 막대.
// 글 등록은 버튼 하나로 통합하고, 카테고리는 작성 창에서 고른다.
export default function AdminBar({ email, onNewPost, onEditProfile, onSignOut }) {
  return (
    <div className="adminbar">
      <span className="adminbar__label">
        관리자 모드 · <strong>{email}</strong>
      </span>
      <span className="adminbar__actions">
        <button className="btn btn--primary btn--sm" onClick={onNewPost}>
          + 새 글 등록
        </button>
        <button className="btn btn--sm" onClick={onEditProfile}>소개 수정</button>
        <button className="btn btn--sm" onClick={onSignOut}>로그아웃</button>
      </span>
    </div>
  )
}
