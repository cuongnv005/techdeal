<script setup lang="ts">
import { ref } from 'vue'
import Header from '@features/blog/components/Header.vue'
import Footer from '@features/blog/components/Footer.vue'
import { Sparkles, Mail, Rss, Laptop, Gamepad2 } from 'lucide-vue-next'

useSeoMeta({
  title: 'Giới thiệu & Bản tin',
  description:
    'Tìm hiểu thêm về blog TechDeal, chuyên mục tin tức game và công nghệ của chúng tôi, và đăng ký nhận bản tin khuyến mãi.',
  ogTitle: 'Giới thiệu & Bản tin',
  ogType: 'website',
  robots: 'index, follow'
})

const emailInput = ref('')
const isSubscribed = ref(false)

const handleSubscribe = () => {
  if (emailInput.value.trim()) {
    isSubscribed.value = true
    emailInput.value = ''
    alert('Cảm ơn bạn đã đăng ký nhận bản tin từ TechDeal!')
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300 font-sans"
  >
    <Header />

    <main class="container mx-auto px-4 py-12 max-w-3xl">
      <div
        class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-855 p-6 md:p-10 shadow-xs space-y-8"
      >
        <!-- About Section -->
        <div class="space-y-6">
          <h1
            class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-4 flex items-center gap-2"
          >
            <Sparkles class="w-8 h-8 text-[#3498db] dark:text-[#e74c3c]" /> Giới thiệu TechDeal
          </h1>

          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Chào mừng bạn đến với <strong>TechDeal</strong>, không gian chia sẻ và là cộng đồng dành
            riêng cho những ai đam mê công nghệ và trò chơi điện tử. Chúng tôi không phải là một cơ
            quan báo chí chính thức, mà là một sân chơi được vận hành bởi những người đam mê công
            nghệ và game thủ - những người yêu thích việc chia sẻ các đánh giá phần cứng mới nhất,
            mẹo phần mềm, các thảo luận sôi nổi và các tin khuyến mãi hấp dẫn nhất.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div
              class="p-4 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-150 dark:border-zinc-850 flex gap-3"
            >
              <Laptop class="w-8 h-8 text-blue-500 shrink-0" />
              <div>
                <h3 class="text-xs font-bold text-zinc-900 dark:text-white">Góc Công nghệ</h3>
                <p class="text-[11px] text-zinc-555 mt-1 leading-normal dark:text-zinc-400">
                  Các bài hướng dẫn, thủ thuật hệ điều hành, phân tích phần cứng và các bài đánh giá
                  thiết bị chi tiết.
                </p>
              </div>
            </div>
            <div
              class="p-4 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-150 dark:border-zinc-850 flex gap-3"
            >
              <Gamepad2 class="w-8 h-8 text-red-500 shrink-0" />
              <div>
                <h3 class="text-xs font-bold text-zinc-900 dark:text-white">
                  Thế giới Game & Deal hot
                </h3>
                <p class="text-[11px] text-zinc-555 mt-1 leading-normal dark:text-zinc-400">
                  Cập nhật các chương trình phát tặng game miễn phí từ Steam, Epic Games Store và
                  các nền tảng game lớn khác.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Newsletter Section -->
        <div class="border-t border-gray-200 dark:border-zinc-800 pt-8 space-y-6">
          <h2 class="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Mail class="w-6 h-6 text-[#3498db]" /> Bản tin TechDeal
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Đừng bỏ lỡ các đợt phát tặng game miễn phí và ưu đãi công nghệ được chọn lọc kỹ càng.
            Hãy đăng ký nhận bản tin của chúng tôi để nhận các bài viết tổng hợp nổi bật hàng tuần
            trực tiếp trong hộp thư của bạn.
          </p>

          <form @submit.prevent="handleSubscribe" class="flex flex-col sm:flex-row gap-2 max-w-lg">
            <input
              v-model="emailInput"
              type="email"
              placeholder="Nhập địa chỉ email của bạn..."
              class="flex-grow text-xs px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3498db]"
              required
            />
            <button
              type="submit"
              class="px-5 py-3 bg-[#3498db] dark:bg-[#e74c3c] hover:opacity-90 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Rss class="w-4 h-4" /> Đăng ký
            </button>
          </form>
          <p class="text-[11px] text-zinc-450 dark:text-zinc-500 mt-2">
            Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết không spam. Bạn có thể hủy đăng ký
            bất kỳ lúc nào.
          </p>

          <p v-if="isSubscribed" class="text-xs text-emerald-500 font-semibold">
            🎉 Đăng ký thành công! Hãy chờ đón những ưu đãi tuyệt vời tiếp theo!
          </p>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
