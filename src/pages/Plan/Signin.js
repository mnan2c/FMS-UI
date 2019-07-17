import React from 'react';
import { Card, Popconfirm, List, Skeleton, Col, Row, Form, Icon, Statistic } from 'antd';
import {
  getSigninConfigs,
  deleteSigninConfig,
  signin,
  getTodaySigninRecords,
  getLastNDaysRate,
  getLastSigninRate,
} from '@/services/signin';
import { Bar } from 'ant-design-pro/lib/Charts';

import SigninModal from './SigninModal';
import Notice from '../Notice';

const PAGESIZE = 100;
const COUNT_RATE = 12;

class Signin extends React.Component {
  state = {
    listData: [],
    loading: true,
    modalVisible: false,
    isShowDeleteButton: false,
    configState: '',
    rateList: [],
    loadingRateList: true,
    loadingLastRate: true,
    lastRate: {},
    pagination: {
      current: 0,
      pageSize: PAGESIZE,
    },
  };

  pointEditRef = React.createRef();

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
    },
    {
      title: '内容',
      dataIndex: 'name',
      width: '50%',
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      render: (text, record) => <a onClick={() => this.updateEntity(record)}>修改</a>,
    },
  ];

  componentDidMount() {
    this.refreshList(false);
    this.getLastNDaysRates();
    this.getLastSigninRate();
  }

  refreshList = () => {
    const { pagination } = this.state;
    this.setState({ loading: true });

    let alreadySigninIds = [];
    getTodaySigninRecords()
      .then(resp => {
        alreadySigninIds = [].concat(resp.data.map(item => item.signinConfigId));
        getSigninConfigs(pagination).then(resp1 => {
          if (resp1) {
            this.setState({
              listData: resp1.data.content.map(item => ({
                ...item,
                alreadySignin: alreadySigninIds.indexOf(item.id) >= 0,
              })),
              loading: false,
            });
          }
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  getLastNDaysRates = () => {
    this.setState({ loadingRateList: true });
    getLastNDaysRate({
      current: 0,
      pageSize: COUNT_RATE,
    })
      .then(resp => {
        this.setState({
          loadingRateList: false,
          rateList: resp.data.map(item => {
            const date = Object.keys(item)[0];
            return {
              x: date.substr(-5),
              y: item[date],
            };
          }),
        });
      })
      .catch(() => {
        this.setState({ loadingRateList: false });
      });
  };

  getLastSigninRate = () => {
    this.setState({ loadingLastRate: true });
    getLastSigninRate()
      .then(resp => {
        this.setState({ loadingLastRate: false, lastRate: resp.data });
      })
      .catch(() => {
        this.setState({ loadingLastRate: false });
      });
  };

  handleCloseModal = refresh => {
    this.setState({ modalVisible: false });
    if (refresh) {
      this.refreshList(false);
    }
  };

  deleteEntity = item => {
    deleteSigninConfig(item.id).then(() => this.refreshList());
  };

  signin = item => {
    signin(item.id).then(() => {
      this.refreshList();
      this.getLastNDaysRates();
      this.getLastSigninRate();
    });
  };

  createEntity = () => {
    this.setState({
      modalVisible: true,
    });
  };

  changeEditState = () => {
    const { isShowDeleteButton } = this.state;
    this.setState({
      configState: isShowDeleteButton ? '' : 'filled',
      isShowDeleteButton: !isShowDeleteButton,
    });
  };

  render() {
    const {
      listData,
      modalVisible,
      loading,
      isShowDeleteButton,
      configState,
      loadingRateList,
      rateList,
      loadingLastRate,
      lastRate,
    } = this.state;

    return (
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Card
            title="打卡"
            extra={
              <>
                <a onClick={this.changeEditState} style={{ marginRight: 20 }}>
                  <Icon type="setting" theme={configState} />
                </a>
                <a onClick={this.createEntity}>
                  <Icon type="plus-circle" theme="filled" />
                </a>
              </>
            }
          >
            <List
              loading={loading}
              itemLayout="horizontal"
              dataSource={listData}
              renderItem={item => (
                <List.Item
                  actions={[
                    !item.alreadySignin ? (
                      <a onClick={() => this.signin(item)}>打卡</a>
                    ) : (
                      <span>今日已打卡</span>
                    ),
                    isShowDeleteButton ? <span> | </span> : null,
                    isShowDeleteButton ? (
                      <Popconfirm
                        title="确认删除吗？"
                        okText="是"
                        cancelText="否"
                        onConfirm={() => this.deleteEntity(item)}
                      >
                        <a>删除</a>
                      </Popconfirm>
                    ) : null,
                  ]}
                >
                  <Skeleton avatar title={false} loading={loading} active>
                    <List.Item.Meta title={`${item.name}`} />
                  </Skeleton>
                </List.Item>
              )}
            />
            <SigninModal visible={modalVisible} onClose={this.handleCloseModal} />
          </Card>
          <Card
            title="每日打卡比例"
            style={{ height: 300, marginTop: 20 }}
            loading={loadingRateList}
          >
            <Bar height={200} data={rateList} />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="打卡数据统计" loading={loadingLastRate}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Statistic title="上次打卡" value={lastRate ? lastRate.createDate : ''} />
              </Col>
              <Col xs={24} sm={12}>
                <Statistic
                  title="已连续打卡（天）"
                  value={lastRate ? lastRate.continuous : undefined}
                />
              </Col>
            </Row>
            {/* <Row gutter={16} style={{ marginTop: 30 }}>
              <Col xs={24} sm={12}>
                <Statistic title="连续打卡达标天数" value={112893} />
              </Col>
              <Col xs={24} sm={12}>
                <Statistic title="连续打卡达标天数" value={112893} />
              </Col>
            </Row> */}
          </Card>
          <Card title="标签云" style={{ marginTop: 20 }}>
            <Notice />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Form.create()(Signin);
