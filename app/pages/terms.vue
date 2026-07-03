<script setup lang="ts">
import Footer from '@features/blog/components/Footer.vue'
import Header from '@features/blog/components/Header.vue'

useSeoMeta({
  title: 'Điều khoản Dịch vụ',
  description:
    'Điều khoản và điều kiện sử dụng TechDeal, trang tin tức công nghệ, game và khuyến mãi thiết bị điện tử.',
  ogTitle: 'Điều khoản Dịch vụ',
  ogType: 'website',
  ogUrl: 'https://techdeal.io.vn/terms',
  robots: 'index, follow'
})

useHead({
  link: [{ rel: 'canonical', href: 'https://techdeal.io.vn/terms' }]
})
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300 font-sans"
  >
    <Header />

    <main class="container mx-auto px-4 py-12 max-w-3xl">
      <div
        class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-855 p-6 md:p-10 shadow-xs space-y-6"
      >
        <h1
          class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-4"
        >
          Điều khoản Dịch vụ
        </h1>
        <p class="text-zinc-550 text-xs italic">Cập nhật lần cuối: 31 tháng 5, 2026</p>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">1. Đồng ý với Điều khoản</h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Chào mừng bạn đến với TechDeal (sau đây gọi là "chúng tôi", "TechDeal"). Bằng việc truy
            cập hoặc sử dụng trang web của chúng tôi, bạn đồng ý tuân thủ và chịu sự ràng buộc bởi
            các Điều khoản Dịch vụ này. Nếu bạn không đồng ý với các điều khoản này, vui lòng không
            sử dụng trang web của chúng tôi.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            2. Nội dung & Sở hữu trí tuệ
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            TechDeal là một blog cá nhân và nền tảng tin tức chia sẻ thông tin, đánh giá và hướng
            dẫn về công nghệ, thiết bị điện tử tiêu dùng và trò chơi điện tử (game). Tất cả nội dung
            trên trang web này, bao gồm bài viết, hình ảnh và logo, thuộc sở hữu của TechDeal hoặc
            các nhà sáng tạo nội dung của trang và được bảo vệ bởi luật bản quyền. Bạn không được
            sao chép, tái bản hoặc phân phối nội dung của chúng tôi mà không có sự cho phép trước
            bằng văn bản của chúng tôi.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            3. Hành vi Người dùng & Bình luận
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Nếu bạn tạo tài khoản hoặc tham gia thảo luận bằng cách để lại bình luận:
          </p>
          <ul class="list-disc pl-5 text-xs text-zinc-650 dark:text-zinc-400 space-y-1">
            <li>Bạn đồng ý cung cấp thông tin trung thực, chính xác và đầy đủ.</li>
            <li>Bạn có trách nhiệm bảo mật thông tin đăng nhập của mình.</li>
            <li>
              Bạn không được đăng tải các nội dung lăng mạ, xúc phạm, spam hoặc trái pháp luật trong
              khu vực bình luận.
            </li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            4. Liên kết đến nền tảng bên thứ ba (Third-Party Links)
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Các bài viết và ưu đãi trên TechDeal có thể chứa đường dẫn trực tiếp đến các ứng dụng,
            cửa hàng hoặc trang web của bên thứ ba (như Google Play, App Store, Steam, Epic Games
            Store...). Các liên kết này được cung cấp thuần túy nhằm mục đích mang lại sự thuận tiện
            và thông tin ưu đãi minh bạch cho người dùng.
            <strong
              >TechDeal không thực hiện tiếp thị liên kết (affiliate marketing) và không nhận bất kỳ
              khoản hoa hồng hay lợi ích tài chính nào</strong
            >
            từ các truy cập hoặc giao dịch của bạn trên các nền tảng này.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            5. Tuyên bố từ chối trách nhiệm
          </h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Tất cả thông tin trên TechDeal được cung cấp theo nguyên tắc "nguyên trạng" và "sẵn có"
            chỉ nhằm mục đích thông tin và giải trí. Mặc dù chúng tôi cố gắng trình bày các hướng
            dẫn và ưu đãi công nghệ chính xác, chúng tôi không cam kết hoặc bảo đảm dưới bất kỳ hình
            thức nào về tính chính xác, đầy đủ hoặc độ tin cậy của nội dung trên trang web.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">6. Thay đổi Điều khoản</h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Chúng tôi có quyền sửa đổi các điều khoản này bất kỳ lúc nào. Mọi thay đổi sẽ được đăng
            trên trang này với ngày cập nhật mới nhất. Việc bạn tiếp tục sử dụng trang web sau khi
            các thay đổi được đăng tải đồng nghĩa với việc bạn chấp nhận các Điều khoản Dịch vụ mới.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">7. Luật áp dụng</h2>
          <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
            Các Điều khoản Dịch vụ này được điều chỉnh và giải thích theo pháp luật Việt Nam. Mọi
            tranh chấp phát sinh liên quan đến việc sử dụng trang web sẽ được giải quyết tại tòa án
            có thẩm quyền tại Hà Nội, Việt Nam.
          </p>
        </section>

        <section class="space-y-3 border-t border-gray-250 dark:border-zinc-800 pt-6">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">Liên hệ</h2>
          <p class="text-xs text-zinc-650 dark:text-zinc-400">
            Nếu bạn có câu hỏi về Điều khoản Dịch vụ này, vui lòng liên hệ:
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
            <li><strong>Điện thoại:</strong> +84 (0) 822 344 589</li>
            <li><strong>Địa chỉ:</strong> Hà Nội, Việt Nam</li>
          </ul>
        </section>
      </div>
    </main>

    <Footer />
  </div>
</template>
