<script setup lang="ts">
import Footer from '@features/blog/components/Footer.vue'
import Header from '@features/blog/components/Header.vue'

const { locale } = useI18n()
const isEn = computed(() => locale.value === 'en')

useSeoMeta({
  title: () => (isEn.value ? 'Terms of Service' : 'Điều khoản Dịch vụ'),
  description: () =>
    isEn.value
      ? 'Terms and conditions for using TechDeal, a technology news and electronics deals website.'
      : 'Điều khoản và điều kiện sử dụng TechDeal, trang tin tức công nghệ, game và khuyến mãi thiết bị điện tử.',
  ogTitle: () => (isEn.value ? 'Terms of Service' : 'Điều khoản Dịch vụ'),
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
        <!-- Vietnamese Content -->
        <div v-if="locale !== 'en'" class="space-y-6">
          <h1
            class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-4"
          >
            Điều khoản Dịch vụ
          </h1>
          <p class="text-zinc-550 text-xs italic">Cập nhật lần cuối: 10 tháng 8, 2026</p>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              1. Đồng ý với Điều khoản
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              Chào mừng bạn đến với TechDeal (sau đây gọi là "chúng tôi", "TechDeal"). Bằng việc
              truy cập hoặc sử dụng trang web của chúng tôi, bạn đồng ý tuân thủ và chịu sự ràng
              buộc bởi các Điều khoản Dịch vụ này. Nếu bạn không đồng ý với các điều khoản này, vui
              lòng không sử dụng trang web của chúng tôi.
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              2. Nội dung & Sở hữu trí tuệ
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              TechDeal là một blog cá nhân và nền tảng tin tức chia sẻ thông tin, đánh giá và hướng
              dẫn về công nghệ, thiết bị điện tử tiêu dùng và trò chơi điện tử (game). Tất cả nội
              dung trên trang web này, bao gồm bài viết, hình ảnh và logo, thuộc sở hữu của TechDeal
              hoặc các nhà sáng tạo nội dung của trang và được bảo vệ bởi luật bản quyền. Bạn không
              được sao chép, tái bản hoặc phân phối nội dung của chúng tôi mà không có sự cho phép
              trước bằng văn bản của chúng tôi.
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
                Bạn không được đăng tải các nội dung lăng mạ, xúc phạm, spam hoặc trái pháp luật
                trong khu vực bình luận.
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
              Store...). Các liên kết này được cung cấp thuần túy nhằm mục đích mang lại sự thuận
              tiện và thông tin ưu đãi minh bạch cho người dùng.
              <strong
                >TechDeal không thực hiện tiếp thị liên kết (affiliate marketing) và không nhận bất
                kỳ khoản hoa hồng hay lợi ích tài chính nào</strong
              >
              từ các truy cập hoặc giao dịch của bạn trên các nền tảng này.
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              5. Tuyên bố từ chối trách nhiệm
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              Tất cả thông tin trên TechDeal được cung cấp theo nguyên tắc "nguyên trạng" và "sẵn
              có" chỉ nhằm mục đích thông tin và giải trí. Mặc dù chúng tôi cố gắng trình bày các
              hướng dẫn và ưu đãi công nghệ chính xác, chúng tôi không cam kết hoặc bảo đảm dưới bất
              kỳ hình thức nào về tính chính xác, đầy đủ hoặc độ tin cậy của nội dung trên trang
              web.
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">6. Thay đổi Điều khoản</h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              Chúng tôi có quyền sửa đổi các điều khoản này bất kỳ lúc nào. Mọi thay đổi sẽ được
              đăng trên trang này với ngày cập nhật mới nhất. Việc bạn tiếp tục sử dụng trang web
              sau khi các thay đổi được đăng tải đồng nghĩa với việc bạn chấp nhận các Điều khoản
              Dịch vụ mới.
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">7. Luật áp dụng</h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              Các Điều khoản Dịch vụ này được điều chỉnh và giải thích theo pháp luật Việt Nam. Mọi
              tranh chấp phát sinh liên quan đến việc sử dụng trang web sẽ được giải quyết tại tòa
              án có thẩm quyền tại Hà Nội, Việt Nam.
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              8. Gói Thành viên VIP (TechDeal VIP) &amp; Thanh toán trong ứng dụng
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              Ứng dụng di động TechDeal cung cấp gói thành viên trả phí "TechDeal VIP" giúp loại bỏ
              quảng cáo và mở khóa các ưu đãi dành riêng cho thành viên VIP. Gói VIP được bán và
              thanh toán trực tiếp qua Apple App Store hoặc Google Play, dưới các hình thức:
            </p>
            <ul class="list-disc pl-5 text-xs text-zinc-650 dark:text-zinc-400 space-y-2">
              <li>
                <strong>Gói đăng ký hàng tháng hoặc hàng năm:</strong> tự động gia hạn theo chu kỳ
                đã chọn với mức giá hiển thị tại thời điểm mua, cho đến khi bạn hủy.
              </li>
              <li>
                <strong>Gói trọn đời:</strong> thanh toán một lần duy nhất, không tự động gia hạn.
              </li>
            </ul>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              Đối với gói đăng ký: khoản thanh toán sẽ được trừ vào tài khoản Apple ID hoặc Google
              Play của bạn khi xác nhận mua, và tự động gia hạn trừ khi bạn tắt tự động gia hạn ít
              nhất 24 giờ trước khi kỳ hiện tại kết thúc. Bạn có thể xem, quản lý hoặc hủy gia hạn
              bất kỳ lúc nào trong mục Cài đặt tài khoản Apple ID (đối với iOS) hoặc mục Đăng ký
              trong Google Play (đối với Android). Khi hủy, quyền lợi VIP vẫn còn hiệu lực đến hết
              chu kỳ đã thanh toán.
            </p>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              Toàn bộ giao dịch thanh toán trong ứng dụng được xử lý bởi Apple hoặc Google và tuân
              theo chính sách thanh toán, hoàn tiền của các nền tảng này. TechDeal không trực tiếp
              xử lý hoặc lưu trữ thông tin thẻ thanh toán của bạn và không có quyền hoàn tiền trực
              tiếp — mọi yêu cầu hoàn tiền vui lòng liên hệ Apple Support hoặc Google Play Support.
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              7. Liên kết Tiếp thị Liên kết (Affiliate Links) & Quảng cáo Mua sắm
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              TechDeal tham gia vào các chương trình tiếp thị liên kết (Affiliate Marketing) với các
              sàn thương mại điện tử và đối tác uy tín như Shopee, Lazada, TikTok Shop, Tiki,
              AccessTrade... Một số bài viết, banner nổi hoặc liên kết khuyến mãi trên website có
              thể chứa mã tiếp thị liên kết.
            </p>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              Khi bạn nhấp vào các liên kết này và thực hiện mua hàng, TechDeal có thể nhận được một
              khoản hoa hồng giới thiệu nhỏ từ đối tác mà
              <strong>hoàn toàn không làm tăng thêm bất kỳ chi phí nào</strong> đối với bạn. Các sản
              phẩm, giá bán, chính sách giao hàng và bảo hành do chính sàn thương mại điện tử và bên
              bán chịu trách nhiệm.
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

        <!-- English Content -->
        <div v-else class="space-y-6">
          <h1
            class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-4"
          >
            Terms of Service
          </h1>
          <p class="text-zinc-550 text-xs italic">Last updated: August 10, 2026</p>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">1. Acceptance of Terms</h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              Welcome to TechDeal ("we", "TechDeal"). By accessing or using our website, you agree
              to comply with and be bound by these Terms of Service. If you do not agree with these
              terms, please do not use our website.
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              2. Content & Intellectual Property
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              TechDeal is a personal blog and news platform sharing information, reviews, and guides
              on technology, consumer electronics, and video games (gaming). All content on this
              website, including articles, images, and logos, is owned by TechDeal or its creators
              and protected by copyright laws. You may not copy, republish, or distribute our
              content without prior written permission.
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              3. User Behavior & Comments
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              If you create an account or participate in discussions by leaving comments:
            </p>
            <ul class="list-disc pl-5 text-xs text-zinc-650 dark:text-zinc-400 space-y-1">
              <li>You agree to provide true, accurate, and complete information.</li>
              <li>
                You are responsible for maintaining the confidentiality of your login credentials.
              </li>
              <li>
                You must not post abusive, offensive, spam, or unlawful content in the comments
                section.
              </li>
            </ul>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">4. Third-Party Links</h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              Articles and deals on TechDeal may contain direct links to third-party applications,
              stores, or websites (such as Google Play, App Store, Steam, Epic Games Store...).
              These links are provided solely for convenience and transparent offer details.
              <strong
                >TechDeal does not participate in affiliate marketing and does not receive any
                commissions or financial benefits</strong
              >
              from your accesses or transactions on these platforms.
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">5. Disclaimer</h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              All information on TechDeal is provided on an "as is" and "as available" basis for
              general informational and entertainment purposes only. While we strive to present
              accurate technology guides and deals, we make no representations or warranties of any
              kind about the accuracy, completeness, or reliability of the website content.
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">6. Changes to Terms</h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              We reserve the right to modify these terms at any time. Any changes will be posted on
              this page with the latest updated date. Your continued use of the website after
              changes are posted constitutes acceptance of the new Terms of Service.
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">7. Governing Law</h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              These Terms of Service are governed by and construed in accordance with the laws of
              Vietnam. Any disputes arising in connection with the use of the website shall be
              resolved by competent courts in Hanoi, Vietnam.
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              8. VIP Membership (TechDeal VIP) &amp; In-App Payments
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              The TechDeal mobile app offers a paid "TechDeal VIP" membership that removes ads and
              unlocks VIP-only deals. VIP membership is sold and paid for directly through the Apple
              App Store or Google Play, in the following forms:
            </p>
            <ul class="list-disc pl-5 text-xs text-zinc-650 dark:text-zinc-400 space-y-2">
              <li>
                <strong>Monthly or yearly subscription:</strong> automatically renews for the
                selected billing period at the price shown at the time of purchase, until cancelled.
              </li>
              <li>
                <strong>Lifetime plan:</strong> a single one-time payment that does not renew
                automatically.
              </li>
            </ul>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              For subscription plans: payment is charged to your Apple ID or Google Play account
              upon confirmation of purchase, and automatically renews unless you turn off
              auto-renewal at least 24 hours before the end of the current period. You can view,
              manage, or cancel auto-renewal at any time in your Apple ID Account Settings (iOS) or
              the Subscriptions section of Google Play (Android). If you cancel, VIP benefits remain
              active until the end of the period already paid for.
            </p>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              All in-app payment transactions are processed by Apple or Google and are subject to
              their respective billing and refund policies. TechDeal does not directly process or
              store your payment card information and cannot issue refunds directly — please contact
              Apple Support or Google Play Support for any refund requests.
            </p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">
              7. Affiliate Links & Shopping Advertisements
            </h2>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              TechDeal participates in affiliate marketing programs with reputable e-commerce
              platforms and networks including Shopee, Lazada, TikTok Shop, Tiki, AccessTrade, etc.
              Some articles, floating banners, or deal links across our website may contain
              affiliate tracking links.
            </p>
            <p class="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400">
              When you click on these links and make a purchase, TechDeal may earn a small referral
              commission at <strong>no additional cost to you</strong>. Product listings, prices,
              warranties, and delivery terms remain the sole responsibility of the respective
              third-party merchants.
            </p>
          </section>

          <section class="space-y-3 border-t border-gray-250 dark:border-zinc-800 pt-6">
            <h2 class="text-lg font-bold text-zinc-900 dark:text-white">Contact</h2>
            <p class="text-xs text-zinc-650 dark:text-zinc-400">
              If you have questions about these Terms of Service, please contact us:
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
              <li><strong>Phone:</strong> +84 (0) 822 344 589</li>
              <li><strong>Address:</strong> Hanoi, Vietnam</li>
            </ul>
          </section>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
