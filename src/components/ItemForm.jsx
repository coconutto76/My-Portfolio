import { useEffect, useState } from 'react'
import { createRow, updateRow, uploadFile } from '../lib/admin'
import { SECTIONS, SECTION_ORDER } from '../lib/content'

// 글 등록 / 수정 폼.
// 새 글을 쓸 때는 맨 위에서 카테고리(Games / Papers / Records)를 고른다.
//
// ⚠️ 실패하면 입력한 내용을 절대 지우지 않는다.
//    이미 올라간 파일의 경로도 상태에 남겨 두어, 다시 시도할 때
//    같은 파일을 두 번 업로드하지 않는다.
export default function ItemForm({ sectionKey, item, onSaved, onClose, saveFn, profileSection }) {
  const editing = Boolean(item)

  // 새 글이면 카테고리를 바꿀 수 있고, 수정이면 고정된다.
  const [current, setCurrent] = useState(sectionKey ?? SECTION_ORDER[0])
  const section = profileSection ?? SECTIONS[current]

  const [values, setValues] = useState({})
  const [files, setFiles] = useState({})
  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState(null)
  const [error, setError] = useState(null)

  // 카테고리를 바꾸면 그 카테고리의 칸을 준비한다.
  // 같은 이름의 칸(제목·설명·키워드 등)에 적어둔 값은 그대로 이어받는다.
  useEffect(() => {
    setValues((prev) => {
      const next = {}
      for (const f of section.fields) {
        if (prev[f.name] !== undefined) next[f.name] = prev[f.name]
        else if (f.name === 'pin_order') next[f.name] = item?.pin_order ? String(item.pin_order) : ''
        else next[f.name] = item?.[f.name] ?? ''
      }
      return next
    })
  }, [current, profileSection])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !busy && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, busy])

  const setValue = (name, v) => setValues((s) => ({ ...s, [name]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)

    try {
      // 1) 새로 고른 파일부터 업로드하고, 성공한 경로를 바로 상태에 반영한다.
      const next = { ...values }
      for (const f of section.fields) {
        const picked = files[f.name]
        if (f.type !== 'file' || !picked) continue

        setStep(`${f.label} 업로드 중…`)
        const path = await uploadFile(picked, f.folder)
        next[f.name] = path
        setValues((s) => ({ ...s, [f.name]: path }))
        setFiles((s) => ({ ...s, [f.name]: null }))
      }

      // 2) 표에 저장한다.
      setStep(editing ? '수정 중…' : '저장 중…')
      const payload = {}
      for (const f of section.fields) {
        const raw = next[f.name]
        if (f.name === 'pin_order') {
          payload[f.name] = raw === '' || raw == null ? null : Number(raw)
        } else {
          const v = typeof raw === 'string' ? raw.trim() : raw
          payload[f.name] = v === '' || v == null ? null : v
        }
      }

      if (saveFn) await saveFn(payload)
      else if (editing) await updateRow(section.table, item.id, payload)
      else await createRow(section.table, payload)

      onSaved(current)
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
          <button className="modal__close" onClick={onClose} disabled={busy}>닫기 ✕</button>
        </div>

        <h2 className="modal__title">
          {profileSection ? '소개 수정' : editing ? `${section.label} 수정` : '새 글 등록'}
        </h2>

        <form onSubmit={handleSubmit}>
          {!profileSection && (
            <label className="field">
              <span className="field__label">카테고리 *</span>
              {editing ? (
                <>
                  <input type="text" value={section.label} disabled readOnly />
                  <p className="field__hint">
                    등록한 뒤에는 카테고리를 바꿀 수 없습니다. 옮기려면 새로 등록한 뒤 기존 글을 지워 주세요.
                  </p>
                </>
              ) : (
                <select value={current} onChange={(e) => setCurrent(e.target.value)} disabled={busy}>
                  {SECTION_ORDER.map((k) => (
                    <option key={k} value={k}>{SECTIONS[k].label}</option>
                  ))}
                </select>
              )}
            </label>
          )}

          {section.fields.map((f) => (
            <Field
              key={f.name}
              field={f}
              value={values[f.name] ?? ''}
              file={files[f.name] ?? null}
              busy={busy}
              onChange={(v) => setValue(f.name, v)}
              onPickFile={(file) => setFiles((s) => ({ ...s, [f.name]: file }))}
            />
          ))}

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
            <button type="button" className="btn" onClick={onClose} disabled={busy}>취소</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ field, value, file, busy, onChange, onPickFile }) {
  if (field.type === 'select') {
    return (
      <label className="field">
        <span className="field__label">{field.label}</span>
        <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} disabled={busy}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {field.hint && <p className="field__hint">{field.hint}</p>}
      </label>
    )
  }

  if (field.type === 'file') {
    return (
      <div className="field">
        <span className="field__label">{field.label}</span>
        <input
          type="file"
          accept={field.accept}
          disabled={busy}
          onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
        />
        {file && (
          <p className="field__hint">
            선택함: <strong>{file.name}</strong> → 저장 시 <code>{field.folder}/</code> 에 올라갑니다.
          </p>
        )}
        {!file && value && (
          <p className="field__hint">
            현재 값: <code>{value}</code>{' '}
            <button type="button" className="link-btn" onClick={() => onChange('')} disabled={busy}>
              지우기
            </button>
          </p>
        )}
      </div>
    )
  }

  return (
    <label className="field">
      <span className="field__label">
        {field.label}
        {field.required ? ' *' : ''}
      </span>
      {field.type === 'textarea' ? (
        <textarea
          rows={4}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          disabled={busy}
        />
      ) : (
        <input
          type={field.type === 'url' ? 'url' : 'text'}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          disabled={busy}
        />
      )}
      {field.hint && <p className="field__hint">{field.hint}</p>}
    </label>
  )
}
