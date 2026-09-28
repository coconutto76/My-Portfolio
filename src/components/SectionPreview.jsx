import ItemCard from './ItemCard'
import StatusNotice from './StatusNotice'
import { PREVIEW_COUNT } from '../lib/content'

// 홈 화면에 들어가는 섹션 미리보기.
// 고정(pin_order 1·2·3)을 왼쪽부터 차례로 놓고,
// 고정이 3개가 안 되면 최신 글로 나머지 자리를 채운다.
export default function SectionPreview({
  section, status, items, error, onOpen, onMore, activeKeyword, onKeyword,
}) {
  const pinned = items.filter((i) => i.pinned).slice(0, PREVIEW_COUNT)
  const filler = items.filter((i) => !i.pinned).slice(0, PREVIEW_COUNT - pinned.length)
  const preview = [...pinned, ...filler]
  const hidden = items.length - preview.length

  return (
    <section className="section wrap" id={section.key}>
      <div className="section__head">
        <div>
          <p className="eyebrow">{section.blurb}</p>
          <h2 className="section__title">{section.heading}</h2>
        </div>
        {status === 'ready' && (
          <p className="eyebrow">{String(items.length).padStart(2, "0")}</p>
        )}
      </div>

      {status !== 'ready' ? (
        <StatusNotice
          status={status}
          error={error}
          categoryLabel={section.label}
          tableName={section.table}
        />
      ) : (
        <>
          <div className="preview-grid">
            {preview.map((item, i) => (
              <ItemCard
                key={item.id}
                item={item}
                index={i}
                ratio="4 / 3"
                onOpen={onOpen}
                activeKeyword={activeKeyword}
                onKeyword={onKeyword}
              />
            ))}
          </div>

          <button className="more-link" onClick={() => onMore(section.key)}>
            전체 보기{hidden > 0 ? ` (+${hidden})` : ''}
            <span aria-hidden="true">→</span>
          </button>
        </>
      )}
    </section>
  )
}
