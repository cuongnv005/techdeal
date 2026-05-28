module.exports = {
  apps: [
    {
      name: 'nuxt-base',
      port: process.env.APP_PORT,
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        port: process.env.APP_PORT
      }
    }
  ]
}
