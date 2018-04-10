import React, { Component } from 'react';
import styles from './waterfall.less';
import dataList from './data';
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
            if (array[j] < flag) {
              array[nonius++] = array[j]; //a[i] = a[j]; i += 1;
              break;
            }
          }
          for (; nonius < j; nonius++) {
            if (array[nonius] > flag) {
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
    return array;
  };

  calcHeight = (dataList, templateState) => {
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
      col2.forEach(c3 => {
        h3 += c3.height;
      });
      let h4 = 0;
      col4.forEach(c4 => {
        h1 += c4.height;
      });
      // h1 h2 h3  h4  排序 快排

      const tempList = [
        { data: h1, refer: 'col1' },
        { data: h2, refer: 'col2' },
        { data: h3, refer: 'col3' },
        { data: h4, refer: 'col4' }
      ];

      const rankList = this.quickSort(tempList);
      rankList.forEach(list => {
        switch (list.refer) {
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
          default:
            break;
        }
      });
    }
    if (dataList.length > 0) {
      // 说明还有 值
      return this.calcHeight(dataList, templateState);
    } else {
      return templateState;
    }
  };

  componentDidMount() {
    const data = this.calcHeight(dataList, this.state);
    this.setState((preState, props) => ({ ...preState, ...data }));
  }

  render() {
    const { col1, col2, col3, col4 } = this.state;

    return (
      <div className="water">
        <div className="water-content">
          {col1.map((value, index) => (
            <div key={`col1-${index}`} className="water-item" style={{ height: value.height, background: 'green' }} />
          ))}
        </div>
        <div className="water-content">
          {col2.map((value, index) => (
            <div key={`col2-${index}`} className="water-item" style={{ height: value.height, background: 'blue' }} />
          ))}
        </div>
        <div className="water-content">
          {col3.map((value, index) => (
            <div key={`col3-${index}`} className="water-item" style={{ height: value.height, background: 'red' }} />
          ))}
        </div>
        <div className="water-content">
          {col1.map((value, index) => (
            <div key={`col4-${index}`} className="water-item" style={{ height: value.height, background: 'yellow' }} />
          ))}
        </div>
      </div>
    );
  }
}

export default Waterfall;
