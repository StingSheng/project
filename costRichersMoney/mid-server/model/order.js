const { read, write } = require('../lib/read&write')

const __Order = []
const ORDERURL = '../data/order.json'
function setOrder(order) {
  __Order.push(order)
  write(__Order, ORDERURL)
}

function editOrder(order) {
  __Order.splice(
    __Order.findIndex((item) => item.id == order.id),
    1,
    order,
  )
  write(__Order, ORDERURL)
}

function deleteOrder(id) {
  let order = getOrder(id)
  __Order.splice(
    __Order.findIndex((item) => item.id == order.id),
    1,
    { ...order, status: -1 },
  )
  write(__Order, ORDERURL)
}

function getAllOrder() {
  let data = read(ORDERURL)
  __Order.push(...data)
}

function getOrder(id) {
  return __Order.find((item) => item.id === id)
}

module.exports = {
  orders: __Order,
  getAllOrder,
  setOrder,
  editOrder,
  deleteOrder,
  getOrder,
}
