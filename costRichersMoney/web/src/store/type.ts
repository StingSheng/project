export interface IRich  {
  id: string
  nickname: string
  worth: number
  avatar:string
  // avatar: URL
  // status: number
}

export interface OrderItem {
  id:string,
  count:number,
  title:string,
  price:number
}
export interface Order {
  goodsIds: OrderItem[]
}