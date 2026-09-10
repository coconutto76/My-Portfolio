import { useState } from 'react'

// 이미지 파일이 있으면 그대로 보여주고,
// 없거나 로드에 실패하면 "이미지 자리" 플레이스홀더를 표시한다.
export default function SmartImage({ src, alt, ratio = '4 / 3' }) {
  const [failed, setFailed] = useState(!src)

  if (failed) {
    return (
      <div className="ph" style={{ '--ph-ratio': ratio }}>
        <span>이미지 자리</span>
        <span>{src ? `${src} 파일을 넣어주세요` : '이미지 경로가 없습니다'}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
