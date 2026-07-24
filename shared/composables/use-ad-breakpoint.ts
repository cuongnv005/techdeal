// Auto-import của Nuxt KHÔNG áp dụng cho thư mục shared/ — phải import tay,
// nếu không SSR sẽ chết với "ref is not defined".
import { onMounted, ref } from 'vue'

/**
 * Quyết định banner quảng cáo nào được PHÉP MOUNT theo bề rộng màn hình.
 *
 * Trước đây banner chỉ bị ẩn bằng class Tailwind (`hidden xl:block` /
 * `xl:hidden`) — component vẫn mount và vẫn gọi invoke.js, nên mỗi lượt xem
 * mobile đốt 3 impression không ai nhìn thấy (và 1 impression trên desktop).
 * Impression không khả kiến kéo CTR/CPM xuống và dễ bị network coi là invalid
 * traffic — đúng loại sự cố đã làm mất 2 zone Monetag trước đó.
 *
 * Giá trị chốt MỘT LẦN lúc mounted và cố tình KHÔNG phản ứng với resize: mỗi
 * lần đổi giá trị sẽ unmount/mount lại banner = thêm một request quảng cáo,
 * user kéo co giãn cửa sổ qua mép 1280px có thể tạo ra một tràng request trông
 * y hệt invalid traffic. Đổi lại, xoay ngang/dọc thiết bị sẽ không đổi banner —
 * chấp nhận được vì các mốc xoay thực tế (390↔844, 820↔1180) đều nằm cùng một
 * phía của 1280px.
 */

// Khớp với breakpoint `xl` mặc định của Tailwind v4 (project không override
// screens trong tailwind.css). Đây là NGUỒN DUY NHẤT quyết định banner nào
// chạy — template không còn dùng `hidden xl:*` cho mấy khối này nữa.
const XL_BREAKPOINT = 1280

export function useAdBreakpoint() {
  const isDesktopAd = ref(false)
  const isMobileAd = ref(false)

  onMounted(() => {
    const isDesktop = window.matchMedia(`(min-width: ${XL_BREAKPOINT}px)`).matches
    isDesktopAd.value = isDesktop
    isMobileAd.value = !isDesktop
  })

  return { isDesktopAd, isMobileAd }
}
