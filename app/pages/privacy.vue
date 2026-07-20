<script setup lang="ts">
import Footer from '@features/blog/components/Footer.vue'
import Header from '@features/blog/components/Header.vue'

useSeoMeta({
  title: 'Chính sách Bảo mật',
  description:
    'Chính sách bảo mật của TechDeal, mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.',
  ogTitle: 'Chính sách Bảo mật',
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
        <h1
          class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-4"
        >
          Chính sách Bảo mật
        </h1>
        <p class="text-zinc-550 text-sm italic">Cập nhật lần cuối: 20 tháng 7, 2026</p>
        <p class="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
          Chính sách Bảo mật này mô tả cách TechDeal (<strong>techdeal.io.vn</strong>) thu thập, sử
          dụng và bảo vệ thông tin của bạn khi bạn truy cập trang web. Bằng cách sử dụng trang web,
          bạn đồng ý với các điều khoản được mô tả trong chính sách này.
        </p>

        <!-- 1 -->
        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            1. Thông tin chúng tôi thu thập
          </h2>
          <p class="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
            TechDeal chỉ thu thập thông tin cần thiết để vận hành trang web. Cụ thể:
          </p>
          <ul class="list-disc pl-5 text-sm text-zinc-650 dark:text-zinc-400 space-y-2">
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

        <!-- 2 -->
        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            2. Cách chúng tôi sử dụng thông tin
          </h2>
          <p class="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
            Thông tin thu thập được sử dụng cho các mục đích sau:
          </p>
          <ul class="list-disc pl-5 text-sm text-zinc-650 dark:text-zinc-400 space-y-2">
            <li>Vận hành và cải thiện trang web, bao gồm cá nhân hóa trải nghiệm người dùng.</li>
            <li>Xác thực danh tính và quản lý tài khoản thành viên.</li>
            <li>Kiểm duyệt bình luận và ngăn chặn spam.</li>
            <li>Phân tích lưu lượng truy cập để nâng cao chất lượng nội dung.</li>
            <li>Phản hồi các yêu cầu hỗ trợ và liên hệ từ người dùng.</li>
            <li>Hiển thị quảng cáo phù hợp thông qua các đối tác quảng cáo của chúng tôi.</li>
          </ul>
        </section>

        <!-- 3 -->
        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            3. Cookies và Công nghệ theo dõi
          </h2>
          <p class="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
            Trang web sử dụng cookies — các tệp văn bản nhỏ được lưu trên thiết bị của bạn — để duy
            trì phiên đăng nhập và ghi nhớ tùy chọn của bạn. Bạn có thể tắt cookies trong cài đặt
            trình duyệt, tuy nhiên một số tính năng của trang web có thể không hoạt động đúng.
          </p>
          <p class="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
            Ngoài cookies của TechDeal, các đối tác quảng cáo bên thứ ba của chúng tôi cũng có thể
            đặt cookies trên thiết bị của bạn trong quá trình phân phối quảng cáo.
          </p>
        </section>

        <!-- 4 -->
        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            4. Quảng cáo — Đối tác quảng cáo bên thứ ba
          </h2>
          <div
            class="bg-blue-50 dark:bg-zinc-900/50 p-5 rounded-xl border-l-4 border-[#3498db] space-y-3"
          >
            <p class="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
              TechDeal hợp tác với các mạng quảng cáo bên thứ ba, bao gồm nhưng không giới hạn ở
              <strong>Google AdSense</strong> và <strong>MGID</strong>, để hiển thị quảng cáo trên
              trang web. Các đối tác này, với tư cách là nhà cung cấp quảng cáo bên thứ ba, sử dụng
              cookies để phân phối quảng cáo dựa trên lịch sử duyệt web của bạn trên trang này và
              các trang khác. Các cookies này không thu thập thông tin nhận dạng cá nhân như tên,
              email hay số điện thoại.
            </p>
            <p class="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
              Bạn có thể từ chối quảng cáo cá nhân hóa bằng cách truy cập:
            </p>
            <ul class="list-disc pl-5 text-sm text-zinc-650 dark:text-zinc-400 space-y-1">
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

        <!-- 5 -->
        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            5. Chia sẻ thông tin với bên thứ ba
          </h2>
          <p class="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
            TechDeal <strong>không bán, trao đổi hoặc cho thuê</strong> thông tin cá nhân của bạn
            cho bên thứ ba. Thông tin chỉ có thể được chia sẻ trong các trường hợp sau:
          </p>
          <ul class="list-disc pl-5 text-sm text-zinc-650 dark:text-zinc-400 space-y-2">
            <li>
              <strong>Nhà cung cấp dịch vụ:</strong> Các đối tác vận hành hạ tầng kỹ thuật (hosting,
              phân tích, quảng cáo) có thể tiếp cận dữ liệu ở mức độ cần thiết để cung cấp dịch vụ,
              và bị ràng buộc bởi nghĩa vụ bảo mật.
            </li>
            <li>
              <strong>Yêu cầu pháp lý:</strong> Chúng tôi có thể tiết lộ thông tin khi được yêu cầu
              bởi cơ quan có thẩm quyền hoặc theo quy định pháp luật hiện hành.
            </li>
          </ul>
        </section>

        <!-- 6 -->
        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">6. Bảo mật dữ liệu</h2>
          <p class="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
            Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn ngành bao gồm mã hóa HTTPS/SSL cho
            toàn bộ kết nối, mã hóa mật khẩu và kiểm soát quyền truy cập nội bộ. Tuy nhiên, không có
            hệ thống nào đảm bảo an toàn tuyệt đối 100% trên Internet.
          </p>
        </section>

        <!-- 7 -->
        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">7. Quyền của bạn</h2>
          <p class="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">Bạn có quyền:</p>
          <ul class="list-disc pl-5 text-sm text-zinc-650 dark:text-zinc-400 space-y-2">
            <li>Yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân của bạn.</li>
            <li>Rút lại sự đồng ý thu thập dữ liệu bất kỳ lúc nào.</li>
            <li>Phản đối việc xử lý dữ liệu cho mục đích quảng cáo.</li>
            <li>Yêu cầu chúng tôi hạn chế xử lý thông tin của bạn.</li>
          </ul>
          <p class="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
            Để thực hiện các quyền này, vui lòng liên hệ qua email bên dưới.
          </p>
        </section>

        <!-- 8 -->
        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            8. Liên kết đến trang web bên thứ ba
          </h2>
          <p class="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
            Các bài viết trên TechDeal có thể chứa liên kết đến trang web bên ngoài (App Store,
            Google Play, Steam, v.v.). TechDeal không chịu trách nhiệm về chính sách bảo mật hoặc
            nội dung của các trang web đó. Chúng tôi khuyến khích bạn đọc chính sách bảo mật của
            từng trang khi truy cập.
          </p>
        </section>

        <!-- 9 -->
        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">9. Trẻ em</h2>
          <p class="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
            TechDeal không nhắm đến đối tượng dưới 13 tuổi và không cố ý thu thập thông tin cá nhân
            từ trẻ em. Nếu bạn tin rằng con bạn đã cung cấp thông tin cho chúng tôi, vui lòng liên
            hệ để chúng tôi xóa thông tin đó.
          </p>
        </section>

        <!-- 10 -->
        <section class="space-y-3">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
            10. Thay đổi Chính sách Bảo mật
          </h2>
          <p class="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
            Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi sẽ được đăng tải
            trên trang này kèm ngày cập nhật mới nhất. Việc tiếp tục sử dụng trang web sau khi thay
            đổi được đăng tải đồng nghĩa với việc bạn chấp nhận chính sách mới.
          </p>
        </section>

        <!-- Contact -->
        <section class="space-y-3 border-t border-gray-250 dark:border-zinc-800 pt-6">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-white">Liên hệ</h2>
          <p class="text-sm text-zinc-650 dark:text-zinc-400">
            Nếu bạn có bất kỳ câu hỏi nào về Chính sách Bảo mật này, vui lòng liên hệ:
          </p>
          <ul class="text-sm text-zinc-650 dark:text-zinc-400 space-y-1">
            <li>
              <strong>Email:</strong>
              <a
                href="mailto:contact@techdeal.io.vn"
                class="text-[#3498db] dark:text-[#e74c3c] hover:underline font-semibold"
                >contact@techdeal.io.vn</a
              >
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
