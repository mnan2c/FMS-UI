import React from 'react';
import { Table, Spin, Card, Popconfirm, Rate, List, Button, Skeleton, Tabs } from 'antd';
import {
  getPlans,
  deletePlan,
  // completePlan
} from '@/services/plan';
// import ReactMarkdown from 'react-markdown';
// import reqwest from 'reqwest';
import PlanModal from './PlanModal';
import { convertStrToUrl, isUrl } from '../../utils/utils';
import styles from './Plan.less';

const { TabPane } = Tabs;

const COMPLETE = 4;
const PAGESIZE = 8;

class Plan extends React.Component {
  state = {
    isCreate: true,
    listData: [],
    loading: true,
    modalVisible: false,
    tabKey: '1',
    // 已完成
    hasMore: true,
    pagination: {
      current: 1,
      pageSize: PAGESIZE,
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
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      width: '10%',
      render: (val, record) => {
        if (!val) return '';
        const color = record.status === COMPLETE ? '#BCAAA4' : '';
        return <div style={{ color }}>{val.substr(0, 10)}</div>;
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
      title: '操作',
      key: 'action',
      width: '15%',
      render: (text, record) => (
        <>
          <a onClick={() => this.updateEntity(record)}>修改</a>
          <span> | </span>
          <Popconfirm
            title="确认删除吗？"
            okText="是"
            cancelText="否"
            onConfirm={() => this.deleteEntity(record, false)}
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  componentDidMount() {
    this.refreshList(false);
  }

  refreshList = (isComplete, pageParam) => {
    const { pagination, listData } = this.state;
    this.setState({ loading: true });
    getPlans({
      ...pagination,
      status: isComplete ? '4' : '1,2,3',
      current: pageParam ? pagination.current - 1 : 0,
    })
      .then(resp => {
        if (resp) {
          pagination.total = resp.data.totalElements;
          if (isComplete) {
            const newData = listData.concat(resp.data.content);
            this.setState(
              {
                hasMore: !!resp.data.content && resp.data.content.length === pagination.pageSize,
                listData: newData,
                loading: false,
                pagination: {
                  ...pagination,
                  current: pageParam ? pagination.current : 1,
                },
              },
              () => {
                // Resetting window's offsetTop so:to display react-virtualized demo underfloor.
                // In real scene, you can using public method of react-virtualized:
                // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
                window.dispatchEvent(new Event('resize'));
              }
            );
          } else {
            this.setState({
              listData: resp.data.content,
              loading: false,
              pagination: {
                ...pagination,
                current: pageParam ? pagination.current : 1,
              },
            });
          }
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  handleCloseModal = refresh => {
    this.setState({ modalVisible: false });
    if (refresh) {
      this.refreshList(false);
    }
  };

  deleteEntity = (param, isComplete) => {
    this.setState({
      listData: [],
    });
    deletePlan(param.id).then(() => this.refreshList(isComplete));
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

  handleTableChange = pageParam => {
    const { pagination } = this.state;
    const pager = { ...pagination };
    pager.current = pageParam.current;
    this.setState(
      {
        pagination: pager,
      },
      () => {
        this.refreshList(false, pagination);
      }
    );
  };

  onLoadMore = () => {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: {
          ...pagination,
          current: pagination.current + 1,
        },
      },
      () => {
        this.refreshList(true, pagination);
      }
    );
  };

  callback = key => {
    this.setState(
      {
        loading: true,
        tabKey: key,
        listData: [],
        pagination: {
          current: 1,
          pageSize: PAGESIZE,
        },
      },
      () => {
        if (key === '1') {
          this.refreshList(false);
        } else {
          this.refreshList(true);
        }
      }
    );
  };

  render() {
    const {
      listData,
      loading,
      modalVisible,
      pagination,
      isCreate,
      record,
      tabKey,
      hasMore,
    } = this.state;

    const dataWithKey = listData.map(data => ({ ...data, key: data.id }));

    const loadMore =
      hasMore && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={this.onLoadMore}>加载更多...</Button>
        </div>
      ) : null;
    const extraContent = tabKey === '1' ? <a onClick={this.createEntity}>新增</a> : undefined;

    return (
      <Card>
        <Tabs defaultActiveKey="1" onChange={this.callback} tabBarExtraContent={extraContent}>
          <TabPane tab="进行中" key="1">
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
          </TabPane>
          <TabPane tab="已完成" key="2">
            <List
              loading={loading}
              itemLayout="horizontal"
              loadMore={loadMore}
              dataSource={listData}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Popconfirm
                      title="确认删除吗？"
                      okText="是"
                      cancelText="否"
                      onConfirm={() => this.deleteEntity(item, true)}
                    >
                      <a>删除</a>
                    </Popconfirm>,
                  ]}
                >
                  <Skeleton avatar title={false} loading={loading} active>
                    <List.Item.Meta title={`[${item.id}]${item.name}`} />
                  </Skeleton>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default Plan;
