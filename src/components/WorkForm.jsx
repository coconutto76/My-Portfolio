import { useEffect, useState } from 'react'
import { createProject, updateProject, uploadFile } from '../lib/admin'

// 작품 등록 / 수정 폼.
//
// ⚠️ 실패하면 입력한 내용을 절대 지우지 않는다.
//    이미 올라간 파일의 경로도 상태에 남겨 두어, 다시 시도할 때
//    같은 파일을 두 번 업로드하지 않는다.
export default function WorkForm({ work, onSaved, onClose }) {
  const editing = Boolean(work)

  const [title, setTitle] = useState(work?.title ?? '')
  const [description, setDescription] = useState(work?.description ?? '')

  // 파일 선택 상태와 "이미 저장된/업로드된 경로"를 따로 둔다.
  const [imageFile, setImageFile] = useState(null)
  const [imagePath, setImagePath] = useState(work?.imagePath ?? '')
  const [videoFile, setVideoFile] = useState(null)
  const [videoPath, setVideoPath] = useState(work?.videoPath ?? '')

  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !busy && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, busy])

  async function handleSubmit(e) {
    e.preventDefault()
    if (busy) return

    setBusy(true)
    setError(null)

    try {
      // 1) 새로 고른 파일이 있으면 먼저 업로드한다.
      let nextImagePath = imagePath
      if (imageFile) {
        setStep('이미지 업로드 중…')
        nextImagePath = await uploadFile(imageFile, 'images')
        // 성공한 업로드는 즉시 상태에 반영한다.
        // 뒤 단계에서 실패해도 다시 올릴 필요가 없다.
        setImagePath(nextImagePath)
        setImageFile(null)
      }

      let nextVideoPath = videoPath
      if (videoFile) {
        setStep('영상 업로드 중…')
        nextVideoPath = await uploadFile(videoFile, 'videos')
        setVideoPath(nextVideoPath)
        setVideoFile(null)
      }

      // 2) 파일 주소를 작품 행에 저장한다.
      setStep(editing ? '작품 수정 중…' : '작품 저장 중…')
      const payload = {
        title: title.trim(),
        description: description.trim(),
        imagePath: nextImagePath.trim(),
        videoPath: nextVideoPath.trim(),
      }

      if (editing) {
        await updateProject(work.rawId, payload)
      } else {
        await createProject(payload)
      }

      onSaved()
    } catch (err) {
      // 입력 내용을 유지한 채 원인만 보여준다.
      setError(err.message)
    } finally {
      setBusy(false)
      setStep(null)
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__panel modal__panel--wide">
        <div className="modal__head">
          <p className="eyebrow">{editing ? 'Edit' : 'New'}</p>
          <button className="modal__close" onClick={onClose} disabled={busy}>
            닫기 ✕
          </button>
        </div>

        <h2 className="modal__title">{editing ? '작품 수정' : '새 작품 등록'}</h2>
        <p className="modal__desc">
          영상 파일이나 영상 주소를 넣으면 <strong>영상</strong> 탭에, 없으면{' '}
          <strong>이미지</strong> 탭에 표시됩니다.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">제목 *</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={busy}
            />
          </label>

          <label className="field">
            <span className="field__label">설명</span>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={busy}
            />
          </label>

          <FileField
            label="이미지"
            folder="images"
            file={imageFile}
            path={imagePath}
            accept="image/*"
            busy={busy}
            onPick={setImageFile}
            onClearPath={() => setImagePath('')}
          />

          <FileField
            label="영상"
            folder="videos"
            file={videoFile}
            path={videoPath}
            accept="video/*"
            busy={busy}
            onPick={setVideoFile}
            onClearPath={() => setVideoPath('')}
            onPathChange={setVideoPath}
            allowUrl
          />

          {step && <p className="field__step">{step}</p>}

          {error && (
            <div className="field__error field__error--block">
              <strong>{error}</strong>
              <span>입력한 내용은 그대로 남겨 두었습니다. 고친 뒤 다시 시도해 주세요.</span>
            </div>
          )}

          <div className="modal__actions">
            <button type="submit" className="btn btn--primary" disabled={busy}>
              {busy ? '저장 중…' : editing ? '수정 저장' : '등록'}
            </button>
            <button type="button" className="btn" onClick={onClose} disabled={busy}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 파일 하나를 고르거나, 이미 저장된 경로를 보여주는 입력칸
function FileField({
  label,
  folder,
  file,
  path,
  accept,
  busy,
  onPick,
  onClearPath,
  onPathChange,
  allowUrl,
}) {
  return (
    <div className="field">
      <span className="field__label">{label}</span>

      <input
        type="file"
        accept={accept}
        disabled={busy}
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />

      {file && (
        <p className="field__hint">
          선택함: <strong>{file.name}</strong> → 저장 시 <code>{folder}/</code> 폴더에 업로드됩니다.
        </p>
      )}

      {!file && path && (
        <p className="field__hint">
          현재 값: <code>{path}</code>{' '}
          <button type="button" className="link-btn" onClick={onClearPath} disabled={busy}>
            지우기
          </button>
        </p>
      )}

      {allowUrl && !file && (
        <input
          type="text"
          className="field__sub"
          placeholder="또는 영상 주소 직접 입력 (예: https://youtu.be/...)"
          value={path}
          onChange={(e) => onPathChange(e.target.value)}
          disabled={busy}
        />
      )}
    </div>
  )
}
