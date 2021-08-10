import { makeAutoObservable } from 'mobx'
import {Auth} from './type'

class UserStore {
  name: string;

  setAuth(name: string) {
    this.name = name;
  } 

  constructor() {
    makeAutoObservable(this)
  }
}

export default new UserStore()