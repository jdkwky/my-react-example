import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;
import cookie from 'utils/cookie';
import getAsyncComponent from 'utils/getAsyncComponent';

const EditTableDemo = getAsyncComponent(() => import('editTable/EditTableDemo'));
const TimelineDemo = getAsyncComponent(() => import('timeline/TimelineDemo'));
const Waterfall = getAsyncComponent(() => import('waterfall/Waterfall'));
const Canvas = getAsyncComponent(() => import('canvas/Canvas'));
const Event = getAsyncComponent(() => import('test/event/Event'));
const ImageCanvasDemo = getAsyncComponent(() => import('canvas/image/Index'));
const UtilDemo = getAsyncComponent(() => import('utils/UtilDemo'));
const AudioDemo = getAsyncComponent(() => import('canvas/audio/AudioDemo'));
const ReduxDemo = getAsyncComponent(() => import('demo/redux/ReduxDemo'));
import EditTableDemo1 from 'editTable/EditTableDemo';
console.log(EditTableDemo1, 'EditTableDemo1  ');


import styles from './indexPage.less';

const keyMap = {
  editTable: { component: <EditTableDemo />, breadcrumb: 'editTable', name: '可编辑表格' },
  timeline: { component: <TimelineDemo />, breadcrumb: 'timeline', name: '自定义时间轴' },
  waterfall: { component: <Waterfall />, breadcrumb: 'waterfall', name: '瀑布流' },
  canvas: { component: <Canvas />, breakdcrumb: 'canvas', name: 'canvas画布' },
  event: { component: <Event />, breadcrumb: 'events test', name: 'react事件' },
  imageCanvas: { component: <ImageCanvasDemo />, breakdcrumb: 'image canvas', name: '显示图片画布' },
  util: { component: <UtilDemo />, breakdcrumb: 'util demo', name: '工具类代码' },
  audioDemo: { component: <AudioDemo />, breakdcrumb: 'audio demo', name: '显示语音信息' },
  reduxDemo: { component: <ReduxDemo />, breadcrumb: 'redux demo', name: 'redux展示用法' },
};

console.log(EditTableDemo);

class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: 'editTable' //默认是可编辑表格
    };
    cookie.setCookie('test', 'test');
  }

  handleClick = ({ item, key, keypath }) => {
    this.setState((preState, props) => ({ ...preState, menu: key }));
  }

  menuItemRender = () => {
    const menuItemList = [];
    for (let item in keyMap) {
      if (item) {
        menuItemList.push(
          <Menu.Item key={item}>
            {keyMap[item].name}
          </Menu.Item>
        );
      }
    }
    return menuItemList;
  }

  render() {
    const { menu } = this.state;
    const { component, breadcrumb } = keyMap[menu];

    return (
      <div style={{ height: '100%' }}>
        <div style={{ position: 'fixed', width: '100%', height: 64 }}>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[this.state.menu]}
            style={{ lineHeight: '64px' }}
            onClick={this.handleClick}
          >
            {this.menuItemRender()}
          </Menu>
        </div>
        <div className={styles.content}>
          <Breadcrumb style={{ padding: '10px 50px' }}>
            <Breadcrumb.Item>{breadcrumb}</Breadcrumb.Item>
          </Breadcrumb>
          <div id="content" className={styles.realContent}>
            {component}
          </div>
        </div>
        <div className={styles.footer}>wky &copy; 2018-03-26</div>
      </div>
    );
  }
}

export default IndexPage;
