import SmartImage from './SmartImage'

// 목록에 들어가는 카드 하나.
// 이미지에 마우스를 올리면 살짝 확대되고 흑백 → 컬러로 바뀐다. (CSS)
export default function ItemCard({ item, index, onOpen }) {
  const ratios = ['3 / 4', '4 / 3', '1 / 1', '5 / 4']
  const ratio = ratios[index % ratios.length]
  const num = String(index + 1).padStart(2, '0')

  return (
    <button className="card" onClick={() => onOpen(item)}>
      <div className="card__frame">
        <SmartImage src={item.image} alt={item.title} ratio={ratio} />
        <span className="card__index">{num}</span>
        {item.pinned && <span className="pin-badge">고정</span>}
      </div>
      <div className="card__caption">
        <span className="num">{num}</span>
        <span>
          <h3>{item.title}</h3>
          {item.subtitle && <span className="sub">{item.subtitle}</span>}
        </span>
      </div>
    </button>
  )
}
