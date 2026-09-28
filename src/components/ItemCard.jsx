import SmartImage from './SmartImage'

// 목록에 들어가는 카드 하나.
// 키워드가 선택되면 해당 키워드를 가진 카드만 강조되고 나머지는 흐려진다.
export default function ItemCard({ item, index, onOpen, activeKeyword, onKeyword, ratio: fixedRatio }) {
  const ratios = ['3 / 4', '4 / 3', '1 / 1', '5 / 4']
  const ratio = fixedRatio ?? ratios[index % ratios.length]
  const num = String(index + 1).padStart(2, '0')

  const matches = activeKeyword ? item.keywordList.includes(activeKeyword) : null
  const cls = ['card', matches === true && 'is-hit', matches === false && 'is-dim']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls}>
      <button className="card__open" onClick={() => onOpen(item)}>
        <div
          className={`card__frame${fixedRatio ? ' card__frame--fixed' : ''}`}
          style={fixedRatio ? { '--ratio': fixedRatio } : undefined}
        >
          <SmartImage src={item.image} alt={item.title} ratio={ratio} />
          <span className="card__index">{num}</span>
          {item.pinned && <span className="pin-dot" aria-label="선정작" />}
        </div>
        <div className="card__caption">
          <span className="num">{num}</span>
          <span>
            <h3>{item.title}</h3>
            {item.subtitle && <span className="sub">{item.subtitle}</span>}
          </span>
        </div>
      </button>

      {item.keywordList.length > 0 && (
        <div className="chips">
          {item.keywordList.map((k) => (
            <button
              key={k}
              className={`chip${activeKeyword === k ? ' is-on' : ''}`}
              onClick={() => onKeyword(k)}
            >
              {k}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
