module.exports = {
  development: {
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/find_english'
  },
  staging: {
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/find_english'
  },
  production: {
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/find_english'
  }
};
