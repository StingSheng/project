import * as React from "react"
import { Button, Input, Table, Modal, Space, Avatar, Form, Upload, message } from 'antd';
import { UserOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
// ant-design 单个组件分别引入对应的样式文件
import style from './style.less';
import { addRich, uploadFile, searchRich, deleteRich, setRich } from '../../services/api'
import { getImgUrl, setImgUrl } from "../../util/util";

interface IcurrentRich {
  nickname: string,
  id: string,
  worth: number,
  avatar: string
}

interface State {
  search: string,
  data: [],
  deleteModalVisible: boolean,
  editModalVisible: boolean,
  addModalVisible: boolean,
  currentItem: IcurrentRich,
  avatar: string,
  visible: boolean,
  visible_delete: boolean,
  uploadImg: boolean,
}
export default class Richers extends React.Component {
  state: State = {
    search: '',
    data: [],
    deleteModalVisible: false,
    editModalVisible: false,
    addModalVisible: false,
    currentItem: { nickname: '', id: '', worth: 0, avatar: '' },
    avatar: undefined,
    visible: false,
    visible_delete: false,
    uploadImg: false, //判断有没有触发上传图片的事件，如果有，则获取上传的avatar 否则直接调用原来的，主要在编辑中使用
  }

  columns = [
    {
      title: '头像', dataIndex: 'avatar', key: 'avatar',
      render: (src = '') => {
        if (src !== '') return (<Avatar src={src} />)
        else return <Avatar icon={<UserOutlined />} />
      }
    },
    { title: '富豪名称', dataIndex: 'nickname', key: 'nickname' },
    { title: '身价', dataIndex: 'worth', key: 'worth' },
    {
      title: '操作', key: 'action',
      render: (text, record) => (
        <Space size='middle'>
          <Button size='small' type='primary'
            onClick={() => {
              let worth = record.worth / 100;
              this.setState({ currentItem: { ...record, worth }, editModalVisible: true })
            }}> 编辑</Button>
          <Button size='small' type='dashed'
            onClick={() => this.setState({ currentItem: record, deleteModalVisible: true })}>删除</Button>
        </Space>
      )
    }
  ];

  async loadRich(keyword='') {
    let res = await searchRich({ pageIndex: 1, pageSize: 0, keyword});
    if (res.stat === 'ok') {
      let data = res.data.items.filter(function (item) {
        return item.status === 0;
      });
      data.map((item, index) => {
        item.avatar = getImgUrl(item.avatar);
      })
      this.setState({ data: res.data.items })
    }else {
      message.error('数据加载失败，请重新登录！');
    }
  }

  componentDidMount() {
    this.loadRich();
  }

  //搜索
  onSearch = value => {
    this.loadRich(value);
  }
  onChange = e => {
    this.setState({
      search: e.target.value
    })
  }
  //重置
  onReset = () => {
    this.setState({
      search: ''
    })
    this.loadRich();
  }

  //添加
  handleAdd = (e) => {
    this.setState({
      deleteModalVisible: false,
      addModalVisible: true,
    })
  }
  // 上传图片
  customRequest = info => {
    const curFile = info.file;
    if (curFile.type.startsWith('image')) {
      let res = uploadFile(curFile)
        .then((result) => {
          this.setState({
            avatar: result.data.file,
            uploadImg: true
          })
          info.onSuccess(res, curFile);
        })
        .catch((e) => {
          console.error(e)
        });
    } else {
      // 提示输入：请上传图片
      message.error('请重新上传图片！');
    }
  }

  // 添加富豪
  addRich = async (value) => {
    value.avatar = this.state.avatar;
    let { nickname, worth, avatar } = value
    let res = await addRich({ nickname, worth, avatar })
    if (res.stat === 'ok') {
      // 请求成功
      this.loadRich();
      this.handleCancel();
    }
    else{
      message.error('请求失败，请重新添加！')
    }
  }

  // 编辑富豪
  async setRich({ id, nickname, worth, avatar }) {
    let res = await setRich({ id, nickname, worth, avatar });
    if (res.stat === 'ok') {
      this.loadRich();
    }
  }

  //编辑
  handleEdit = (value) => {
    let { nickname, worth } = value;
    let avatar: string;
    if (this.state.uploadImg) {
      avatar = this.state.avatar;
    } else {
      avatar = setImgUrl(this.state.currentItem.avatar);
    }
    this.setRich({
      id: this.state.currentItem.id,
      nickname,
      worth,
      avatar
    })
    this.handleCancel()
  }

  // 删除
  async deleteRich(id: string) {
    let res = await deleteRich(id);
    if (res.stat === 'ok') {
      this.loadRich();
    }
  }

  //取消按钮的点击事件
  handleCancel = () => {
    this.setState({
      deleteModalVisible: false,
      editModalVisible: false,
      addModalVisible: false,
      uploadImg: false,
      avatar:'',
    })
  }

  //点击对话框ok触发的事件
  handleOk = () => {
    this.deleteRich(this.state.currentItem.id)
    this.setState({
      deleteModalVisible: false,
      editModalVisible: false,
      addModalVisible: false,
    })
  }

  //删除按钮触发的事件
  handleDelete = (e) => {
    this.setState({
      deleteModalVisible: true,
      visible_delete: false,
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className={style.top}>
          <Button type='primary' onClick={this.handleAdd}>添加富豪</Button>
          <div className={style.toptool}>
            <Input.Search placeholder='搜索' onSearch={this.onSearch} className={style.search}></Input.Search>
            <Button type='default' onClick={this.onReset}>重置</Button>
          </div>
        </div>
        <div className='main'>
          <Table
            className='table'
            pagination={{ hideOnSinglePage: true }}
            columns={this.columns}
            dataSource={this.state.data}
            rowKey={record => record.id}
          ></Table>
        </div>

        {/* 添加富豪模块 */}
        <Modal className={style.modal} title='添加富豪' visible={this.state.addModalVisible} closable={false} footer={null} destroyOnClose>
          <Form onFinish={this.addRich.bind(this)}>
            <Form.Item name='nickname' label='富豪名称' rules={[{ required: true,message:'姓名不能为空！' }]} >
              <Input />
            </Form.Item>
            <Form.Item name='worth' label='身价  ' rules={[{ required: true,pattern: new RegExp("^(0|[1-9][0-9]*)+(.[0-9]{1,3})?$"),message:'请输入正确的富豪身价！'}]} >
              <Input type="number" />
            </Form.Item>
            <Form.Item name='avatar' label='头像' rules={[{ required: true,message:'请上传图片！' }]} valuePropName="">
              <Upload listType="picture-card" customRequest={this.customRequest}>
                <PlusOutlined />
              </Upload>
            </Form.Item>
            <Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit'>确定</Button>
                <Button type='dashed' onClick={this.handleCancel}>取消</Button>
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>

        {/* 编辑富豪模块 */}
        <Modal className={style.modal} title='编辑富豪' visible={this.state.editModalVisible} closable={false} footer={null} destroyOnClose>
          <Form onFinish={this.handleEdit} initialValues={this.state.currentItem}>
            <Form.Item name='nickname' label='富豪名称' rules={[{ required: true, message: '名字不能为空！' }]} >
              <Input />
            </Form.Item>
            <Form.Item name='worth' label='身价  ' rules={[{ required: true,pattern: new RegExp("^(0|[1-9][0-9]*)+(.[0-9]{1,3})?$"),message:'请输入正确的富豪身价！'}]} >
              <Input type="number" />
            </Form.Item>
            <Form.Item name='avatar' label='头像' rules={[{ required: false }]} >
              <Upload listType="picture-card" customRequest={this.customRequest} defaultFileList={[{uid:'',name:'',url: this.state.currentItem.avatar}]}>
                <PlusOutlined />
              </Upload>
            </Form.Item>
            <Form.Item name="">
              <Button type='primary' htmlType='submit'>确定</Button>
              <Button type='dashed' onClick={this.handleCancel}>取消</Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* 删除富豪模块 */}
        <Modal
          className={style.delete}
          title='删除富豪'
          visible={this.state.deleteModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
          closable={false}
        ><p>确定删除该富豪？</p>
        </Modal>
      </React.Fragment>
    )
  }
}
