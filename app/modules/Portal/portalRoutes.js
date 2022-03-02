/**
 * @description - Load All Routes for Pharmacy Module
 */
const glob = require("glob");

module.exports = function (app, express) {
  glob(__dirname + "/**/*.schema.js", {}, (err, files) => {
    files.map((file) => {
      // console.log("Schema", file);
      require(file);
    });
  });
  glob(__dirname + "/**/*.routes.js", {}, (err, files) => {
    files.map((file) => {
      require(file)(app, express);
    });
  });
};
