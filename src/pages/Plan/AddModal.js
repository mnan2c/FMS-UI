import React from 'react';
import { Form, Modal, Input, Select } from 'antd';
import { createPlan } from '@/services/plan';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class AddModal extends React.PureComponent {
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
      const item = {
        ...fieldsValue,
        status: 1,
      };
      createPlan(item).then(() => {
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
        visible={visible}
        title="新增内容"
        onOk={this.handleSubmit}
        confirmLoading={loading}
        onCancel={this.handleCancel}
      >
        <Form hideRequiredMark>
          <FormItem {...formItemLayout} label="内容">
            {getFieldDecorator('name')(<TextArea placeholder="这里输入内容.." rows={4} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="优先级">
            {getFieldDecorator('priority')(
              <Select defaultValue="1" style={{ width: 200 }} placeholder="选择优先级">
                <Option value="0">紧急</Option>
                <Option value="1">高</Option>
                <Option value="2">普通</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(AddModal);
