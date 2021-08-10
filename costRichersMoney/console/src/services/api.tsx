import {requestJson, requestFile} from './request'

// *********************管理用户
// body Account,pwd
export async function authLogin(body) {
  try {
    return await requestJson(JSON.stringify(body),'/api/console/auth/login');
  } catch(e) {
    return e;
  }
  
}

// 如果成功会返回昵称
export async function getUserInfo() {
  try {
    return await requestJson('','/api/console/auth/getUserInfo');
  } catch(e) {
    return e;
  }
}

export async function authLogout() {
  try {
    return await requestJson('','/api/console/auth/logout');
  } catch(e) {
    return e;
  }
}

// 上传图片的时候一定要注意对文件type进行判断
// 上传图片
export async function uploadFile(file) {
  let formData = new FormData();
  formData.append('filename', file);
  try {
    let uploadRes = await requestFile(formData,'/api/console/form/upload_v2');
    return uploadRes;
  } catch (e) {
    return e
  }
}

// *********************商品
// body {pageIndex, pageSize:0, keyword}
export async function searchGoods(body) {
  try {
    return await requestJson(JSON.stringify(body),'/api/console/goods/search');
  } catch (e) {
    return e
  }
}

//添加商品body { title, price, coverFile, limit }  此处
export async function addGoods(body) {
  try {
    return await requestJson(JSON.stringify(body),'/api/console/goods/add');
  } catch (e) {
    return e
  }
  
}

// 修改 body { id, title, price, coverFile, limit }
export async function setGoods(body) {
  try {
    return await requestJson(JSON.stringify(body),'/api/console/goods/set');
  } catch (e) {
    return e
  }
  
}

// 设置权重  body { id, weight }
export async function setWeightGoods(body) {
  try {
    return await requestJson(JSON.stringify(body),'/api/console/goods/setweight');
  } catch (e) {
    return e
  }
  
}

// 上架 
export async function upGoods(id) {
  try {
    return await requestJson(JSON.stringify({id}),'/api/console/goods/up');
  } catch (e) {
    return e
  }
  
}

// 下架 
export async function downGoods(id) {
  try {
    return await requestJson(JSON.stringify({id}),'/api/console/goods/down');
  } catch (e) {
    return e
  }
  
}

// 删除商品
export async function deleteGoods(id) {
  try {
    return await requestJson(JSON.stringify({id}),'/api/console/goods/delete');
  } catch (e) {
    return e
  }
}

// *********************富豪
// body {pageIndex, pageSize:0, keyword}
export async function searchRich(body) {
  try {
    return await requestJson(JSON.stringify(body),'/api/console/rich/search');
  } catch (e) {
    return e
  }
}

// { nickname, worth, avatarFile }
export async function addRich(body) {
  try {
    return await requestJson(JSON.stringify(body),'/api/console/rich/add');
  } catch (e) {
    return e
  }
  
}

// body { id, nickname, worth, avatarFile }
export async function setRich(body) {
  try {
    return await requestJson(JSON.stringify(body),'/api/console/rich/set');
  } catch (e) {
    return e
  }
}

// 传入id值即可
export async function deleteRich(id) {
  try {
    return await requestJson(JSON.stringify({id}),'/api/console/rich/delete');
  } catch (e) {
    return e
  }
}

// *********************订单
// body {pageIndex, pageSize:0, keyword}
export async function searchOrder(body) {
  try {
    return await requestJson(JSON.stringify(body),'/api/console/order/search');
  } catch (e) {
    return e
  }
}

// 得到订单
export async function getOrder(id) {
  try {
    return await requestJson(JSON.stringify({id}),'/api/console/order/get');
  } catch (e) {
    return e
  }
}