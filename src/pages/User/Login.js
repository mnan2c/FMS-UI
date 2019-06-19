import React, { Component } from 'react';
// import Link from 'umi/link';
import {
  // Checkbox,
  Alert,
} from 'antd';
import Login from '@/components/Login';
import router from 'umi/router';
import styles from './Login.less';
import { setCookie, getCookie } from '../../utils/utils';
import { login, register } from '@/services/user';

const { Tab, UserName, Password, Submit } = Login;

class LoginPage extends Component {
  state = {
    type: 'account',
    // autoLogin: true,
  };

  handleSubmit = (err, values) => {
    if (!err) {
      const param = {
        name: values.userName,
        ...values,
      };
      login(param).then(resp => {
        setCookie('access_token', resp.data, 24 * 60 * 60 * 1000);
        router.push('/plan');
      });
    }
  };

  // remember me
  // changeAutoLogin = e => {
  //   this.setState({
  //     autoLogin: e.target.checked,
  //   });
  // };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting } = this.props;
    const {
      type,
      // autoLogin
    } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="系统登录">
            {login &&
              login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage('Invalid Username or password')}
            <UserName name="userName" placeholder="用户名" />
            <Password
              name="password"
              placeholder="密码"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          <Submit loading={submitting}>确定</Submit>
          <div>
            <div className={styles.other}>
              {/*  <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                Remember Me
              </Checkbox>
              <Link className={styles.register} to="#">
                Register
              </Link> */}
            </div>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
