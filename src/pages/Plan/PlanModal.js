import React from 'react';
import { Form, Modal, Input, Select } from 'antd';
import { savePlan } from '@/services/plan';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class PlanModal extends React.PureComponent {
  state = {
    loading: false,
  };

  componentDidMount() {
    const {
      isCreate,
      record,
      form: { setFieldsValue },
    } = this.props;
    if (!isCreate) {
      setFieldsValue(record);
    }
  }

  handleCancel = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleSubmit = () => {
    const {
      isCreate,
      onClose,
      record,
      form: { validateFields },
    } = this.props;
    validateFields((err, fieldsValue) => {
      const item = isCreate ? fieldsValue : { ...fieldsValue, id: record.id };
      savePlan(item, isCreate).then(() => {
        onClose(true);
      });
    });
  };

  render() {
    const {
      isCreate,
      record,
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
              initialValue: !isCreate && record ? record.name : '',
              rules: [{ required: true, message: '请填写内容！' }],
            })(<TextArea placeholder="这里输入内容.." rows={4} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="优先级">
            {getFieldDecorator('priority', {
              initialValue: !isCreate && record ? `${record.priority || ''}` : '2',
            })(
              <Select style={{ width: 200 }} placeholder="选择优先级">
                <Option key="1" value="1">
                  重要
                </Option>
                <Option key="2" value="2">
                  一般
                </Option>
                <Option key="3" value="3">
                  次要
                </Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="状态">
            {getFieldDecorator('status', {
              initialValue: !isCreate && record ? `${record.status || ''}` : '1',
            })(
              <Select style={{ width: 200 }} placeholder="选择状态">
                <Option key="1" value="1">
                  新建
                </Option>
                <Option key="2" value="2">
                  进行中
                </Option>
                <Option key="3" value="3">
                  阻塞
                </Option>
                <Option key="4" value="4">
                  完成
                </Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(PlanModal);
