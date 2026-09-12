import { useState } from 'react'

// 이미지 파일이 있으면 그대로 보여주고,
// 없거나 로드에 실패하면 "이미지 자리" 플레이스홀더를 표시한다.
export default function SmartImage({ src, alt, ratio = '4 / 3' }) {
  const [failed, setFailed] = useState(!src)

  if (failed) {
    return (
      <div className="ph" style={{ '--ph-ratio': ratio }}>
        <span>이미지 자리</span>
        <span>
          {src
            ? '이미지를 불러올 수 없습니다 (Storage 버킷이 Public 인지 확인해 주세요)'
            : 'image_url 값이 비어 있습니다'}
        </span>
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
