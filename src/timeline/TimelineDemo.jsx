import React ,{Component} from 'react';
import { message } from 'antd';
import Timeline from "./Timeline";
const { Item } = Timeline;

export default class TimelineDemo extends Component {

    handleClick =(event,value) =>{
        message.info(value);
    }
    render(){
        return(
            <Timeline>
                <Item onTimelineClick={this.handleClick} value="test1">test1</Item>
                <Item onTimelineClick={this.handleClick} value="test2">test2</Item>
                <Item onTimelineClick={this.handleClick} value="test3">test3</Item>
                <Item onTimelineClick={this.handleClick} value="test4">test4</Item>
                <Item onTimelineClick={this.handleClick} value="test5">test5</Item>
                <Item onTimelineClick={this.handleClick} value="test6">test6</Item>
            </Timeline>
        );
    }
}