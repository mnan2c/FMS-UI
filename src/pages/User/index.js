import React from 'react';
import { Table, Spin, Card } from 'antd';
import { getAllUsers } from '@/services/user';

import styles from './index.less';

class User extends React.Component {
  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '10%',
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: '20%',
    },
    {
      title: '电话',
      dataIndex: 'telephone',
      width: '20%',
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: '30%',
    },
  ];

  state = {
    listData: [],
    loading: false,
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
    getAllUsers({
      ...pagination,
      current: pageParam ? pagination.current - 1 : 0,
    })
      .then(resp => {
        pagination.total = resp.data.totalElements;
        this.setState({
          listData: resp.data.content,
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
    const { listData, loading, pagination } = this.state;

    return (
      <Card>
        <Spin spinning={loading}>
          <Table
            columns={this.columns}
            className={styles.fixedWidthTable}
            dataSource={listData}
            pagination={pagination}
            onChange={this.handleTableChange}
          />
        </Spin>
      </Card>
    );
  }
}

export default User;
