import React, { Component } from 'react';

import  Audio  from './audio';
import styles from './audioDemo.less'


class AudioDemo extends Component {
    constructor(props) {
        super(props);
       
    }

    componentDidMount() {
        new Audio({
            wrapId: 'audio',
            url:'https://wavesurfer-js.org/example/split-channels/stereo.mp3'
        });
    }


    render() {
        return (
            <div className={styles.audio} id="audio"></div>
        );
    }
}

export default AudioDemo;
