import React, { Component } from 'react';
import styles from './canvas.less';
import { Polygon } from './common';

class Draw extends Component {
    constructor(props) {
        super(props);
       
    }

    componentDidMount() {
        const p = new Polygon();
        p.mounted('canvas');
    }


    render() {
        return (
            <div id="canvas"></div>
        );
    }
}

export default Draw;
