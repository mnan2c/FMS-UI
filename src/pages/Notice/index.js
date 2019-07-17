import React, { PureComponent } from 'react';
import { getNotices, deleteItem } from '@/services/notice';
// import TagCloud from 'react-tag-cloud';
import { message } from 'antd';
import { TagCloud } from 'ant-design-pro/lib/Charts';
import AddNoticeModal from './AddNoticeModal';

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
        data: resp && resp.data.content,
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
    const tagData = data.map(item => ({
      ...item,
      value: item.importance,
    }));
    return (
      <>
        {/* <a style={{ float: 'right' }} onClick={this.showModal}>
          新增
        </a> */}
        <TagCloud data={tagData} height={200} />
        <AddNoticeModal visible={modalVisible} onClose={this.handleCloseModal} />
      </>
    );
  }
}

export default Notice;
