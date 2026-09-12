import { useEffect } from 'react'
import SmartImage from './SmartImage'

// 작품 상세 보기: 이미지(좌) + 설명(우) 2단 구성. 모바일에서는 위/아래로 쌓임.
export default function WorkDetail({ work, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="detail" role="dialog" aria-modal="true">
      <div className="detail__bar">
        <span className="idx">{work.index}</span>
        <button className="detail__close" onClick={onClose}>
          닫기 ✕
        </button>
      </div>

      <div className="detail__body">
        <div className="detail__media">
          <SmartImage src={work.image} alt={work.title} ratio="4 / 3" />
        </div>

        <div className="detail__info">
          <p className="eyebrow">{work.index} — Case</p>
          <h2>{work.title}</h2>
          <p className="sub">{work.subtitle}</p>
          <p className="desc">{work.description}</p>

          {work.videoUrl && (
            <a
              className="detail__video"
              href={work.videoUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              ▶ 영상 보기
            </a>
          )}

          {work.meta?.length > 0 && (
            <div className="detail__tags">
              {work.meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          )}

          <p className="detail__year">{work.year}</p>
        </div>
      </div>
    </div>
  )
}
