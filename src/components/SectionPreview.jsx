import ItemCard from './ItemCard'
import StatusNotice from './StatusNotice'

// 홈 화면에 들어가는 섹션 미리보기.
// 고정(pinned) 1개 + 최신 2개만 보여주고, 나머지는 '더보기'로 넘긴다.
export default function SectionPreview({ section, status, items, error, onOpen, onMore }) {
  const pinned = items.find((i) => i.pinned) ?? null
  const rest = items.filter((i) => i !== pinned).slice(0, pinned ? 2 : 3)
  const preview = pinned ? [pinned, ...rest] : rest
  const hidden = items.length - preview.length

  return (
    <section className="section wrap" id={section.key}>
      <div className="section__head">
        <div>
          <p className="eyebrow">{section.blurb}</p>
          <h2 className="section__title">{section.heading}</h2>
        </div>
        {status === 'ready' && (
          <p className="eyebrow">{String(items.length).padStart(2, '0')} entries</p>
        )}
      </div>

      {status !== 'ready' ? (
        <StatusNotice status={status} error={error} categoryLabel={section.label} tableName={section.table} />
      ) : (
        <>
          <div className="preview-grid">
            {preview.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} onOpen={onOpen} />
            ))}
          </div>

          <button className="more-link" onClick={() => onMore(section.key)}>
            {section.label} 더보기
            {hidden > 0 ? ` (${hidden}개 더)` : ''} →
          </button>
        </>
      )}
    </section>
  )
}
