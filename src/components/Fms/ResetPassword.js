import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { Form, Modal, Icon, Menu, Input, message } from 'antd';

import { resetPassword } from '@/services/user';
import { setCookie, getCookie } from '../../utils/utils';
import { setAuthority } from '../../utils/authority';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

class ResetPassword extends React.PureComponent {
  state = {
    visible: false,
  };

  resetpassword = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, fieldsValue) => {
      const { newPassword1, newPassword2 } = fieldsValue;
      if (err || newPassword1 !== newPassword2) {
        return;
      }
      resetPassword({ ...fieldsValue, newPassword: newPassword1, name: getCookie('user_name') })
        .then(resp => {
          if (resp.code === 200) {
            message.info('修改密码成功！');
            this.setState({
              visible: false,
            });
            setAuthority(resp.data.roleName);
            setCookie('access_token', resp.data.token, 2 * 1000);
            setCookie('user_name', resp.data.name || '', 24 * 60 * 60 * 1000);
            setCookie('user_avatar', resp.data.avatar || '', 24 * 60 * 60 * 1000);
          } else {
            message.info('旧密码错误！');
          }
        })
        .cache(() => {
          message.info('旧密码错误！');
        });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible } = this.state;
    return (
      <>
        <Menu.Item key="resetpassword" onClick={this.resetpassword} style={{ marginLeft: 11 }}>
          <Icon type="edit" />
          <FormattedMessage id="menu.reset.password" defaultMessage="resetpassword" />
        </Menu.Item>
        <Modal
          title="修改密码"
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        >
          <Form hideRequiredMark>
            <FormItem {...formItemLayout} label="旧密码">
              {getFieldDecorator('oldPassword', {
                rules: [{ required: true, message: '请输入旧密码！' }],
              })(<Input.Password placeholder="请输入旧密码.." />)}
            </FormItem>
            <FormItem {...formItemLayout} label="新密码">
              {getFieldDecorator('newPassword1', {
                rules: [{ required: true, message: '请输入新密码！' }],
              })(<Input.Password placeholder="请输入新密码.." />)}
            </FormItem>
            <FormItem {...formItemLayout} label="确认新密码">
              {getFieldDecorator('newPassword2', {
                rules: [{ required: true, message: '请输入确认新密码！' }],
              })(<Input.Password placeholder="确认新密码.." />)}
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(ResetPassword);
