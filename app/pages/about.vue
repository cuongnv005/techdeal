<script setup lang="ts">
import { ref } from 'vue'

import { Sparkles, Mail, Rss, Laptop, Gamepad2 } from 'lucide-vue-next'

import Footer from '@features/blog/components/Footer.vue'
import Header from '@features/blog/components/Header.vue'

useSeoMeta({
  title: 'Giới thiệu & Bản tin',
  description:
    'Tìm hiểu thêm về blog TechDeal, chuyên mục tin tức game và công nghệ của chúng tôi, và đăng ký nhận bản tin khuyến mãi.',
  ogTitle: 'Giới thiệu & Bản tin',
  ogType: 'website',
  ogUrl: 'https://techdeal.io.vn/about',
  robots: 'index, follow'
})

useHead({
  link: [{ rel: 'canonical', href: 'https://techdeal.io.vn/about' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'TechDeal',
        url: 'https://techdeal.io.vn',
        logo: 'https://techdeal.io.vn/images/logo.png',
        description:
          'Trang tin tức công nghệ, game và tổng hợp ưu đãi phần mềm, ứng dụng miễn phí.',
        email: 'contact@techdeal.io.vn',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+84822344589',
          contactType: 'customer support',
          areaServed: 'VN',
          availableLanguage: 'Vietnamese'
        }
      })
    }
  ]
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
            <strong>TechDeal</strong> là trang tin tức và chia sẻ kiến thức công nghệ được thành lập
            năm 2026, tập trung vào các chủ đề thiết thực nhất với người dùng Việt Nam: thủ thuật hệ
            điều hành, đánh giá ứng dụng, tin tức phần cứng, thế giới game và các ưu đãi công nghệ
            hấp dẫn được cập nhật hàng ngày.
          </p>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Với đội ngũ biên tập có nhiều năm kinh nghiệm trong lĩnh vực công nghệ và truyền thông
            số, chúng tôi cam kết mang đến nội dung chính xác, được kiểm chứng và thực sự hữu ích —
            không phải chỉ để câu view. Mỗi bài viết trên TechDeal đều được viết từ trải nghiệm thực
            tế và góc nhìn độc lập của người dùng.
          </p>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-3 pt-2">
            <div
              class="p-4 bg-blue-50 dark:bg-zinc-950 rounded-xl border border-blue-100 dark:border-zinc-850 text-center"
            >
              <p class="text-xl font-black text-[#3498db]">100+</p>
              <p class="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Bài viết</p>
            </div>
            <div
              class="p-4 bg-green-50 dark:bg-zinc-950 rounded-xl border border-green-100 dark:border-zinc-850 text-center"
            >
              <p class="text-xl font-black text-green-500">Hàng ngày</p>
              <p class="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Cập nhật</p>
            </div>
            <div
              class="p-4 bg-amber-50 dark:bg-zinc-950 rounded-xl border border-amber-100 dark:border-zinc-850 text-center"
            >
              <p class="text-xl font-black text-amber-500">2026</p>
              <p class="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">Thành lập</p>
            </div>
          </div>

          <!-- Content pillars -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div
              class="p-4 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-150 dark:border-zinc-850 flex gap-3"
            >
              <Laptop class="w-8 h-8 text-blue-500 shrink-0" />
              <div>
                <h3 class="text-xs font-bold text-zinc-900 dark:text-white">Góc Công nghệ</h3>
                <p class="text-[11px] text-zinc-555 mt-1 leading-normal dark:text-zinc-400">
                  Hướng dẫn thực tế, thủ thuật hệ điều hành Windows/iOS/Android, phân tích phần cứng
                  và đánh giá ứng dụng từ góc nhìn người dùng hàng ngày.
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
                  Tổng hợp game và ứng dụng đang miễn phí trên Steam, Epic Games, App Store và
                  Google Play — cập nhật nhanh nhất, chọn lọc kỹ nhất.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Section -->
        <div class="border-t border-gray-200 dark:border-zinc-800 pt-8 space-y-5">
          <h2 class="text-xl font-bold text-zinc-900 dark:text-white">Đội ngũ biên tập</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Author 1 -->
            <div
              class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-150 dark:border-zinc-850"
            >
              <img
                src="https://i.ibb.co/6chzMbZ2/2026-06-17-002902.png"
                alt="Nguyễn Văn Cương"
                class="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-[#3498db]/30"
              />
              <div>
                <p class="text-xs font-black text-zinc-900 dark:text-white">Nguyễn Văn Cương</p>
                <p class="text-[10px] text-[#3498db] font-semibold mb-1">
                  Founder & Editor-in-Chief
                </p>
                <p class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ và truyền thông số. Chuyên sâu về
                  hệ sinh thái iOS, Android và các xu hướng AI mới nhất.
                </p>
              </div>
            </div>
            <!-- Author 2 -->
            <div
              class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-150 dark:border-zinc-850"
            >
              <div
                class="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center shrink-0 text-white font-black text-sm border-2 border-red-300/30"
              >
                TK
              </div>
              <div>
                <p class="text-xs font-black text-zinc-900 dark:text-white">Nguyễn Tuấn Khải</p>
                <p class="text-[10px] text-red-500 font-semibold mb-1">Editor — Game & Windows</p>
                <p class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Game thủ kỳ cựu với 8 năm theo dõi ngành công nghiệp game. Chuyên viết về Windows,
                  PC gaming và các deal phần mềm hấp dẫn.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Values Section -->
        <div class="border-t border-gray-200 dark:border-zinc-800 pt-8 space-y-5">
          <h2 class="text-xl font-bold text-zinc-900 dark:text-white">Cam kết của chúng tôi</h2>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <span class="text-green-500 font-black text-sm mt-0.5">✓</span>
              <div>
                <p class="text-xs font-bold text-zinc-900 dark:text-white">Độc lập & Khách quan</p>
                <p class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Nội dung biên tập hoàn toàn độc lập, không bị ảnh hưởng bởi nhà quảng cáo hay đối
                  tác thương mại.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-green-500 font-black text-sm mt-0.5">✓</span>
              <div>
                <p class="text-xs font-bold text-zinc-900 dark:text-white">
                  Cập nhật nhanh & Chính xác
                </p>
                <p class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Đội ngũ kiểm tra thông tin trước khi đăng, đặc biệt với các deal miễn phí có thời
                  hạn để đảm bảo bạn không lãng phí thời gian.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-green-500 font-black text-sm mt-0.5">✓</span>
              <div>
                <p class="text-xs font-bold text-zinc-900 dark:text-white">
                  Liên kết an toàn & Sạch sẽ
                </p>
                <p class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Chúng tôi nói không với link rác, link rút gọn chứa quảng cáo độc hại hay mã độc.
                  Tất cả các liên kết tải về hoặc mua sắm đều được kiểm duyệt kỹ lưỡng để bảo vệ
                  trải nghiệm của bạn.
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
            Hãy đăng ký nhận bản tin để nhận tổng hợp nổi bật hàng tuần trực tiếp vào hộp thư của
            bạn.
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
          <p class="text-[11px] text-zinc-450 dark:text-zinc-500">
            Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết không spam. Hủy đăng ký bất kỳ lúc
            nào.
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
