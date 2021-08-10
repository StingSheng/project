const { Stat } = require('../config/stat')
const { getAllRicher } = require('../model/rich')
const { getAllGoods } = require('../model/goods')
const { getAllOrder } = require('../model/order')
const Exception = require('./exception')
const { read, write } = require('./read&write')
const fs = require('fs')
const path = require('path')

function init() {
  // 配置异常
  Exception.updates(Stat)
  // 配置数据
  getAllRicher()
  getAllGoods()
  getAllOrder()
  const dir = path.join(__dirname, '../static')
  if (fs.existsSync(dir) === false) fs.mkdirSync(dir)
  const imageDir = path.join(__dirname, '../static/images')
  if (fs.existsSync(imageDir) === false) fs.mkdirSync(imageDir)
}

module.exports = {
  init,
  read,
  write,
}
