const { Sequelize } = require('sequelize')
const dbConfig = require('../config/db')
const { sqlLogger } = require('../config/logger')
// logger

const sequelize = new Sequelize(dbConfig.table, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: (msg) => {
    sqlLogger.debug(msg)
  }
})

module.exports = {
  sequelize
}