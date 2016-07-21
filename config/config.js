module.exports = {
  "github": {
    "apiKey": process.env.GITHUB_API_KEY,
    "username": process.env.GITHUB_USERNAME,
    "password": process.env.GITHUB_PASSWORD
  },
  "port": process.env.PORT || 3000,
  "database": "mongodb://localhost:27017/eurotas"
};