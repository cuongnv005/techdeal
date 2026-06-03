<script setup lang="ts">
import Header from '@features/blog/components/Header.vue'
import Footer from '@features/blog/components/Footer.vue'

useSeoMeta({
  title: 'Chính sách Bảo mật',
  description:
    'Chính sách bảo mật của TechDeal, mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.',
  ogTitle: 'Chính sách Bảo mật',
  ogType: 'website'
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
        <h1
          class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-4"
        >
          Chính sách Bảo mật
        </h1>
        <p class="text-zinc-550 text-xs italic">Cập nhật lần cuối: 31 tháng 5, 2026</p>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            1. Thông tin chúng tôi thu thập
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Chúng tôi coi trọng quyền riêng tư của bạn. TechDeal chỉ thu thập lượng thông tin cá
            nhân tối thiểu khi bạn tương tác với trang web của chúng tôi:
          </p>
          <ul class="list-disc pl-5 text-xs text-zinc-650 dark:text-zinc-400 space-y-1">
            <li>
              <strong>Bình luận và Tài khoản:</strong> Khi bạn đăng ký thành viên hoặc để lại bình
              luận trên trang, chúng tôi thu thập tên đăng nhập, địa chỉ email và địa chỉ IP của
              bạn.
            </li>
            <li>
              <strong>Dữ liệu sử dụng:</strong> Chúng tôi tự động ghi nhận các chỉ số sử dụng tiêu
              chuẩn (lượt xem, nguồn truy cập, loại thiết bị) thông qua các công cụ phân tích cơ bản
              để cải thiện chất lượng nội dung.
            </li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            2. Cookies và Công nghệ theo dõi
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Chúng tôi sử dụng cookies để duy trì trạng thái đăng nhập của bạn và cá nhân hóa trải
            nghiệm người dùng. Các đối tác bên thứ ba của chúng tôi, như Google AdSense, cũng có thể
            đặt và đọc cookies trên trình duyệt của bạn hoặc sử dụng web beacons để thu thập thông
            tin trong quá trình phân phối quảng cáo trên trang web của chúng tôi.
          </p>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Bạn có thể chọn tắt hoặc tắt chọn lọc cookies của chúng tôi hoặc cookies của bên thứ ba
            trong phần cài đặt trình duyệt của mình.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            3. Cách chúng tôi sử dụng thông tin của bạn
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Thông tin chúng tôi thu thập được sử dụng để:
          </p>
          <ul class="list-disc pl-5 text-xs text-zinc-650 dark:text-zinc-400 space-y-1">
            <li>Quản lý và xác thực tài khoản người dùng cùng khu vực bình luận.</li>
            <li>Theo dõi và phân tích lưu lượng truy cập để cải thiện nội dung blog.</li>
            <li>Hiển thị quảng cáo và các ưu đãi liên kết phù hợp.</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">4. Bảo mật dữ liệu</h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Chúng tôi ưu tiên bảo mật dữ liệu của bạn và áp dụng các tiêu chuẩn phổ biến trong ngành
            (chẳng hạn như mã hóa SSL/HTTPS) để bảo vệ thông tin trong quá trình truyền tải. Tuy
            nhiên, xin lưu ý rằng không có phương thức truyền tải qua Internet nào là an toàn 100%.
          </p>
        </section>

        <section class="space-y-3 border-t border-gray-250 dark:border-zinc-800 pt-6">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">Liên hệ</h2>
          <p class="text-xs text-zinc-650 dark:text-zinc-400">
            Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào liên quan đến Chính sách Bảo mật này, vui
            lòng liên hệ với chúng tôi qua email:
            <a
              href="mailto:privacy@techdeal.com"
              class="text-[#3498db] dark:text-[#e74c3c] hover:underline font-semibold"
              >privacy@techdeal.com</a
            >.
          </p>
        </section>
      </div>
    </main>

    <Footer />
  </div>
</template>
