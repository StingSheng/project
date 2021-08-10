import { makeAutoObservable, action, observable } from 'mobx'
import { IRich, OrderItem } from './type'

class UserStore {
  @observable rich: IRich;
  order: OrderItem[];
  count: number = 0;

  setRich(rich: IRich) {
    this.rich = rich;
    // this.order.richId = rich.richId
  }

  setWorth(num: number) {
    this.rich.worth = num;
  }

  setOrder(order) {
    this.order = order;
    // this.order.push()
    // this.order.goodsIds = name
  }

  setCount(count) {
    this.count += count; 
  }

  cleanStore() {
    this.order = [];
  }

  constructor() {
    makeAutoObservable(this)
  }

  @action getDataFromSessionStorage = () => {
    sessionStorage.getItem("rich") ?
    this.rich = JSON.parse(sessionStorage.getItem("rich")) : "";
  };

  @action setDataFromSessionStorage = () => {
    sessionStorage.setItem("rich", JSON.stringify(this.rich));
    console.log(this.rich)
  };
}

export default new UserStore()