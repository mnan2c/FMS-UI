import React from 'react';
import { Form, Modal, Input, Select } from 'antd';
import { createNotice } from '@/services/notice';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class AddNoticeModal extends React.PureComponent {
  state = {
    loading: false,
  };

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
      if (err) return;
      createNotice(fieldsValue).then(() => {
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

    // 内容，优先级
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
          <FormItem {...formItemLayout} label="优先级">
            {getFieldDecorator('importance', {
              rules: [{ required: true, message: '请选择！' }],
            })(
              <Select value="2" defaultValue="2" style={{ width: 200 }} placeholder="选择优先级">
                <Option value="3">重要</Option>
                <Option value="2">一般</Option>
                <Option value="1">次要</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(AddNoticeModal);
