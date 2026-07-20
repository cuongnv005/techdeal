import { useStorage } from '@vueuse/core'

export type CookieConsent = 'accepted' | 'declined' | null

// null = chưa quyết định (banner hiện) - 'accepted' | 'declined' = đã chọn, banner ẩn.
// app.vue đọc cùng key này để quyết định có tải script quảng cáo (AdSense/MGID...) hay không,
// nên "Từ chối" có tác dụng thật, không chỉ ẩn banner cho có.
export function useCookieConsent() {
  return useStorage<CookieConsent>('cookie-consent', null)
}
