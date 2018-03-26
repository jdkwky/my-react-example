import React from 'react';
import PropTypes from 'prop-types';
import styles from './editableCell.less';
import classNames from 'classnames';
import { Icon, Popover } from 'antd';
export default class EditTableCell extends React.Component {
  static propTypes = {
    isDelete: PropTypes.bool, // 判断是否能删除
    onDelete: PropTypes.func, // 删除
    isPopup: PropTypes.bool, // 是否是弹出式
    editArea: PropTypes.element, //可编辑控件的值
    descArea: PropTypes.any, //最后在表格中展示的值
    placeholder: PropTypes.string, //默认展示的值
    isPopDelete: PropTypes.bool, //弹出框中是否有删除按钮
    onPopDelete: PropTypes.func //弹窗中的删除事件
  };
  static defaultProps = {
    isDelete: false,
    placeholder: '',
    isPopup: false,
    visiblePopup: false,
    isPopDelete: false
  };
  constructor(props) {
    super(props);
    this.state = {
      editing: false, //判断什么时候是可编辑的什么时候是不可编辑的
      visiblePopup: false // 判断弹窗是否可见
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleEditAreaChange = (value, onChange) => {
    onChange && onChange(value);
    this.setState({
      editing: false
    });
  };
  handleKeyDown = (e, onKeyDown) => {
    const result = onKeyDown && onKeyDown(e);

    if (result) {
      //回车跳转
      this.setState({
        visiblePopup: false,
        editing: false
      });
    }
  };

  handleVisibleChange = visible => {
    this.setState({
      visiblePopup: false,
      editing: false
    });
  };

  handleEditClick = e => {
    this.setState({
      editing: !this.state.editing,
      visiblePopup: !this.state.visiblePopup
    });
  };
  handleDeleteClick = e => {
    //阻止向上冒泡
    e.stopPropagation();
    const { onDelete } = this.props;
    onDelete && onDelete();
  };

  handlePopOverDelete = () => {
    this.setState({
      visiblePopup: false,
      editing: false
    });
  };

  handlePopoverClick = e => {
    e.stopPropagation();
  };

  editAreaRender = () => {
    let { editArea, isPopup, placeholder, descArea, isPopDelete } = this.props;
    if (!isPopup) {
      // 如果不是弹出式
      if (editArea) {
        const { onChange } = editArea.props;
        editArea = {
          ...editArea,
          props: {
            ...editArea.props,
            onChange: value => {
              this.handleEditAreaChange(value, onChange);
            }
          }
        };
        return <div className={styles.editArea}>{editArea}</div>;
      }
      return null;
    } else {
      const { onKeyDown } = editArea.props;
      if (editArea) {
        editArea = {
          ...editArea,
          props: {
            ...editArea.props,
            onKeyDown: value => {
              this.handleKeyDown(value, onKeyDown);
            }
          }
        };
        return (
          <Popover
            className={styles.popOverWidth}
            placement="rightBottom"
            content={
              <div id="ANTDPOPVER" className={styles.popEditArea} onClick={this.handlePopoverClick}>
                {isPopDelete ? (
                  <Icon type="close" className={styles.popDeleteIcon} onClick={this.handlePopOverDelete} />
                ) : (
                  ''
                )}
                {editArea}
              </div>
            }
            visible={this.state.visiblePopup}
            trigger={'click'}
            onVisibleChange={this.handleVisibleChange}
          >
            {descArea ? (
              <div
                onClick={this.handleEditClick}
              >
                {descArea}
              </div>
            ) : (
              <div
                className={`${styles.placeholder} text-rows-two`}
                onClick={this.handleEditClick}
              >
                {placeholder}
              </div>
            )}
          </Popover>
        );
      }
      return null;
    }
  };

  descAreaRender = () => {
    const { isDelete, descArea, placeholder } = this.props;
    let descRender;
    if (isDelete) {
      //能删除
      if (descArea) {
        //存在返回值
        descRender = (
          <div className={styles.descContainer}>
            <div className={styles.deleteDescArea} onClick={this.handleEditClick}>
              {descArea}
            </div>
            <div className={styles.editDelete}>
              <div className={styles.editDeleteIcon} onClick={this.handleDeleteClick}>
                <Icon type="close" className={styles.deleteIcon} />
              </div>
            </div>
          </div>
        );
      } else {
        descRender = (
          <div
            className={`${styles.placeholder} text-rows-two`}
            onClick={this.handleEditClick}
          >
            {placeholder}
          </div>
        );
      }
    } else {
      descRender = descArea ? (
        <div
          className={styles.herbalDescArea}
          onClick={this.handleEditClick}
        >
          {descArea}
        </div>
      ) : (
        <div
          className={`${styles.placeholder} text-rows-two`}
          onClick={this.handleEditClick}
        >
          {placeholder}
        </div>
      );
    }
    return descRender;
  };
  render() {
    const { isDelete, isPopup, editArea, descArea, placeholder, onClick } = this.props;
    const { editing } = this.state;
    return (
      <div className={styles.container} onClick={onClick}>
        {editing && editArea ? this.editAreaRender() : this.descAreaRender()}
      </div>
    );
  }
}
