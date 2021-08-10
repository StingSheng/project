import * as request from './request'

// body {pageIndex, pageSize:0, keyword}
export async function searchGoods(body) {
  try {
    return await request.post(JSON.stringify(body),'/api/web/goods/search');
  } catch (e) {
    return e
  }
}

export async function getGoods(id) {
  try {
    return await request.post(JSON.stringify({id}),'/api/web/goods/get');
  } catch (e) {
    return e
  }
}

// body {pageIndex, pageSize:0, keyword}
export async function searchRich(body) {
  try {
    return await request.post(JSON.stringify(body),'/api/web/rich/search');
  } catch (e) {
    return e
  }
  
}

export async function getRich(id) {
  try {
    return await request.post(JSON.stringify({id}),'/api/web/rich/get');
  } catch (e) {
    return e
  }
  
}

// { richId：string, goodsIds：[ {id，count} ] }
export async function commitOrder(body) {
  try {
    return await request.post(JSON.stringify(body),'/api/web/order/commit');
  } catch (e) {
    return e
  }
  
}