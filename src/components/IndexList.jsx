import StatusNotice from './StatusNotice'

// 한 섹션을 번호 매긴 목록으로 보여준다.
// 카드가 아니라 한 줄씩. 마우스를 올리면 이미지가 커서 옆에 뜬다.
export default function IndexList({
  section,
  status,
  items,
  error,
  limit,            // 첫 화면에서는 몇 줄만 보여준다
  onOpen,
  onMore,
  activeKeyword,
  onKeyword,
  onHover,
}) {
  // 첫 화면: 올린 글(pin_order) 먼저, 모자라면 최신으로 채운다.
  let shown = items
  let hidden = 0
  if (limit) {
    const pinned = items.filter((i) => i.pinned).slice(0, limit)
    const filler = items.filter((i) => !i.pinned).slice(0, limit - pinned.length)
    shown = [...pinned, ...filler]
    hidden = items.length - shown.length
  }

  return (
    <section className="idx" id={section.key}>
      <header className="idx__head">
        <h2 className="idx__title">{section.heading}</h2>
        <p className="idx__blurb">{section.blurb}</p>
        {status === 'ready' && (
          <span className="idx__count">{String(items.length).padStart(2, '0')}</span>
        )}
      </header>

      {status !== 'ready' ? (
        <StatusNotice
          status={status}
          error={error}
          categoryLabel={section.label}
          tableName={section.table}
        />
      ) : (
        <>
          <ul className="rows">
            {shown.map((item, i) => (
              <Row
                key={item.id}
                item={item}
                n={i + 1}
                onOpen={onOpen}
                activeKeyword={activeKeyword}
                onKeyword={onKeyword}
                onHover={onHover}
              />
            ))}
          </ul>

          {limit && (
            <button className="idx__more" onClick={() => onMore(section.key)}>
              전체 보기{hidden > 0 ? ` (+${hidden})` : ''}
              <span aria-hidden="true">→</span>
            </button>
          )}
        </>
      )}
    </section>
  )
}

function Row({ item, n, onOpen, activeKeyword, onKeyword, onHover }) {
  const matches = activeKeyword ? item.keywordList.includes(activeKeyword) : null
  const cls = ['row', matches === true && 'is-hit', matches === false && 'is-dim']
    .filter(Boolean)
    .join(' ')

  return (
    <li
      className={cls}
      onMouseEnter={() => onHover(item)}
      onMouseLeave={() => onHover(null)}
    >
      <button className="row__main" onClick={() => onOpen(item)}>
        <span className="row__n">{String(n).padStart(2, '0')}</span>

        {/* 첨부한 사진이 있으면 제목 왼쪽에 작게 */}
        <span className={`row__thumb${item.image ? '' : ' is-empty'}`}>
          {item.image && <img src={item.image} alt="" loading="lazy" />}
        </span>

        <span className="row__title">
          {item.title}
          {item.pinned && <i className="row__dot" aria-label="선정작" />}
        </span>
        <span className="row__meta">{item.subtitle}</span>
        <span className="row__go" aria-hidden="true">→</span>

        {/* 설명 맛보기 — games 는 설명, papers 는 초록, archive 는 간단한 설명 */}
        {item.body && <span className="row__snippet">{item.body}</span>}
      </button>

      {item.keywordList.length > 0 && (
        <span className="row__keys">
          {item.keywordList.map((k) => (
            <button
              key={k}
              className={`chip chip--xs${activeKeyword === k ? ' is-on' : ''}`}
              onClick={() => onKeyword(k)}
            >
              {k}
            </button>
          ))}
        </span>
      )}
    </li>
  )
}
