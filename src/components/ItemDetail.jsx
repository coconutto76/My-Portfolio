import { useEffect } from 'react'
import SmartImage from './SmartImage'
import { getStorageUrl } from '../lib/supabase'

// 상세 보기: 이미지(좌) + 설명(우) 2단. 모바일에서는 위아래로 쌓인다.
export default function ItemDetail({ item, isAdmin, onEdit, onDelete, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const links = [
    { label: '바로가기', href: item.url || item.link_url },
    { label: '유튜브에서 보기', href: item.youtube_url },
    { label: 'PDF 보기', href: getStorageUrl(item.pdf_url) },
    { label: '영상 보기', href: getStorageUrl(item.video_url) },
  ].filter((l) => l.href)

  const facts = [
    ['연도', item.year],
    ['역할', item.role],
    ['종류', item.project_type],
    ['발표처', item.venue],
    ['키워드', item.keywords],
    ['출처', item.source],
  ].filter(([, v]) => v)

  return (
    <div className="detail" role="dialog" aria-modal="true">
      <div className="detail__bar">
        <span className="idx">{item.pinned ? '고정' : ''}</span>
        <span className="detail__bar-right">
          {isAdmin && (
            <>
              <button className="btn btn--sm" onClick={onEdit}>수정</button>
              <button className="btn btn--sm btn--danger" onClick={onDelete}>삭제</button>
            </>
          )}
          <button className="detail__close" onClick={onClose}>닫기 ✕</button>
        </span>
      </div>

      <div className="detail__body">
        <div className="detail__media">
          <SmartImage src={item.image} alt={item.title} ratio="4 / 3" />
        </div>

        <div className="detail__info">
          <p className="eyebrow">{item.sectionKey}</p>
          <h2>{item.title}</h2>
          {item.subtitle && <p className="sub">{item.subtitle}</p>}
          {item.body && <p className="desc">{item.body}</p>}

          {links.length > 0 && (
            <div className="detail__links">
              {links.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer noopener">
                  {l.label} →
                </a>
              ))}
            </div>
          )}

          {facts.length > 0 && (
            <dl className="detail__facts">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}

          {item.dateLabel && <p className="detail__year">{item.dateLabel}</p>}
        </div>
      </div>
    </div>
  )
}
