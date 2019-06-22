import React from 'react';
import { Table, Spin, Card, Popconfirm } from 'antd';
import { getPlans, deletePlan, completePlan } from '@/services/plan';
import moment from 'moment';
// import ReactMarkdown from 'react-markdown';
import AddModal from './AddModal';
import { convertStrToUrl, isUrl } from '../../utils/utils';

import styles from './Plan.less';

class Plan extends React.Component {
  pointEditRef = React.createRef();

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '10%',
      render: (val, record) => {
        const color = record.status === 3 ? '#BCAAA4' : '';
        return <div style={{ color }}>{val}</div>;
      },
    },
    {
      title: '内容',
      dataIndex: 'name',
      width: '50%',
      render: (val, record) => {
        const color = record.status === 3 ? '#BCAAA4' : '#353535';
        const regex = /[0-9]\. /gi;
        const rawArr = val.split(regex);
        if (rawArr.length !== 1) {
          const arr = rawArr.map(str => {
            if (!str) return '';
            return (
              <div>
                {rawArr.indexOf(str)}. {isUrl(str) ? convertStrToUrl(str) : str}
              </div>
            );
          });
          return <div style={{ color }}>{arr}</div>;
        }
        return <div style={{ color }}>{isUrl(val) ? convertStrToUrl(val) : val}</div>;
        // <ReactMarkdown source={val} linkTarget="_blank" />
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      width: '15%',
      render: (val, record) => {
        if (!val) return '';
        const { year, monthValue, dayOfMonth, hour, minute, second } = val;
        const color = record.status === 3 ? '#BCAAA4' : '';
        const dateVal = moment(
          `${year}-${monthValue}-${dayOfMonth} ${hour}:${minute}:${second}`
        ).format(`YYYY-MM-DD HH:mm:ss`);
        return <div style={{ color }}>{dateVal}</div>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '10%',
      render: (val, record) => {
        let result = '';
        switch (val) {
          case 0:
            result = '新建';
            break;
          case 1:
            result = '进行中';
            break;
          case 2:
            result = '阻塞';
            break;
          case 3:
          default:
            result = '完成';
            break;
        }
        const color = record.status === 3 ? '#BCAAA4' : '';
        return <div style={{ color }}>{result}</div>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      render: (text, record) => (
        <>
          {record.status === 3 ? (
            undefined
          ) : (
            <Popconfirm
              title="确认已完成吗？"
              okText="是"
              cancelText="否"
              onConfirm={() => this.completePlan(record)}
            >
              <a>完成</a>
            </Popconfirm>
          )}
          {record.status === 3 ? undefined : <span> | </span>}
          <Popconfirm
            title="确认删除吗？"
            okText="是"
            cancelText="否"
            onConfirm={() => this.deleteEntity(record)}
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
    // {
    //   title: '优先级',
    //   dataIndex: 'priority',
    //   render: val => {
    //     switch (val) {
    //       case 0:
    //         return <Tag color="#f50">Urgent</Tag>;
    //       case 2:
    //         return <Tag color="#87d068">Normal</Tag>;
    //       case 1:
    //       default:
    //         return <Tag color="#2db7f5">High</Tag>;
    //     }
    //   },
    // },
  ];

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

  refreshList = pageParam => {
    const { pagination } = this.state;
    this.setState({ loading: true });
    getPlans({
      ...pagination,
      current: pageParam ? pagination.current - 1 : 0,
    })
      .then(resp => {
        pagination.total = resp.body.totalElements;
        this.setState({
          listData: resp.body.content,
          loading: false,
          pagination: {
            ...pagination,
            current: pageParam ? pagination.current : 1,
          },
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

  completePlan = param => {
    completePlan(param.id).then(() => this.refreshList());
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
            className={styles.fixedWidthTable}
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
