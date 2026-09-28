// 작품 목록 대신 보여주는 안내 문구.
// 불러오는 중 / 등록된 작품 없음 / 연결 실패 를 각각 다르게 표시한다.
export default function StatusNotice({ status, error, categoryLabel, tableName }) {
  if (status === 'loading') {
    return (
      <div className="notice notice--loading">
        <span className="notice__spinner" aria-hidden="true" />
        <p className="notice__title">불러오는 중</p>
        <p className="notice__body">잠시만 기다려 주세요.</p>
      </div>
    )
  }

  if (status === 'empty') {
    const what = categoryLabel ?? '항목'
    return (
      <div className="notice">
        <p className="eyebrow">Empty</p>
        <p className="notice__title">아직 비어 있습니다</p>
        <p className="notice__body">
          Supabase 에는 정상적으로 연결되었지만 {tableName ? <code>{tableName}</code> : '이 표'} 가 비어 있습니다.
          주소 끝에 <code>?admin</code> 을 붙여 로그인하면 등록할 수 있습니다.
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="notice notice--error" role="alert">
        <p className="eyebrow">Connection failed</p>
        <p className="notice__title">{error?.message ?? '작품 데이터를 불러오지 못했습니다.'}</p>
        {error?.detail && <p className="notice__body">{error.detail}</p>}
        <p className="notice__hint">
          설정을 고친 뒤에는 개발 서버를 <strong>완전히 끄고 다시 실행</strong>해야 값이 반영됩니다.
        </p>
      </div>
    )
  }

  return null
}
