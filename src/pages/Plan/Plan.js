import React from 'react';
import { Table, Spin, Card, Popconfirm, Rate } from 'antd';
import { getPlans, deletePlan, completePlan } from '@/services/plan';
// import ReactMarkdown from 'react-markdown';
import PlanModal from './PlanModal';
import { convertStrToUrl, isUrl } from '../../utils/utils';

import styles from './Plan.less';

const COMPLETE = 4;

class Plan extends React.Component {
  state = {
    isCreate: true,
    listData: [],
    loading: false,
    modalVisible: false,
    pagination: {
      current: 1,
      pageSize: 10,
    },
  };

  pointEditRef = React.createRef();

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      render: (val, record) => {
        const color = record.status === COMPLETE ? '#BCAAA4' : '';
        return <div style={{ color }}>{val}</div>;
      },
    },
    {
      title: '内容',
      dataIndex: 'name',
      width: '50%',
      render: (val, record) => {
        const color = record.status === COMPLETE ? '#BCAAA4' : '#000';
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
      width: '10%',
      render: (val, record) => {
        if (!val) return '';
        const color = record.status === COMPLETE ? '#BCAAA4' : '';
        const dateVal = `${String(val[0]).padStart(4, '0')}-${String(val[1]).padStart(
          2,
          '0'
        )}-${String(val[2]).padStart(2, '0')}`;
        return <div style={{ color }}>{dateVal}</div>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: '10%',
      render: val => {
        switch (val) {
          case 1:
            return (
              <Rate
                disabled
                count={3}
                defaultValue={3}
                style={{ color: '#1890FF', fontSize: 15 }}
              />
            );
          case 3:
            return (
              <Rate
                disabled
                count={1}
                defaultValue={1}
                style={{ color: '#1890FF', fontSize: 15 }}
              />
            );
          case 2:
          default:
            return (
              <Rate
                disabled
                count={2}
                defaultValue={2}
                style={{ color: '#1890FF', fontSize: 15 }}
              />
            );
        }
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '10%',
      render: (val, record) => {
        let result = '';
        switch (val) {
          case 1:
          default:
            result = '新建';
            break;
          case 2:
            result = '进行中';
            break;
          case 3:
            result = '阻塞';
            break;
          case 4:
            result = '完成';
            break;
        }
        const color = record.status === COMPLETE ? '#BCAAA4' : '';
        return <div style={{ color }}>{result}</div>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      render: (text, record) => (
        <>
          {/* record.status === COMPLETE ? (
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
          {record.status === COMPLETE ? undefined : <span> | </span> */}
          <a onClick={() => this.updateEntity(record)}>修改</a>
          <span> | </span>
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
  ];

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
        if (resp) {
          pagination.total = resp.data.totalElements;
          this.setState({
            listData: resp.data.content,
            loading: false,
            pagination: {
              ...pagination,
              current: pageParam ? pagination.current : 1,
            },
          });
        }
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

  updateEntity = record => {
    this.setState({
      modalVisible: true,
      isCreate: false,
      record,
    });
  };

  createEntity = () => {
    this.setState({
      modalVisible: true,
      isCreate: true,
    });
  };

  completePlan = param => {
    completePlan(param.id).then(() => this.refreshList());
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
    const { listData, loading, modalVisible, pagination, isCreate, record } = this.state;

    const dataWithKey = listData.map(data => ({ ...data, key: data.id }));

    return (
      <Card
        title="小目标"
        extra={<a onClick={this.createEntity}>新增</a>}
        style={{ background: 'rgba(255, 255, 255, 0.9)' }}
      >
        <Spin spinning={loading}>
          <Table
            columns={this.columns}
            className={styles.fixedWidthTable}
            dataSource={dataWithKey}
            pagination={pagination}
            onChange={this.handleTableChange}
          />
        </Spin>
        <PlanModal
          visible={modalVisible}
          onClose={this.handleCloseModal}
          isCreate={isCreate}
          record={record}
        />
      </Card>
    );
  }
}

export default Plan;
