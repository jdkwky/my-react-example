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
            // fileId: 'audioFile'
            url:'https://wavesurfer-js.org/example/split-channels/stereo.mp3'
        });
    }


    render() {
        return (
            <div className={ styles.wrap }>
                {/* <input type="file" name="" id="audioFile"/> */}
                <div className={styles.audio} id="audio"></div>
            </div>
        );
    }
}

export default AudioDemo;
