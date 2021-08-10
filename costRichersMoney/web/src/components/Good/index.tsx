import { observer } from 'mobx-react'
import store from '../../store/store'
import * as React from 'react'
import style from "./style.less"
import { toThousands, getImgUrl } from '../../util/util'
// import data from "../../assets/goods.js"

// let comodities = data
// let goods = comodities.filter(item => item.status === true)
let order = [];

interface Props {
	good,
	changeMoney
}
@observer
export default class Good extends React.Component<Props>{
	state = {
		price: this.props.good.price,
		title: this.props.good.title,
		id: this.props.good.id,
		count: 0
	}

	componentDidMount() {
		order = [];
	}

	// 按购买按钮增加购买数量（不会超过购买限制）
	increase() {
		if (this.props.good.limit != 0) {
			if (this.state.count < this.props.good.limit) {
				if (store.rich.worth > this.state.price) {
					store.setCount(1)
					this.setState({
						count: this.state.count + 1
					})
					this.props.changeMoney(this.state.price, -1);
					this.addItem(this.state.count + 1)
				}
				else {
					this.setState({
						count: this.state.count
					})
				}
			}
			else {
				this.setState({
					count: this.props.good.limit
				})
			}
		}
		else {
			if (store.rich.worth < this.state.price) {
				this.setState({
					count: this.state.count
				})
			} else {
				store.setCount(1)
				this.setState({
					count: this.state.count + 1
				})
				this.addItem(this.state.count + 1)
				this.props.changeMoney(this.state.price, -1);
			}
		}
		// this.addItem(this.props.good.limit != 0?(this.state.count < this.props.good.limit ? this.state.count + 1 : this.props.good.limit):this.state.count + 1)
	}

	// 按出售按钮减少购买数量（不会小于零）
	reduce() {
		if (this.state.count > 0) {
			store.setCount(-1)
			if (this.state.count > 1) {
				this.setState({
					count: this.state.count - 1
				})
			}
			else {
				this.setState({
					count: 0
				})
			}
			this.props.changeMoney(this.state.price, 1);
		}
		else {
			this.setState({
				count: 0
			})
		}
		this.addItem(this.state.count > 0 ? this.state.count - 1 : 0)
	}

	// 向订单数组中添加商品或者更新商品数量
	addItem(value) {
		let index = order.findIndex(item => item.title == this.state.title)
		if (index != -1) {
			order[index].count = value
		}
		else {
			let { id, title, price } = this.state;
			let item = { id, title, price, count: value }
			order.push(item)
		}
		let zeroIndex = order.findIndex(item => item.count == 0)
		if (zeroIndex != -1) {
			order.splice(zeroIndex, 1)
		}
		this.sortOrder(order)
		store.setOrder(order)
	}

	// 给订单数组进行排序（价格小的排在前面）
	sortOrder(order) {
		order.sort((a, b) => {
			if (a.price < b.price)
				return -1
			if (a.price > b.price)
				return 1
			return 0
		})
	}

	// 获取数字输入框中的数字
	// 获取数字输入框中的数字
	getNumber = (event) => {
		let value = Number(event.target.value)
		let number = this.state.count - value
		if (number < 0) {
			if (number * this.state.price + store.rich.worth > 0) {
				store.setCount(-number)
				this.setState({
					count: value
				})
				this.addItem(value)
				this.props.changeMoney(this.state.price, number);
			} else {
				store.setCount(Math.floor(store.rich.worth / this.state.price))
				this.setState({
					count: Math.floor(store.rich.worth / this.state.price) + number + value
				})
				this.addItem(Math.floor(store.rich.worth / this.state.price) + number + value)
				this.props.changeMoney(this.state.price, -(Math.floor(store.rich.worth / this.state.price)));
			}
		}
		else {
			if (value > 0) {
				store.setCount(-number)
				this.setState({
					count: value
				})
				this.addItem(value)
				this.props.changeMoney(this.state.price, number);
			} else {
				store.setCount(-this.state.count)
				this.setState({
					count: 0
				})
				this.addItem(0)
				this.props.changeMoney(this.state.price, number + value);
			}
		}
	}

	render() {
		let { good } = this.props;
		return (
			<React.Fragment>
				<div className={style.good} id={"good"}>
					<div className={style.information}>
						<img src={getImgUrl(good.cover)} alt={"#"} className={style.img} />
						<p className={style.name}>{good.title}</p>
						<p className={style.price}>{"$" + toThousands(good.price)}</p>
					</div>
					<div className={style.operation}>
						<button className={this.state.count <= 0 ? style.sold : style.sell} onClick={this.reduce.bind(this)}>{"出售"}</button>
						<input className={style.number} min={0} max={good.limit} type="number" value={this.state.count} onChange={(e) => this.getNumber(e)} />
						<button className={this.props.good.price > store.rich.worth ? style.bought : (this.props.good.limit == 0 ? style.buy : (this.state.count >= good.limit ? style.bought : style.buy))} onClick={this.increase.bind(this)}>{"购买"}</button>
					</div>
				</div>
			</React.Fragment>
		)
	}
}