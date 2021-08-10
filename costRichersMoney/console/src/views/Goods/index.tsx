import style from './style.less'
import * as React from "react";
import { Button, Input, Table, Modal, Space, Form, Upload, Switch, Avatar, Tag, message } from 'antd';
import { UploadOutlined, PlusOutlined, RightCircleFilled, ThunderboltFilled } from '@ant-design/icons';
import common from './style.less';
import { addGoods, searchGoods, upGoods, downGoods, setGoods, uploadFile, deleteGoods, setWeightGoods } from '../../services/api'
import { ColumnsType } from 'antd/es/table';
import { getImgUrl, formatTime } from '../../util/util';

interface goodItem {
  id: string
  title: string
  price: number
  cover: string
  status: number
  limit: number
  weight: number
}

interface State {
  search: string,
  data: [],
  deleteModalVisible: boolean,
  editModalVisible: boolean,
  addModalVisible: boolean,
  weightModalVisible: boolean, //权重
  currentItem: goodItem, // 当前操作的商品
  cover: string,
  visible: boolean,
  visible_delete: boolean,
  limitSwitch: boolean,
  limit: 1,
  uploadImg: boolean,
}

export default class Goods extends React.Component<any>{
  state: State = {
    search: "",
    data: [],
    deleteModalVisible: false,
    editModalVisible: false,
    addModalVisible: false,
    weightModalVisible: false, //权重
    currentItem: {
      id: '',
      title: '',
      price: 0,
      cover: '',
      status: 0,
      limit: 0,
      weight: 0
    }, // 当前操作的商品
    cover: undefined,
    visible: false,
    visible_delete: false,
    limitSwitch: true,
    limit: 1,
    uploadImg: false, //判断有没有触发上传图片的事件，如果有，则获取上传的avatar 否则直接调用原来的，，，，主要在编辑中使用

  }
  //表头名称
  columns: ColumnsType = [
    {
      title: '商品名称',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      width: 115,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 80,
      align: 'center',
      // order: 'ascend',
    },
    {
      title: '图片',
      dataIndex: 'cover',
      key: 'cover',
      width: 100,
      align: 'center',
      render: (src = '') => {
        if (src !== '') return (<img src={getImgUrl(src)} alt="img" className={style.cover} />)
        else return <Avatar icon={< PlusOutlined />} />
      }
    },
    {
      title: '购买上限',
      dataIndex: 'limit',
      key: 'limit',
      width: 100,
      align: 'center',
      render: (value) => {
        if (value === 0) return "无"
        else return value;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      key: 'ctime',
      width: 130,
      align: 'center',
      render: (value) => formatTime(value)
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      width: 100,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      //上下架状态
      render: (value) => {
        return (value === 1 ? <Tag color="blue">上架中</Tag> : <Tag color="pink">下架中</Tag>)
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      //操作按钮设置
      render: (record) => (
        <Space size='middle'>
          <Button size='small' type='primary' onClick={() => {
            let price = record.price / 100;
            this.setState({
              currentItem: { ...record, price },
              limitSwitch: record.limit > 0,
              editModalVisible: true
            });
          }}>编辑</Button>
          <Button size='small' type='primary' onClick={() => {
            this.setState({ currentItem: record })
            this.handleStatus(record);
          }}> {record.status === 1 ? "下架" : "上架"}</Button>
          <Button size='small' type='primary' onClick={() => this.setState({ currentItem: record, deleteModalVisible: true })}>删除</Button>
          <Button size='small' type='primary' onClick={() => this.setState({ currentItem: record, weightModalVisible: true })}>设置权重</Button>
        </Space>
      )
    }
  ];

  async loadGoods(keyword = '') {
    let res = await searchGoods({ pageIndex: 1, pageSize: 0, keyword });
    if (res.stat === 'ok') {
      let data = res.data.items.filter(function (item) {
        return item.status > 0;
      });
      this.setState({
        data
      })
    } else {
      message.error('数据加载失败，请重新登录！');
    }
  }

  componentDidMount() {
    this.loadGoods()
  }
  //添加商品
  handleAdd = () => {
    this.setState({
      deleteModalVisible: false,
      addModalVisible: true,
    })
  }
  addGoods = async (value) => {
    value.cover = this.state.cover;
    let { title, price, cover } = value
    let limit: number;
    if (!this.state.limitSwitch) limit = 0;
    else limit = value.limit;
    let res = await addGoods({ title, price, limit, cover })
    if (res.stat === 'ok') {
      // 请求成功
      this.loadGoods()
      this.handleCancel();
    } else {
      message.error('添加失败！');
    }
  }
  // 上传图片
  customRequest = info => {
    const curFile = info.file;
    if (curFile.type.startsWith('image')) {
      let res = uploadFile(curFile)
        .then((result) => {
          this.setState({
            cover: result.data.file,
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
  

  //点击取消按钮触发的事件
  handleCancel_edit; handleCancel_add; handleCancel_delete = (e) => {
    this.setState({
      visible_delete: false,
    })
  }
  //点击OK按钮触发的事件
  handleOk_add; handleOk; handleOk_edit; handleOk_delete = (e) => {
    this.setState({
      visible_delete: false,
    })
  }

  async setGoods(good: { id, title, price, cover, limit }) {
    let res = await setGoods(good);
    if (res.stat === 'ok') {
      this.loadGoods();
    } else {
      message.error('请重试！');
    }
  }
  //点击编辑按钮触发的事件
  handleEdit = (value) => {
    let { title, price } = value;
    let cover: string, limit = 0;
    if (this.state.uploadImg) {
      cover = this.state.cover;
    } else {
      cover = this.state.currentItem.cover;
    }
    if (this.state.limitSwitch === true) limit = value.limit;
    this.setGoods({
      id: this.state.currentItem.id,
      title,
      price,
      cover,
      limit
    })
    this.handleCancel()
  }
  //点击上下架按钮触发的事件
  handleStatus = async (good) => {
    if (good.status === 1) {
      // 上架状态需要下架
      let res = await downGoods(good.id);
      if (res.stat === 'ok') {
        this.loadGoods();
      }
    } else {
      let res = await upGoods(good.id);
      if (res.stat === 'ok') {
        this.loadGoods();
      }
    }
    let res = await status
    // this.setState({
    //   deleteModalVisible: false
    // });
  }


  deleteGoods = async (id) => {
    let res = await deleteGoods(id);
    if (res.stat === 'ok') {
      this.loadGoods();
    } else {
      message.error('请重试！');
    }
  }
  //点击删除按钮触发的事件
  handleDelete = () => {
    this.deleteGoods(this.state.currentItem.id)
    this.handleCancel()
  }
  //点击设置权重确认按钮触发的事件
  handleEditWeight = async (values) => {
    let weight = parseInt(values.weight);
    let id = this.state.currentItem.id;
    if (weight === 0 || weight === this.state.currentItem.weight) {
      return;
    }
    let res: any = await setWeightGoods({ id, weight });
    if (res.stat === 'ok') {
      this.loadGoods();
      this.handleCancel();
    } else {
      console.error(res.msg)
    }
  };
  //
  handleCancel = () => {
    this.setState({
      deleteModalVisible: false,
      editModalVisible: false,
      addModalVisible: false,
      weightModalVisible: false,
      uploadImg: false,
      limitSwitch: true,
    })
  }

  //搜索
  onSearch = value => {
    this.loadGoods(value);
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
    this.loadGoods();
  }

  render() {
    return (
      <React.Fragment>
        <div className={common.top}
          style={{ paddingTop: 10 }}>
          <Button type='primary' onClick={this.handleAdd}>添加</Button>
          <div>
            <Input.Search placeholder='搜索' onSearch={this.onSearch} className={style.search}  
            allowClear value={this.state.search} onChange={this.onChange}
              style={{ width: 320, marginLeft: 20 }}
            ></Input.Search>
            <Button type='default' onClick={this.onReset}>重置</Button>
          </div>
        </div>
        <div className={common.main}>
          {/* 表格展示 */}
          <Table
            className={common.table}
            pagination={{ hideOnSinglePage: true }}
            columns={this.columns}
            dataSource={this.state.data}
            rowKey="id"
          ></Table>
        </div>
        {/* 添加商品设置 */}
        <Modal
          className="style.modal"
          title="添加商品"
          visible={this.state.addModalVisible}
          footer={null}
          closable={true}
          maskClosable={false}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
          destroyOnClose
        >
          <Form onFinish={this.addGoods}>
            {/* 使两个Form.item在同一行 */}
            <Form.Item label="商品名称" required>
              {/* 商品名 */}
              <Form.Item
                style={{ display: 'inline-flex', width: 'calc(45% - 4px)' }}
                name="title"
                rules={[{ required: true, message: '请输入商品名' }]}
              >
                <Input />
              </Form.Item>
              {/* 商品价格 */}
              <Form.Item
                style={{ display: 'inline-flex', width: 'calc(55% - 4px)', marginLeft: '8px' }}
                name="price"
                label="价格"
                rules={[{ required: true, message: '请输入正确的价格', pattern: new RegExp("^(0|[1-9][0-9]*)+(.[0-9]{1,3})?$") }]}
              >
                <Input type="number"/>
              </Form.Item>
              {/* 商品限购判断 */}
            </Form.Item>
            <Form.Item label="是否限购" required>
              <Form.Item
                style={{ display: 'inline-flex', width: 'calc(45% - 4px)' }}
                name="numbercap"
                rules={[{ required: false }]}
                valuePropName="checked"
              >
                {/* Switch开关控制是否限购 */}
                <Switch defaultChecked onChange={(checked) => {
                  this.setState({ limitSwitch: checked });
                }} />
              </Form.Item>
              {/* 商品数量 */}
              {this.state.limitSwitch && <Form.Item
                style={{ display: 'inline-flex', width: 'calc(55% - 4px)', marginLeft: '8px' }}
                name="limit"
                label="限购数量"
                initialValue={1}
                rules={[{ required: true, message: '请输入正确的限购数量', pattern: new RegExp("^(0|[1-9][0-9]*)$") }]}
              >
                <Input type="number" defaultValue={"1"}/>
              </Form.Item>}
            </Form.Item>
            {/* 图片上传 */}
            <Form.Item name='cover' label='图片' rules={[{ required: true, message: '请上传图片' }]}>
              <Upload listType="picture-card" customRequest={this.customRequest}><PlusOutlined /></Upload>
            </Form.Item>
            {/* 保存提交按钮 */}
            <Form.Item noStyle={true}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
                <Button type="dashed" onClick={this.handleCancel}>
                  取消
                </Button>
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
        {/* 编辑商品的设置 */}
        <Modal
          title="编辑商品"
          visible={this.state.editModalVisible}
          closable={true}
          maskClosable={false}
          footer={null}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          <Form onFinish={this.handleEdit} initialValues={this.state.currentItem}>
            {/* 使两个Form.item在同一行 */}
            <Form.Item label="商品名称" required>
              {/* 商品名 */}
              <Form.Item
                style={{ display: 'inline-flex', width: 'calc(45% - 4px)' }}
                name="title"
                rules={[{ required: true, message: '请输入商品名' }]}
              >
                <Input />
              </Form.Item>
              {/* 商品价格 */}
              <Form.Item
                style={{ display: 'inline-flex', width: 'calc(55% - 4px)', marginLeft: '8px' }}
                name="price"
                label="价格"
                rules={[{ required: true, message: '请输入正确的价格', pattern: new RegExp("^(0|[1-9][0-9]*)+(.[0-9]{1,3})?$") }]}
              >
                <Input type="number"/>
              </Form.Item>
              {/* 商品限购判断 */}
            </Form.Item>
            <Form.Item label="是否限购" required>
              <Form.Item
                style={{ display: 'inline-flex', width: 'calc(45% - 4px)' }}
                name="numbercap"
                rules={[{ required: false }]}
                valuePropName="checked"
              >
                {/* Switch开关控制是否限购 */}
                <Switch defaultChecked={this.state.currentItem.limit>0} onChange={(checked) => {
                  this.setState({ limitSwitch: checked });
                }} />
              </Form.Item>
              {/* 商品数量 */}
              {this.state.limitSwitch && <Form.Item
                style={{ display: 'inline-flex', width: 'calc(55% - 4px)', marginLeft: '8px' }}
                name="limit"
                label="限购数量"
                initialValue={1}
                rules={[{ required: true, message: '请输入正确的限购数量', pattern: new RegExp("^(0|[1-9][0-9]*)$") }]}
              >
                <Input type="number" defaultValue={10} />
              </Form.Item>}
            </Form.Item>
            {/* 图片上传 */}
            <Form.Item name='cover' label='图片'>
              <Upload listType="picture-card" customRequest={this.customRequest} defaultFileList={[{ uid: '', name: '', url: getImgUrl(this.state.currentItem.cover) }]}>
                <PlusOutlined />
              </Upload>
            </Form.Item>
            {/* 保存提交按钮 */}
            <Form.Item noStyle={true}>
              <Form.Item>
                <Button type="primary" htmlType="submit">确定</Button>
                <Button type="dashed" onClick={this.handleCancel}>取消</Button>
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
        {/* 删除部分设置 */}
        <Modal
          className="style.delete"
          title='删除商品'
          visible={this.state.deleteModalVisible}
          onOk={this.handleDelete}
          onCancel={this.handleCancel}
          closable={false}
          okText="确认"
          cancelText="取消"
        >
          <p>确定删除该商品吗？</p>
        </Modal>

        {/* 设置权重部分 */}
        <Modal
          title="设置权重"
          visible={this.state.weightModalVisible}
          onOk={this.handleEditWeight}
          onCancel={this.handleCancel}
          closable={false}
          //确认取消按钮
          okText="确认"
          cancelText="取消"
          okButtonProps={{ htmlType: 'submit', form: 'setWeightForm' }}
        >
          <Form id="setWeightForm" onFinish={this.handleEditWeight}>
            <Form.Item
              name="weight"
              label="权重"
              rules={[{ required: true, message: '请设置正确的权重', pattern: new RegExp("^(0|[1-9][0-9]*)$") }]}
            >
              <Input type="number" />
            </Form.Item>
          </Form>
        </Modal>
      </React.Fragment>
    )
  }
}

