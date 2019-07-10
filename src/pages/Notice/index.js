import React, { PureComponent } from 'react';
import { getNotices, deleteItem } from '@/services/notice';
import TagCloud from 'react-tag-cloud';
import randomColor from 'randomcolor';
import { Icon, message } from 'antd';
import AddNoticeModal from './AddNoticeModal';

const styles = {
  large: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  small: {
    opacity: 0.7,
    fontSize: 16,
  },
};

class Notice extends PureComponent {
  state = {
    modalVisible: false,
    data: [],
    pagination: {
      current: 0,
      pageSize: 100,
    },
  };

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    const { pagination } = this.state;
    getNotices(pagination).then(resp => {
      this.setState({
        data: resp.data.content,
      });
    });
  };

  handleCloseModal = refresh => {
    this.setState({ modalVisible: false });
    if (refresh) {
      this.refreshList();
    }
  };

  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  deleteItem = id => {
    deleteItem(id).then(() => {
      message.info('删除成功！');
      this.refreshList();
    });
  };

  render() {
    const { data, modalVisible } = this.state;
    const domWithData = data.map(item => {
      let itemStyle;
      switch (item.importance) {
        case 3:
          itemStyle = styles.large;
          break;
        case 1:
          itemStyle = styles.small;
          break;
        default:
          break;
      }
      return (
        <div style={itemStyle} key={item.id}>
          {item.name}
          <Icon
            type="close"
            style={{ fontSize: 15, color: '#BCAAA4' }}
            onClick={() => this.deleteItem(item.id)}
          />
        </div>
      );
    });
    return (
      <>
        <a style={{ float: 'right' }} onClick={this.showModal}>
          新增
        </a>
        <TagCloud
          style={{
            fontFamily: 'sans-serif',
            fontSize: 20,
            fontWeight: 'bold',
            fontStyle: 'italic',
            color: () => randomColor(),
            padding: 5,
            width: '100%',
            height: '100%',
          }}
        >
          {domWithData}
        </TagCloud>
        <AddNoticeModal visible={modalVisible} onClose={this.handleCloseModal} />
      </>
    );
  }
}

export default Notice;
