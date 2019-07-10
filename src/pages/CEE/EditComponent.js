import 'braft-editor/dist/index.css';
import React from 'react';
import { Card } from 'antd';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
// import { ImageUtils } from 'braft-finder';

export default class EditComponent extends React.Component {
  state = {
    editorState: BraftEditor.createEditorState('<p>Hello <b>World!</b></p>'), // 设置编辑器初始内容
    outputHTML: '<p></p>',
    outputRAW: '',
  };

  componentDidMount() {
    this.isLivinig = true;
    // 1.5秒后更改编辑器内容
    setTimeout(this.setEditorContentAsync, 1500);
  }

  componentWillUnmount() {
    this.isLivinig = false;
  }

  handleChange = editorState => {
    this.setState({
      editorState,
      outputHTML: editorState.toHTML(),
      outputRAW: editorState.toRAW(),
    });
  };

  setEditorContentAsync = () => {
    if (this.isLivinig) {
      this.setState({
        editorState: BraftEditor.createEditorState('<p>你好，<b>世界!</b><p>'),
      });
    }
  };

  insertHello = () => {
    const { editorState } = this.state;
    this.setState({
      editorState: ContentUtils.insertText(editorState, <div>abc</div>),
    });
  };

  render() {
    const { editorState, outputHTML, outputRAW } = this.state;

    const controls = ['undo', 'redo', 'bold', 'text-color', 'emoji', 'separator'];
    const extendControls = [
      {
        key: 'single-choice',
        type: 'button',
        text: '单选题',
        onClick: this.insertHello,
      },
      {
        key: 'multiple-choice',
        type: 'button',
        text: '多选题',
        onClick: this.insertHello,
      },
      {
        key: 'fill-ins',
        type: 'button',
        text: '填空题',
        onClick: this.insertHello,
      },
      {
        key: 'short-answer',
        type: 'button',
        text: '简答题',
        onClick: this.insertHello,
      },
    ];
    // {
    //   key: 'custom-dropdown',
    //   type: 'dropdown',
    //   text: '下拉组件',
    //   component: <div style={{ color: '#fff', padding: 10 }}>你好啊！</div>,
    // },
    // {
    //   key: 'custom-modal',
    //   type: 'modal',
    //   text: '模态框',
    //   modal: {
    //     id: 'my-moda-1',
    //     title: '你好啊',
    //     children: (
    //       <div style={{ width: 400, padding: '0 10px' }}>
    //         <img
    //           alt="pic"
    //           src="https://margox.cn/wp-content/uploads/2016/10/FA157E13E8B77E6E11290E9DF4C5ED7D-480x359.jpg"
    //           style={{ width: '100%', height: 'auto' }}
    //         />
    //       </div>
    //     ),
    //   },
    // },

    return (
      <div>
        <div className="editor-wrapper">
          <BraftEditor
            value={editorState}
            onChange={this.handleChange}
            controls={controls}
            extendControls={extendControls}
            contentStyle={{ height: 200 }}
          />
        </div>
        <h5>输出内容</h5>
        <div className="output-content">{outputHTML}</div>
        <h5>输出Json</h5>
        <div className="output-content">{outputRAW}</div>
      </div>
    );
  }
}
