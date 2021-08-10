const { read, write } = require('../lib/read&write')

const __Goods = []
const GOODSURL = '../data/goods.json'
function setGoods(goods) {
  __Goods.push(goods)
  write(__Goods, GOODSURL)
}

function editGoods(goods) {
  __Goods.splice(
    __Goods.findIndex((item) => item.id == goods.id),
    1,
    goods,
  )
  write(__Goods, GOODSURL)
}

function deleteGoods(id) {
  let goods = getGoods(id)
  __Goods.splice(
    __Goods.findIndex((item) => item.id == goods.id),
    1,
    { ...goods, status: -1 },
  )
  write(__Goods, GOODSURL)
}

function getAllGoods() {
  let data = read(GOODSURL)
  __Goods.push(...data)
}

function getGoods(id) {
  return __Goods.find((item) => item.id === id)
}

module.exports = {
  goodss: __Goods,
  getAllGoods,
  setGoods,
  editGoods,
  deleteGoods,
  getGoods,
}
