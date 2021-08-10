//将数字格式化
export function toThousands(num:number) {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}
//购物车金额格式化
export function moneyFormat(num:number) {
  let money = ''
  let length = num.toString().length
  if(length > 9){
    money = (num/1e10).toFixed(1) + "b"
  }else if(length > 6){
    money = (num/1e6).toFixed(1) + "m"
  }else if(length > 3){
    money = (num/1e3).toFixed(1) + "k"
  }else{
    money = num.toString()
  }
  return money
}

// 获得服务器图片数据
const baseURL = "http://localhost:3000"

export function getImgUrl(url: string) : string {
  return baseURL + url;
}