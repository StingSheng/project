const baseURL = "http://localhost:3000"

export function getImgUrl(url: string) : string {
  return baseURL + url;
}

// 获得服务器的地址形式
export function setImgUrl(url: string) : string {
  return url.toString().replace(baseURL, '');
}

// 时间格式化
export function formatTime(time: number):string {
  let date:Date = new Date(time);
  let _month = ( 10 > (date.getMonth()+1) ) ? + (date.getMonth()+1) : date.getMonth()+1;
  let _day = ( 10 > date.getDate() ) ? + date.getDate() : date.getDate();
  return date.getFullYear() + '年' + _month + '月' + _day + '日' ;
}