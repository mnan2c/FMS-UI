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
import { setAuthority } from '../../utils/authority';
import { login, register } from '@/services/user';

const { Tab, UserName, Password, Submit } = Login;

class LoginPage extends Component {
  state = {
    notice: '',
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
        if (resp.code === 200) {
          setAuthority(resp.data.roleName);
          this.setState({
            notice: '',
          });
          setCookie('access_token', resp.data.token, 2 * 1000);
          setCookie('user_name', resp.data.name || '', 24 * 60 * 60 * 1000);
          setCookie('user_avatar', resp.data.avatar || '', 24 * 60 * 60 * 1000);
          router.push('/');
        } else {
          this.setState({
            notice: '用户名或密码错误!',
          });
        }
      });
    }
  };

  // remember me
  // changeAutoLogin = e => {
  //   this.setState({
  //     autoLogin: e.target.checked,
  //   });
  // };

  clearNotice = () => {
    this.setState({ notice: '' });
  };

  render() {
    const { submitting } = this.props;
    const {
      notice,
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
          <Tab key="account" tab="FMS登录">
            {notice && (
              <Alert
                style={{ marginBottom: 24 }}
                message={notice}
                type="error"
                showIcon
                closable
                onClose={this.clearNotice}
              />
            )}
            <UserName name="userName" placeholder="用户名" onFocus={this.clearNotice} />
            <Password
              name="password"
              placeholder="密码"
              onFocus={this.clearNotice}
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
