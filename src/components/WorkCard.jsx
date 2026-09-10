import SmartImage from './SmartImage'

// 메이슨리 안에 들어가는 작품 카드.
// 이미지에 마우스를 올리면 살짝 확대 + 흑백→컬러 (CSS에서 처리)
export default function WorkCard({ work, isVideo, onOpen }) {
  // 카드마다 살짝 다른 비율을 줘서 화보 같은 리듬을 만든다
  const ratios = ['3 / 4', '4 / 3', '1 / 1', '5 / 4', '4 / 5']
  const ratio = ratios[(work.index.charCodeAt(1) + work.index.charCodeAt(0)) % ratios.length]

  return (
    <button className="card" onClick={() => onOpen(work)}>
      <div className="card__frame">
        <SmartImage src={work.image} alt={work.title} ratio={ratio} />
        <span className="card__index">{work.index}</span>
        {isVideo && <span className="play-badge">▶</span>}
      </div>
      <div className="card__caption">
        <span className="num">{work.index}</span>
        <span>
          <h3>{work.title}</h3>
          <span className="sub">{work.subtitle}</span>
        </span>
      </div>
    </button>
  )
}
