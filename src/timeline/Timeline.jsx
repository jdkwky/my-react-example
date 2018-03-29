import React, { Component } from 'react';
import { Timeline as AntdTimeline } from 'antd';
import TimelineItem from './TimelineItem';

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentkey: -1
    };
  }

  handleClick = (event, index) => {
    this.setState((preState, props) => ({ ...preState, currentkey: index }));
  };

  render() {
    const { currentkey } = this.state;
    return (
      <AntdTimeline {...this.props}>
        {React.Children.map(this.props.children, (children, index) => {
          return React.cloneElement(children, {
            currentkey,
            defaultkey: index,
            onClick: event => {
              this.handleClick(event, index);
            }
          });
        })}
      </AntdTimeline>
    );
  }
}

Timeline.Item = TimelineItem;

export default Timeline;
