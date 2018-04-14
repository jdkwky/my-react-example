import React, { Component } from 'react';
import styles from './waterfall.less';
import list from './data';
import axios from 'axios';

class Waterfall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      col1: [],
      col2: [],
      col3: [],
      col4: []
    };
  }

  quickSort = array => {
    function sort(prev, numsize) {
      var nonius = prev;
      var j = numsize - 1;
      var flag = array[prev];
      if (numsize - prev > 1) {
        while (nonius < j) {
          for (; nonius < j; j--) {
            if (array[j].data < flag.data) {
              array[nonius++] = array[j]; //a[i] = a[j]; i += 1;
              break;
            }
          }
          for (; nonius < j; nonius++) {
            if (array[nonius].data > flag.data) {
              array[j--] = array[nonius];
              break;
            }
          }
        }
        array[nonius] = flag;
        sort(0, nonius);
        sort(nonius + 1, numsize);
      }
    }
    sort(0, array.length);

    // for (let i = 0; i < array.length; i++) {
    //   for (let j = i + 1; j < array.length; j++) {
    //     if (array[i].data > array[j].data) {
    //       let temp = array[i];
    //       array[i] = array[j];
    //       array[j] == temp;
    //     }
    //   }
    // }

    return array;
  };

  // 计算长宽比例
  calcRealHeight(eachWidth, width, height) {
    return eachWidth / width * height;
  }

  calcHeight = (dataList, templateState, eachWidth) => {
    const { col1, col2, col3, col4 } = templateState;

    if (col1.length === 0 && col2.length === 0 && col3.length === 0 && col4.length === 0) {
      //   初始化状态
      col1.push(dataList[0]);
      col2.push(dataList[1]);
      col3.push(dataList[2]);
      col4.push(dataList[3]);

      dataList.splice(0, 4);
    } else {
      // 非初始化状态
      let h1 = 0;
      col1.forEach(c1 => {
        h1 += c1.height;
      });
      let h2 = 0;
      col2.forEach(c2 => {
        h2 += c2.height;
      });
      let h3 = 0;
      col3.forEach(c3 => {
        h3 += c3.height;
      });
      let h4 = 0;
      col4.forEach(c4 => {
        h4 += c4.height;
      });
      // h1 h2 h3  h4  排序 快排

      const tempList = [
        { data: h1, refer: 'col1' },
        { data: h2, refer: 'col2' },
        { data: h3, refer: 'col3' },
        { data: h4, refer: 'col4' }
      ];

      const rankList = this.quickSort(tempList);

      // 给最小的赋值
      switch (rankList[0].refer) {
        case 'col1':
          if (dataList.length > 0) {
            col1.push(dataList.splice(0, 1)[0]);
          }
          break;
        case 'col2':
          if (dataList.length > 0) {
            col2.push(dataList.splice(0, 1)[0]);
          }
          break;
        case 'col3':
          if (dataList.length > 0) {
            col3.push(dataList.splice(0, 1)[0]);
          }
          break;
        case 'col4':
          if (dataList.length > 0) {
            col4.push(dataList.splice(0, 1)[0]);
          }
          break;
      }
    }

    if (dataList.length > 0) {
      // 说明还有 值
      return this.calcHeight(dataList, templateState, eachWidth);
    } else {
      return templateState;
    }
  };

  componentDidMount() {
    const $waterContent = document.getElementById('waterContent');
    const eachWidth = $waterContent.clientWidth / 4 - 20;
    console.log('~~~~~~~~~~~~~~~~~');
    console.log(eachWidth, waterContent, $waterContent.clientWidth);

    console.log('~~~~~~~~~~~~~~~~~');

    // 复制一份数组信息 因为数据只有在最开始的时候会加载 后续组件切换重复渲染时会把原始数据弄丢所以复制一份
    axios
      .get(
        'search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E4%BA%8C%E6%AC%A1%E5%85%83&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=%E4%BA%8C%E6%AC%A1%E5%85%83&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&pn=30&rn=30&gsm=1e&1523709490696='
      )
      .then(list => {
        if (list.data && list.data.data) {
          const tempList = list.data.data
            .filter(value => value.height)
            .map(value => ({ ...value, height: eachWidth * value.height / value.width }));
          const data = this.calcHeight(tempList, this.state, eachWidth);

          this.setState((preState, props) => ({ ...preState, ...data }));
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleScroll = event => {};

  render() {
    const { col1, col2, col3, col4 } = this.state;

    return (
      <div id="waterContent" className="waterScroll" onScroll={this.handleScroll}>
        <div className="water">
          <div className="water-content">
            {col1.map((value, index) => (
              <div key={`col1-${index}`} className={`water-item `} style={{ height: value.height }}>
                <img src={value.middleURL} title={value.fromPageTitleEnc} style={{ width: '100%', height: '100%' }} />
              </div>
            ))}
          </div>
          <div className="water-content">
            {col2.map((value, index) => (
              <div key={`col2-${index}`} className={`water-item`} style={{ height: value.height }}>
                <img src={value.middleURL} title={value.fromPageTitleEnc} style={{ width: '100%', height: '100%' }} />
              </div>
            ))}
          </div>
          <div className="water-content">
            {col3.map((value, index) => (
              <div key={`col3-${index}`} className={`water-item `} style={{ height: value.height }}>
                <img src={value.middleURL} title={value.fromPageTitleEnc} style={{ width: '100%', height: '100%' }} />
              </div>
            ))}
          </div>
          <div className="water-content">
            {col4.map((value, index) => (
              <div key={`col4-${index}`} className={`water-item `} style={{ height: value.height }}>
                <img title={value.fromPageTitleEnc} src={value.middleURL} style={{ width: '100%', height: '100%' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Waterfall;
