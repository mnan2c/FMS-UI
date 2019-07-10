import React from 'react';
import { Card, Input, Typography, Form, Radio } from 'antd';

import styles from './style.less';

const { Title } = Typography;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
};

class TestPaper extends React.PureComponent {
  singleChoice = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const arr = [1, 2, 3];
    return arr.map(seq => (
      <>
        <Form.Item label={seq}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入试卷标题!' }],
          })(<Input placeholder="请输入题目内容" />)}
        </Form.Item>
        <Input />
      </>
    ));
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      console.log(fieldsValue);
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Card>
          <Form.Item label="试卷标题">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入试卷标题!' }],
            })(<Input placeholder="数学模拟题 - 2019.07.06" />)}
          </Form.Item>
          <Form.Item label="说明">
            {getFieldDecorator('description')(<Input placeholder="加油！" />)}
          </Form.Item>
        </Card>
        <Card title="单选题" style={{ marginTop: 20 }}>
          <Form.Item label="1">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入题目内容!' }],
            })(<Input placeholder="请输入题目内容" />)}
          </Form.Item>
          <Radio.Group onChange={this.onChange} value="2">
            <Radio style={radioStyle} value={1}>
              Option A
            </Radio>
            <Radio style={radioStyle} value={2}>
              Option B
            </Radio>
            <Radio style={radioStyle} value={3}>
              Option C
            </Radio>
          </Radio.Group>
        </Card>
        <Card title="多选题" style={{ marginTop: 20 }} />
        <Card title="填空题" style={{ marginTop: 20 }} />
        <Card title="简答题" style={{ marginTop: 20 }} />
      </Form>
    );
  }
}

export default Form.create()(TestPaper);
