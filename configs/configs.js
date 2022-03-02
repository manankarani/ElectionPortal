require("dotenv").config();

module.exports = {
  mongodb: {
    //Database Configuration
    port: process.env.DB_PORT || 27017,
    dbName: process.env.DB_NAME,
    url:
      process.env.DB_URL || "mongodb://localhost:27017/" + process.env.DB_NAME,
    host: process.env.PROD_HOST,
    user: process.env.DB_USER,
    mongoOptions: {},
  },
  serverPort: process.env.PORT,
  portal: {
    baseApiUrl: "/v2",
    token: {
      privateKey: "LŌcĀtĒ",
      expiry: "30d",
    },
  },
};
