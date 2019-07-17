import React from 'react';
import { Form, Modal, Input, Select } from 'antd';
import { saveSigninConfig } from '@/services/signin';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class SigninModal extends React.PureComponent {
  state = {
    loading: false,
  };

  componentDidMount() {}

  handleCancel = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleSubmit = () => {
    const {
      onClose,
      form: { validateFields },
    } = this.props;
    validateFields((err, fieldsValue) => {
      saveSigninConfig(fieldsValue).then(() => {
        onClose(true);
      });
    });
  };

  render() {
    const {
      visible,
      form: { getFieldDecorator },
    } = this.props;
    const { loading } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    return (
      <Modal
        destroyOnClose
        visible={visible}
        title=""
        onOk={this.handleSubmit}
        confirmLoading={loading}
        onCancel={this.handleCancel}
      >
        <Form hideRequiredMark>
          <FormItem {...formItemLayout} label="内容">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请填写内容！' }],
            })(<TextArea placeholder="这里输入内容.." rows={4} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="类型">
            {getFieldDecorator('type')(
              <Select style={{ width: 200 }} placeholder="选择类型">
                <Option key="1" value="1">
                  学习
                </Option>
                <Option key="2" value="2">
                  运动
                </Option>
                <Option key="3" value="3">
                  工作
                </Option>
                <Option key="4" value="4">
                  生活
                </Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(SigninModal);
