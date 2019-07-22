import React, { Component } from 'react';
import styles from './canvas.less';
import { Polygon } from './common';
import Rect from './common/Rect'

class Draw extends Component {
    constructor(props) {
        super(props);
       
    }

    componentDidMount() {
        const p = new Rect(600, 500);
        p.mounted('canvas');
    }


    render() {
        return (
            <div id="canvas"></div>
        );
    }
}

export default Draw;
