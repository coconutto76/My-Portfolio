import SmartImage from './SmartImage'
import { profile } from '../data'

// Profile 탭: 소개 영역
export default function Profile() {
  return (
    <section className="section wrap" id="about">
      <div className="profile">
        <div className="profile__portrait">
          <SmartImage src={profile.portrait} alt={profile.name} ratio="3 / 4" />
        </div>

        <div>
          <p className="eyebrow">About</p>
          <h2 className="profile__name">{profile.name}</h2>
          <p className="profile__role">“{profile.role}”</p>

          <div className="profile__bio">
            <p>
              <em>{profile.intro}</em>
            </p>
            {profile.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <dl className="profile__list">
            <div className="profile__row">
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </dd>
            </div>
            <div className="profile__row">
              <dt>Based in</dt>
              <dd>{profile.location}</dd>
            </div>
            <div className="profile__row">
              <dt>Focus</dt>
              <dd>Impact-driven game design</dd>
            </div>
          </dl>

          <div className="profile__skills">
            {profile.skills.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
