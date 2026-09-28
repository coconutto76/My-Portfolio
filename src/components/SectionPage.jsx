import ItemCard from './ItemCard'
import StatusNotice from './StatusNotice'

// 한 섹션의 전체 목록 화면. (더보기를 누르면 여기로 온다)
export default function SectionPage({
  section, status, items, error, onOpen, onBack, activeKeyword, onKeyword,
}) {
  return (
    <section className="section wrap">
      <button className="back-link" onClick={onBack}>← Profile 로 돌아가기</button>

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
        <StatusNotice
          status={status}
          error={error}
          categoryLabel={section.label}
          tableName={section.table}
        />
      ) : (
        <div className="masonry">
          {items.map((item, i) => (
            <ItemCard
              key={item.id}
              item={item}
              index={i}
              onOpen={onOpen}
              activeKeyword={activeKeyword}
              onKeyword={onKeyword}
            />
          ))}
        </div>
      )}
    </section>
  )
}
