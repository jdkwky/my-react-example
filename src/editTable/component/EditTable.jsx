import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './editTable.css';

class EditTable extends Component {
  static propTypes = {
    groupTitle: PropTypes.object, //  标题
    row: PropTypes.number, // 几行
    column: PropTypes.number, // 几列
    columns: PropTypes.array, //  表格展示
    dataSource: PropTypes.array //  填充表格的数据
  };

  static defaultProps = {
    dataSource: []
  };

  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      bodyList: []
    };
    this.editTableCell = this.editTableCell.bind(this);
  }

  componentDidMount() {
    const bodyList = this.getHerbalTableBodyRender();

    this.setState({ ...this.state, bodyList: [...bodyList] });
  }

  componentWillReceiveProps(nextProps) {
    this.props = { ...this.props, ...nextProps };
    const bodyList = this.getHerbalTableBodyRender();

    this.setState({ ...this.state, bodyList: [...bodyList] });
  }

  getHerbalTableTitleClassName(column) {
    const { getTitleClassName } = this.props;
    if (getTitleClassName && typeof getTitleClassName === 'function') {
      return getTitleClassName && getTitleClassName(column);
    }
    return styles.tableBorder;
  }

  getHerbalTableTitleRender() {
    const { groupTitle, column } = this.props;
    const herbalTableTitles = [];
    for (let i = 0; i < column; i++) {
      for (let key in groupTitle) {
        herbalTableTitles.push(
          <div key={`title-${i}-${key}`} className={this.getHerbalTableTitleClassName(i)}>
            {groupTitle[key]}
          </div>
        );
      }
    }
    return herbalTableTitles;
  }

  editTableCell({ text, data, index, render }) {
    //   功能待完善
    // const { column, row, columns } = this.props;
    // const r = render(text, data, index);
    // const bodyList = this.getHerbalTableBodyRender();
    // this.setState({ ...this.state, editable: !this.state.editable, bodyList: [...bodyList] });
  }

  handleGetBodyClassName(column) {
    const { specialCell } = this.props;
    const { index, specialType, commonType } = specialCell || {};
    if (index && specialCell && commonType) {
      return index === column ? specialType : commonType;
    }
    return styles.tableBorder;
  }

  getHerbalTableBodyRender() {
    const { columns, column, dataSource } = this.props;
    let { row } = this.props;
    const tempRow = dataSource.length;
    if (tempRow > row) {
      row = tempRow;
    }
    const bodyList = [];
    for (let i = 0; i < row; i++) {
      // 行
      for (let j = 0; j < column; j++) {
        for (let c = 0, len = columns.length; c < len; c++) {
          const { render, dataIndex } = columns[c];
          const data = dataSource[i * column + j] || {};
          const text = data[dataIndex];
          if (render && typeof render === 'function') {
            const r = render(text, data, i * column + j);
            bodyList.push(
              <div
                key={`${i}-${j}-${c}-body`}
                onClick={this.editTableCell.bind(this, {
                  text,
                  data,
                  index: i * column + j,
                  render
                })}
              >
                <div className={this.handleGetBodyClassName(i * column + j)}>{r}</div>
              </div>
            );
          } else {
            bodyList.push(
              <div className={this.handleGetBodyClassName(i * column + j)} key={`${i}-${j}-${c}-body`}>
                {text}
              </div>
            );
          }
        }
      }
    }

    return bodyList;
  }

  render() {
    const { column } = this.props;
    const { bodyList } = this.state;

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat( ${column},9% 9% 7% )`
        }}
      >
        {this.getHerbalTableTitleRender()}
        {bodyList}
      </div>
    );
  }
}

export default EditTable;
