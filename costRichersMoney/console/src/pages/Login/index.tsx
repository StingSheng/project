import * as React from 'react'
import { Form, Input, Button, Checkbox,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import style from './style.less'
import { RouteComponentProps } from "react-router-dom";

import {authLogin} from '../../services/api'
import { observer } from 'mobx-react'
import store from '../../store/store'

@observer
export default class NormalLoginForm extends React.Component<RouteComponentProps> {
  onFinish = async (values) => {
    console.log('Received values of form: ', values);
    let res = await authLogin(values)
    console.log(res)
    if (res.stat === 'ok') {
      store.setAuth(res.data.info.nickname)
      this.props.history.push("/Richers");
    }else {
      message.error('用户不存在');
    }
  };

  render() {
    return (
      <Form
        name="normal_login"
        className={style["login-form"]}
        initialValues={{ remember: true }}
        onFinish={this.onFinish.bind(this)}
      >
        <h2>花光他们的钱后台</h2>
        <Form.Item
          name="account"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined className={style["site-form-item-icon"]} />} placeholder="admin" />
        </Form.Item>
        <Form.Item
          name="pwd"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className={style["site-form-item-icon"]} />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item valuePropName="checked" noStyle>
            <Checkbox>记住密码</Checkbox>
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={style["login-form-button"]}>
            登录
          </Button>
        </Form.Item>
      </Form>
    )
  }
};
