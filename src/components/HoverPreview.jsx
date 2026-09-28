import { useEffect, useState } from 'react'

// 목록에서 한 줄에 마우스를 올리면 커서 옆에 뜨는 미리보기 이미지.
// 손가락 입력(모바일)에서는 뜨지 않는다.
export default function HoverPreview({ item }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [fine, setFine] = useState(false)

  useEffect(() => {
    setFine(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

  useEffect(() => {
    if (!fine) return
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [fine])

  if (!fine || !item?.image) return null

  // 화면 밖으로 나가지 않도록 위치를 접는다.
  const W = 300
  const H = 210
  const left = Math.min(pos.x + 26, window.innerWidth - W - 16)
  const top = Math.min(Math.max(pos.y - H / 2, 16), window.innerHeight - H - 16)

  return (
    <div className="hoverpv" style={{ left, top, width: W, height: H }} aria-hidden="true">
      <img src={item.image} alt="" />
    </div>
  )
}
