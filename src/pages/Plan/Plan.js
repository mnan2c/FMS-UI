import React from 'react';
import { Table, Spin, Card, Popconfirm, Tag } from 'antd';
import { getPlans, deletePlan } from '@/services/plan';
import AddModal from './AddModal';

class Plan extends React.Component {
  pointEditRef = React.createRef();

  columns = [
    {
      title: '内容',
      dataIndex: 'name',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      render: val => {
        switch (val) {
          case 0:
            return <Tag color="#f50">Urgent</Tag>;
          case 2:
            return <Tag color="#87d068">Normal</Tag>;
          case 1:
          default:
            return <Tag color="#2db7f5">High</Tag>;
        }
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => {
        switch (val) {
          case 0:
            return '新建';
          case 1:
            return '进行中';
          case 2:
            return '阻塞';
          case 3:
          default:
            return '完成';
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Popconfirm
          title="确认删除吗？"
          okText="是"
          cancelText="否"
          onConfirm={() => this.deleteEntity(record)}
        >
          <a>删除</a>
        </Popconfirm>
      ),
    },
  ];

  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  state = {
    listData: [],
    loading: false,
    modalVisible: false,
    pagination: {
      current: 1,
      pageSize: 10,
    },
  };

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    const { pagination } = this.state;
    this.setState({ loading: true });
    getPlans({
      ...pagination,
      current: pagination.current - 1,
    })
      .then(resp => {
        pagination.total = resp.data.totalElements;
        this.setState({
          listData: resp.data.content,
          loading: false,
          pagination,
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  handleCloseModal = refresh => {
    this.setState({ modalVisible: false });
    if (refresh) {
      this.refreshList();
    }
  };

  deleteEntity = param => {
    deletePlan(param.id).then(() => this.refreshList());
  };

  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleTableChange = pageParam => {
    const pager = { ...this.state.pagination };
    pager.current = pageParam.current;
    this.setState(
      {
        pagination: pager,
      },
      () => {
        const { pagination } = this.state;
        this.refreshList(pagination);
      }
    );
  };

  render() {
    const { listData, loading, modalVisible, pagination } = this.state;

    return (
      <Card title="PRIORITY ORIENTED" extra={<a onClick={this.showModal}>新增</a>}>
        <Spin spinning={loading}>
          <Table
            columns={this.columns}
            dataSource={listData}
            pagination={pagination}
            onChange={this.handleTableChange}
          />
        </Spin>
        <AddModal visible={modalVisible} onClose={this.handleCloseModal} />
      </Card>
    );
  }
}

export default Plan;
