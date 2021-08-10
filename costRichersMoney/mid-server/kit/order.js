const { orders } = require('../model/order')

function searchOrder(pageIndex, pageSize, keyword) {
  let _all = orders.filter(
    (item) => item.richer.nickname.includes(keyword) && item.status !== -1,
  )
  return [
    pageSize == 0 || pageIndex == 0
      ? _all
      : _all.slice((pageIndex - 1) * pageSize, pageIndex * pageSize),
    _all.length,
  ]
}

function hasOne(id) {
  return orders.findIndex((item) => item.id === id && item.status !== -1) >= 0
}

module.exports = {
  searchOrder,
  hasOne,
}
