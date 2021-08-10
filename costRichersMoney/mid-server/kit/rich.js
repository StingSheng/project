const { richers } = require('../model/rich')

function searchRich(pageIndex, pageSize, keyword) {
  let _all = richers.filter(
    (item) => item.nickname.includes(keyword) && item.status !== -1,
  )
  return [
    pageIndex == 0 || pageSize == 0
      ? _all
      : _all.slice((pageIndex - 1) * pageSize, pageIndex * pageSize),
    _all.length,
  ]
}

function hasOne(id) {
  return richers.findIndex((item) => item.id === id && item.status !== -1) >= 0
}

module.exports = {
  hasOne,
  searchRich,
}
