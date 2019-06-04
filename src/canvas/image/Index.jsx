import React, { Component } from 'react';

import  ImageCanvas from './imageCanvas';
import styles from './index.less';


class ImageCanvasDemo extends Component {
    constructor(props) {
        super(props);
       
    }

    componentDidMount() {
        new ImageCanvas({
            url: require('./img/timg.jpeg'),
            id: 'canvas'
        });
    }


    render() {
        return (
            <div className={styles.canvas} id="canvas"></div>
        );
    }
}

export default ImageCanvasDemo;
