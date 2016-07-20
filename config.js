module.exports = {
  github: {
    apiKey: process.env.GITHUB_API_KEY,
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET
  },
  "port": process.env.PORT || 3000,
};