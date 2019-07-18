import React,  { Component } from 'react';
import { Input , Button } from 'antd';

import { ADD_TODO } from './actions';
import todoApp from './reducer';

import { createStore } from 'redux';

const store = createStore(todoApp);

const unsubscribe = store.subscribe(() => console.log(store.getState()))


class ReduxDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addValue : ''
        }
    }
    componentDidMount() {}
    handleAddClick =()=>{
        store.dispatch({ type:'ADD_TODO', payload: { value: this.state.addValue }})
        
    }
    handleInputChange=(e)=>{
        const { value } = e.target ||{};
        
        this.setState((state, props) =>{
            return {
                addValue: value
            };
        })
    }

    render() {
        return <div>
            <Input onChange={this.handleInputChange} ></Input> <Button onClick={this.handleAddClick} >添加</Button>
        </div>;
    }
}

export default ReduxDemo;
