import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;
import EditTableDemo from 'editTable/EditTableDemo';
import TimelineDemo from 'timeline/TimelineDemo';
import Waterfall from 'waterfall/Waterfall';
import Canvas from 'canvas/Canvas';
import Event from 'test/event/Event';
import ImageCanvasDemo from 'canvas/image/Index';
import UtilDemo from 'utils/UtilDemo';
import AudioDemo from 'canvas/audio/AudioDemo'


import styles from './indexPage.less';

const keyMap = {
  editTable: { component: <EditTableDemo />, breadcrumb: 'editTable' , name: '可编辑表格' },
  timeline: { component: <TimelineDemo />, breadcrumb: 'timeline' , name: '自定义时间轴' },
  waterfall: { component: <Waterfall />, breadcrumb: 'waterfall' , name :'瀑布流'},
  canvas: { component: <Canvas /> ,breakdcrumb: 'canvas' , name: 'canvas画布'},
  event:{ component:<Event></Event>,breadcrumb:'events test' , name: 'react事件' } ,
  imageCanvas : { component: <ImageCanvasDemo /> , breakdcrumb: 'image canvas' , name: '显示图片画布' },
  util: { component: <UtilDemo /> , breakdcrumb:'util demo', name:'工具类代码' },
  audioDemo: { component: <AudioDemo /> , breakdcrumb:'audio demo', name:'显示语音信息' }
};
class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: 'audioDemo' //默认是可编辑表格
    };
  }

  handleClick = ({ item, key, keypath }) => {
    this.setState((preState, props) => ({ ...preState, menu: key }));
  }

  menuItemRender = () => {
    const menuItemList = []; 
    for(let item in keyMap){
      if(item) {
        menuItemList.push(
          <Menu.Item key={ item }>
              { keyMap[item].name }
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
            { this.menuItemRender() }
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
