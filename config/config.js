module.exports = {
  "github": {
    "apiKey": process.env.GITHUB_AUTH_TOKEN,
    "destination": process.env.GITHUB_DESTINATION_REPO,
    "username": process.env.GITHUB_USERNAME,
    "password": process.env.GITHUB_PASSWORD,
    "email": process.env.GITHUB_EMAIL,
    "name": process.env.GITHUB_NAME,
    "filePath": process.env.DESTINATION_DIRECTORY
    "secret": process.env.GITHUB_WEBHOOK_SECRET
  },
  "port": process.env.PORT || 3000
};
