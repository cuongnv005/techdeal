import { defineEventHandler, setHeader } from 'h3'

// Universal Links (iOS) — Phase 9 (deep link mở/cài TechDeal app từ trang /go).
// File này KHÔNG có phần mở rộng nên cần server route ép Content-Type, Nitro static
// serving mặc định có thể trả sai content-type cho file không đuôi.
//
// TODO: thay REPLACE_WITH_REAL_APPLE_TEAM_ID bằng Apple Developer Team ID thật
// (lấy trong Apple Developer > Membership, hoặc `eas credentials` với dự án techdeal_app).
const APPLE_TEAM_ID = 'ZJRE43TQH6'
const IOS_BUNDLE_ID = 'io.techdeal.app'

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/json')

  return {
    applinks: {
      apps: [],
      details: [
        {
          appID: `${APPLE_TEAM_ID}.${IOS_BUNDLE_ID}`,
          paths: ['/go/*', '/giveaway']
        }
      ]
    }
  }
})
