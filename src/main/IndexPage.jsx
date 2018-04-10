import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;
import EditTableDemo from 'editTable/EditTableDemo';
import TimelineDemo from 'timeline/TimelineDemo';
import styles from './indexPage.less';

const keyMap = {
  editTable: { component: <EditTableDemo />, breadcrumb: 'editTable' },
  timeline: { component: <TimelineDemo />, breadcrumb: 'timeline' }
};
class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: 'editTable' //默认是可编辑表格
    };
  }

  handleClick = ({ item, key, keypath }) => {
    this.setState((preState, props) => ({ ...preState, menu: key }));
  };
  render() {
    const { menu } = this.state;
    const { component, breadcrumb } = keyMap[menu];

    return (
      <div style={{ height: '100%' }}>
        <div style={{ position: 'fixed', width: '100%', height: 64 }}>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['editTable']}
            style={{ lineHeight: '64px' }}
            onClick={this.handleClick}
          >
            <Menu.Item key="editTable">可编辑表格</Menu.Item>
            <Menu.Item key="timeline">可点击时间轴</Menu.Item>
          </Menu>
        </div>
        <div className={styles.content}>
          <Breadcrumb style={{ padding: '10px 50px' }}>
            <Breadcrumb.Item>{breadcrumb}</Breadcrumb.Item>
          </Breadcrumb>
          <div className={styles.realContent}>{component}</div>
        </div>
        <div className={styles.footer}>wky &copy; 2018-03-26</div>
      </div>
    );
  }
}

export default IndexPage;
