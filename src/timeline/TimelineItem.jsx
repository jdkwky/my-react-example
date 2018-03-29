import React, { Component } from 'react';
import { Timeline as AntdTimeline } from 'antd';
import omit from 'omit.js';
import classnames from 'classnames';
import styles from './timeline.less';
const Item = AntdTimeline.Item;

class TimelineItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'blue'
    };
  }

  componentWillReceiveProps(nextProps) {
    const { currentkey, defaultkey } = nextProps;
    if (currentkey === defaultkey) {
      this.setState((preState, props) => ({ ...preState, color: 'red' }));
    } else {
      this.setState((preState, props) => ({ ...preState, color: 'blue' }));
    }
  }

  handleClick = event => {
    event.stopPropagation(); //阻止向上冒泡
    const { value, onTimelineClick } = this.props;
    if (onTimelineClick && typeof onTimelineClick === 'function') {
      onTimelineClick(event, value);
    }
  };

  render() {
    const { color } = this.state;
    const props = { ...omit(this.props, ['value', 'onTimelineClick']), color };
    const { onTimelineClick } = this.props;
    const classString = classnames({
      [styles.pointer]: typeof onTimelineClick === 'function'
    });

    return (
      <div>
        <div onClick={this.handleClick} className={classString}>
          <Item {...props} />
        </div>
      </div>
    );
  }
}

export default TimelineItem;
