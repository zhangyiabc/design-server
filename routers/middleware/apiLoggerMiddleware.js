const log4js = require("log4js");
const { apiLogger } = require("../../config/logger");

module.exports = log4js.connectLogger(apiLogger, {
  level: "auto",
  format: (req, res, format) =>
    format(
      `ip[:remote-addr]  请求方法[:method]  请求地址[:url]   状态码[:status]  `
    ),
});
