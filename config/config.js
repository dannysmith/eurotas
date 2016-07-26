module.exports = {
  "github": {
    "apiKey": process.env.GITHUB_API_KEY,
    "destination": process.env.GITHUB_DESTINATION_REPO
  },
  "port": process.env.PORT || 3000,
  "database": process.env.MONGOLAB_URI || process.env.DATABASE
};