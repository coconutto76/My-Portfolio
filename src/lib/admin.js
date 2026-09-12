import { supabase, storageBucket } from './supabase'

// ─────────────────────────────────────────────────────────────
// 관리자 전용 쓰기 기능 (등록 / 수정 / 삭제 / 파일 업로드)
//
// 여기 있는 UID 검사는 "화면을 보여줄지 말지" 정하는 용도일 뿐이다.
// 실제 권한은 Supabase 의 RLS 정책이 서버에서 막는다.
//   → supabase/policies.sql
// 그래서 이 파일을 누가 고쳐도 남의 데이터를 바꿀 수는 없다.
//
// secret / service_role 키는 쓰지 않는다. 로그인한 사용자의 세션으로만 동작한다.
// ─────────────────────────────────────────────────────────────

export const ADMIN_UID = '483d3ea5-3598-47f7-9885-03db302ec696'

export function isAdminUser(user) {
  return Boolean(user && user.id === ADMIN_UID)
}

// 파일 이름에 공백·한글·기호가 있으면 주소가 깨질 수 있으므로
// 안전한 이름을 새로 만들어 준다. (확장자는 유지)
function safeFileName(file) {
  const dot = file.name.lastIndexOf('.')
  const ext = dot > -1 ? file.name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : ''
  const stamp = Date.now()
  const rand = Math.random().toString(36).slice(2, 8)
  return ext ? `${stamp}-${rand}.${ext}` : `${stamp}-${rand}`
}

// 파일을 images/ 또는 videos/ 폴더에 올리고, 저장된 경로를 돌려준다.
// 실패하면 예외를 던진다. (호출한 쪽에서 입력 내용을 지우지 않고 유지한다)
export async function uploadFile(file, folder) {
  if (!supabase) throw new Error('Supabase 에 연결되어 있지 않습니다.')
  if (!storageBucket) throw new Error('Storage 버킷 이름이 설정되지 않았습니다.')
  if (folder !== 'images' && folder !== 'videos') {
    throw new Error('업로드 폴더는 images 또는 videos 만 허용됩니다.')
  }

  const path = `${folder}/${safeFileName(file)}`

  const { error } = await supabase.storage.from(storageBucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw new Error(`파일 업로드 실패: ${error.message}`)

  // DB 에는 전체 주소가 아니라 경로만 저장한다. (기존 데이터와 같은 방식)
  return path
}

// 작품 등록
export async function createProject({ title, description, imagePath, videoPath }) {
  if (!supabase) throw new Error('Supabase 에 연결되어 있지 않습니다.')

  const { data, error } = await supabase
    .from('projects')
    .insert({
      title,
      description: description || null,
      image_url: imagePath || null,
      video_url: videoPath || null,
    })
    .select('id')
    .single()

  if (error) throw new Error(`작품 저장 실패: ${error.message}`)
  return data
}

// 작품 수정
export async function updateProject(id, { title, description, imagePath, videoPath }) {
  if (!supabase) throw new Error('Supabase 에 연결되어 있지 않습니다.')

  const { error } = await supabase
    .from('projects')
    .update({
      title,
      description: description || null,
      image_url: imagePath || null,
      video_url: videoPath || null,
    })
    .eq('id', id)

  if (error) throw new Error(`작품 수정 실패: ${error.message}`)
}

// 작품 삭제
export async function deleteProject(id) {
  if (!supabase) throw new Error('Supabase 에 연결되어 있지 않습니다.')

  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(`작품 삭제 실패: ${error.message}`)
}
