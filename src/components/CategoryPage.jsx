import SmartImage from './SmartImage'
import WorkCard from './WorkCard'
import StatusNotice from './StatusNotice'

// 한 카테고리(이미지 / 영상) 화면.
// 1) 대표작 1개를 비대칭 2단으로 크게
// 2) 나머지는 Masonry 레이아웃
//
// 작품을 못 불러온 경우에는 카드 대신 안내 문구를 보여준다.
// 실패를 예시 데이터로 가리지 않는다.
export default function CategoryPage({ label, items, categoryKey, status, error, onOpen }) {
  const isVideo = categoryKey === 'video'
  const list = items ?? []

  // 전체 조회는 성공했지만 이 탭에 해당하는 작품만 0건인 경우도 'empty' 로 다룬다.
  const viewStatus = status === 'ready' && list.length === 0 ? 'empty' : status
  const showWorks = viewStatus === 'ready'

  const featured = showWorks ? list.find((w) => w.featured) ?? list[0] : null
  const rest = showWorks ? list.filter((w) => w !== featured) : []

  return (
    <section className="section wrap" id="works">
      <div className="section__head">
        <div>
          <p className="eyebrow">Selected Works</p>
          <h2 className="section__title">{label}</h2>
        </div>
        {showWorks && (
          <p className="eyebrow">{String(list.length).padStart(2, '0')} projects</p>
        )}
      </div>

      {!showWorks ? (
        <StatusNotice status={viewStatus} error={error} categoryLabel={label} />
      ) : (
        <>
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

          {rest.length > 0 && (
            <div className="masonry">
              {rest.map((w) => (
                <WorkCard key={w.id} work={w} isVideo={isVideo} onOpen={onOpen} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
