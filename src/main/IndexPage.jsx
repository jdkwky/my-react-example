import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;
import EditTableDemo from 'editTable/EditTableDemo';
import TimelineDemo from 'timeline/TimelineDemo';
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
      <Layout>
        <Header style={{ position: 'fixed', width: '100%' }}>
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
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <Breadcrumb style={{ padding: '0 50px' }}>
            <Breadcrumb.Item>{breadcrumb}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: '#fff', padding: 24, minHeight: 800 }}>{component}</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>wky &copy; 2018-04-09</Footer>
      </Layout>
    );
  }
}

export default IndexPage;
