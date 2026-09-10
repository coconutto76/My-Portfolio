import SmartImage from './SmartImage'
import WorkCard from './WorkCard'

// 한 카테고리(이미지 / 영상 / Pages) 화면.
// 1) 대표작 1개를 비대칭 2단으로 크게
// 2) 나머지는 Masonry 레이아웃
export default function CategoryPage({ label, items, categoryKey, onOpen }) {
  const isVideo = categoryKey === 'video'
  const featured = items.find((w) => w.featured)
  const rest = items.filter((w) => !w.featured)

  return (
    <section className="section wrap" id="works">
      <div className="section__head">
        <div>
          <p className="eyebrow">Selected Works</p>
          <h2 className="section__title">{label}</h2>
        </div>
        <p className="eyebrow">{String(items.length).padStart(2, '0')} projects</p>
      </div>

      {featured && (
        <button
          className="featured"
          onClick={() => onOpen(featured)}
          style={{ width: '100%', textAlign: 'left' }}
        >
          <div className="card__frame">
            <SmartImage src={featured.image} alt={featured.title} ratio="16 / 10" />
            <span className="card__index">{featured.index}</span>
            {isVideo && <span className="play-badge">▶</span>}
          </div>
          <div className="featured__text">
            <span className="index">{featured.index}</span>
            <h3>{featured.title}</h3>
            <p>{featured.description}</p>
            <span className="more">상세 보기 →</span>
          </div>
        </button>
      )}

      <div className="masonry">
        {rest.map((w) => (
          <WorkCard key={w.id} work={w} isVideo={isVideo} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
