import SmartImage from './SmartImage'
import { profile as fallback } from '../data'

// 첫 화면 — 소개와 이력서.
// profile 표에 값이 있으면 그것을 쓰고, 없으면 data.js 의 기본값을 쓴다.
//
// 관심 분야는 키워드로 동작한다. 누르면 아래 Games / Papers / Records 에서
// 같은 키워드를 가진 글이 강조된다.
export default function ProfileSection({ row, isAdmin, onEdit, activeKeyword, onKeyword }) {
  const name = row?.name || fallback.name
  const bio = row?.bio || fallback.intro
  const interests = (row?.interests || fallback.skills.join(', '))
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <section className="section wrap" id="profile">
      <div className="profile">
        <div className="profile__portrait">
          <SmartImage src={row?.image ?? null} alt={name} ratio="3 / 4" />
        </div>

        <div>
          <p className="eyebrow">Profile</p>
          <p className="profile__role">“{fallback.role}”</p>

          <div className="profile__bio">
            <p>{bio}</p>
          </div>

          <div className="profile__actions">
            {row?.resume && (
              <a className="btn btn--primary" href={row.resume} target="_blank" rel="noreferrer noopener">
                이력서 보기
              </a>
            )}
            <a className="btn" href={`mailto:${fallback.email}`}>연락하기</a>
            {isAdmin && <button className="btn btn--sm" onClick={onEdit}>소개 수정</button>}
          </div>

          {interests.length > 0 && (
            <>
              <p className="eyebrow profile__chips-label">관심 주제</p>
              <div className="chips">
                {interests.map((k) => (
                  <button
                    key={k}
                    className={`chip${activeKeyword === k ? ' is-on' : ''}`}
                    onClick={() => onKeyword(k)}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
