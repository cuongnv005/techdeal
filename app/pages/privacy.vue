<script setup lang="ts">
import Footer from '@features/blog/components/Footer.vue'
import Header from '@features/blog/components/Header.vue'

const { locale } = useI18n()
const isEn = computed(() => locale.value === 'en')

useSeoMeta({
  title: () => isEn.value ? 'Privacy Policy' : 'Chính sách Bảo mật',
  description: () => isEn.value
    ? 'Privacy Policy of TechDeal, detailing how we collect, use, and protect your personal information.'
    : 'Chính sách bảo mật của TechDeal, mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.',
  ogTitle: () => isEn.value ? 'Privacy Policy' : 'Chính sách Bảo mật',
  ogType: 'website',
  ogUrl: 'https://techdeal.io.vn/privacy',
  robots: 'index, follow'
})

useHead({
  link: [{ rel: 'canonical', href: 'https://techdeal.io.vn/privacy' }]
})
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300 font-sans"
  >
    <Header />

    <main class="container mx-auto px-4 py-12 max-w-3xl">
      <div
        class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-250 dark:border-zinc-855 p-6 md:p-10 shadow-xs space-y-6"
      >
        <!-- Vietnamese Content -->
        <div v-if="locale !== 'en'" class="space-y-6">
          <h1
            class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-4"
          >
            Chính sách Bảo mật
          </h1>
          <p class="text-zinc-550 text-xs italic">Cập nhật lần cuối: 20 tháng 7, 2026</p>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Chính sách Bảo mật này mô tả cách TechDeal (<strong>techdeal.io.vn</strong>) thu thập, sử
            dụng và bảo vệ thông tin của bạn khi bạn truy cập trang web. Bằng cách sử dụng trang web,
            bạn đồng ý với các điều khoản được mô tả trong chính sách này.
          </p>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              1. Thông tin chúng tôi thu thập
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              TechDeal chỉ thu thập thông tin cần thiết để vận hành trang web. Cụ thể:
            </p>
            <ul class="list-disc pl-5 text-xs text-zinc-650 dark:text-zinc-400 space-y-2">
              <li>
                <strong>Thông tin tài khoản:</strong> Khi bạn đăng ký tài khoản, chúng tôi thu thập
                tên hiển thị, địa chỉ email và mật khẩu đã được mã hóa.
              </li>
              <li>
                <strong>Bình luận:</strong> Khi bạn để lại bình luận, chúng tôi lưu nội dung bình
                luận, tên hiển thị, email và địa chỉ IP để kiểm duyệt nội dung.
              </li>
              <li>
                <strong>Dữ liệu sử dụng:</strong> Chúng tôi tự động ghi nhận thông tin kỹ thuật như
                địa chỉ IP, loại trình duyệt, thiết bị, trang đã xem, thời gian truy cập và nguồn giới
                thiệu thông qua các công cụ phân tích.
              </li>
              <li>
                <strong>Thông tin liên hệ:</strong> Khi bạn gửi form liên hệ, chúng tôi thu thập họ
                tên, email và nội dung tin nhắn của bạn.
              </li>
            </ul>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              2. Cách chúng tôi sử dụng thông tin
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              Thông tin thu thập được sử dụng cho các mục đích sau:
            </p>
            <ul class="list-disc pl-5 text-xs text-zinc-650 dark:text-zinc-400 space-y-2">
              <li>Vận hành và cải thiện trang web, bao gồm cá nhân hóa trải nghiệm người dùng.</li>
              <li>Xác thực danh tính và quản lý tài khoản thành viên.</li>
              <li>Kiểm duyệt bình luận và ngăn chặn spam.</li>
              <li>Phân tích lưu lượng truy cập để nâng cao chất lượng nội dung.</li>
              <li>Phản hồi các yêu cầu hỗ trợ và liên hệ từ người dùng.</li>
              <li>Hiển thị quảng cáo phù hợp thông qua các đối tác quảng cáo của chúng tôi.</li>
            </ul>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              3. Cookies và Công nghệ theo dõi
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              Trang web sử dụng cookies — các tệp văn bản nhỏ được lưu trên thiết bị của bạn — để duy
              trì phiên đăng nhập và ghi nhớ tùy chọn của bạn. Bạn có thể tắt cookies trong cài đặt
              trình duyệt, tuy nhiên một số tính năng của trang web có thể không hoạt động đúng.
            </p>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              Ngoài cookies của TechDeal, các đối tác quảng cáo bên thứ ba của chúng tôi cũng có thể
              đặt cookies trên thiết bị của bạn trong quá trình phân phối quảng cáo.
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              4. Quảng cáo — Đối tác quảng cáo bên thứ ba
            </h2>
            <div
              class="bg-blue-50/50 dark:bg-zinc-900/50 p-5 rounded-xl border-l-4 border-[#3498db] space-y-3"
            >
              <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
                TechDeal hợp tác với các mạng quảng cáo bên thứ ba, bao gồm nhưng không giới hạn ở
                <strong>Google AdSense</strong> và <strong>MGID</strong>, để hiển thị quảng cáo trên
                trang web. Các đối tác này, với tư cách là nhà cung cấp quảng cáo bên thứ ba, sử dụng
                cookies để phân phối quảng cáo dựa trên lịch sử duyệt web của bạn trên trang này và
                các trang khác. Các cookies này không thu thập thông tin nhận dạng cá nhân như tên,
                email hay số điện thoại.
              </p>
              <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
                Bạn có thể từ chối quảng cáo cá nhân hóa bằng cách truy cập:
              </p>
              <ul class="list-disc pl-5 text-xs text-zinc-650 dark:text-zinc-400 space-y-1">
                <li>
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-[#3498db] hover:underline font-semibold"
                    >Cài đặt quảng cáo Google</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.aboutads.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-[#3498db] hover:underline font-semibold"
                    >www.aboutads.info</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              5. Bảo mật thông tin
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              Chúng tôi thực hiện các biện pháp bảo mật phù hợp để bảo vệ dữ liệu cá nhân của bạn khỏi bị truy cập, tiết lộ hoặc phá hủy trái phép. Tuy nhiên, xin lưu ý rằng không có phương thức truyền dữ liệu qua Internet nào là an toàn tuyệt đối.
            </p>
          </section>

          <section class="space-y-3 border-t border-gray-250 dark:border-zinc-800 pt-6">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">Liên hệ</h2>
            <p class="text-xs text-zinc-650 dark:text-zinc-400">
              Nếu bạn có câu hỏi về Chính sách Bảo mật này, vui lòng liên hệ:
            </p>
            <ul class="text-xs text-zinc-650 dark:text-zinc-400 space-y-1">
              <li>
                <strong>Email:</strong>
                <a
                  href="mailto:contact@techdeal.io.vn"
                  class="text-[#3498db] dark:text-[#e74c3c] hover:underline font-semibold"
                >
                  contact@techdeal.io.vn
                </a>
              </li>
            </ul>
          </section>
        </div>

        <!-- English Content -->
        <div v-else class="space-y-6">
          <h1
            class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-4"
          >
            Privacy Policy
          </h1>
          <p class="text-zinc-550 text-xs italic">Last updated: July 20, 2026</p>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            This Privacy Policy describes how TechDeal (<strong>techdeal.io.vn</strong>) collects, uses, and protects your information when you access our website. By using the website, you agree to the terms described in this policy.
          </p>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              1. Information We Collect
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              TechDeal only collects information necessary to run the website. Specifically:
            </p>
            <ul class="list-disc pl-5 text-xs text-zinc-650 dark:text-zinc-400 space-y-2">
              <li>
                <strong>Account Information:</strong> When you register an account, we collect your display name, email address, and encrypted password.
              </li>
              <li>
                <strong>Comments:</strong> When you leave a comment, we store the comment text, display name, email address, and IP address for moderation purposes.
              </li>
              <li>
                <strong>Usage Data:</strong> We automatically log technical details such as your IP address, browser type, device details, pages viewed, access times, and referrer sources through analytical tools.
              </li>
              <li>
                <strong>Contact Information:</strong> When you submit a contact form, we collect your name, email, and the message content.
              </li>
            </ul>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              2. How We Use Your Information
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              We use the collected information for the following purposes:
            </p>
            <ul class="list-disc pl-5 text-xs text-zinc-650 dark:text-zinc-400 space-y-2">
              <li>To operate and improve our website, including personalizing your experience.</li>
              <li>To authenticate your identity and manage member accounts.</li>
              <li>To moderate comments and prevent spam.</li>
              <li>To analyze traffic to enhance content quality.</li>
              <li>To respond to user support and contact requests.</li>
              <li>To display relevant ads via our advertising partners.</li>
            </ul>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              3. Cookies and Tracking Technologies
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              The website uses cookies — small text files stored on your device — to maintain login sessions and remember your preferences. You can disable cookies in your browser settings, but some features of the website may not function correctly.
            </p>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              In addition to TechDeal's own cookies, our third-party advertising partners may also place cookies on your device during ad serving.
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              4. Advertising — Third-Party Ad Networks
            </h2>
            <div
              class="bg-blue-50/50 dark:bg-zinc-900/50 p-5 rounded-xl border-l-4 border-[#3498db] space-y-3"
            >
              <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
                TechDeal partners with third-party advertising networks, including but not limited to <strong>Google AdSense</strong> and <strong>MGID</strong>, to show ads on the site. These partners use cookies to serve ads based on your browsing history on this and other sites. These cookies do not collect personally identifiable information such as name, email, or phone number.
              </p>
              <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
                You can opt-out of personalized ads by visiting:
              </p>
              <ul class="list-disc pl-5 text-xs text-zinc-650 dark:text-zinc-400 space-y-1">
                <li>
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-[#3498db] hover:underline font-semibold"
                    >Google Ad Settings</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.aboutads.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-[#3498db] hover:underline font-semibold"
                    >www.aboutads.info</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              5. Information Security
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              We implement appropriate security measures to protect your personal data from unauthorized access, alteration, or destruction. However, please note that no data transmission over the Internet is 100% secure.
            </p>
          </section>

          <section class="space-y-3 border-t border-gray-250 dark:border-zinc-800 pt-6">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">Contact</h2>
            <p class="text-xs text-zinc-650 dark:text-zinc-400">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul class="text-xs text-zinc-650 dark:text-zinc-400 space-y-1">
              <li>
                <strong>Email:</strong>
                <a
                  href="mailto:contact@techdeal.io.vn"
                  class="text-[#3498db] dark:text-[#e74c3c] hover:underline font-semibold"
                >
                  contact@techdeal.io.vn
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
