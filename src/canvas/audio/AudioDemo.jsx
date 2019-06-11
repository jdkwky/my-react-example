import React, { Component } from 'react';
import { Icon } from 'antd';

import Audio from './audio';
import styles from './audioDemo.less';

class AudioDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            audio1: null,
            audio2: null,
            audio1DrawEnd: false,
            audio2DrawEnd: false,
            audio1Play: false,
            audio2Play: false
        };
    }

    componentDidMount() {
        const audio1 = new Audio({
            wrapId: 'audio',
            // fileId: 'audioFile'
            url: 'https://wavesurfer-js.org/example/split-channels/stereo.mp3',
            play: false
        });
        const audio2 = new Audio({
            wrapId: 'audio1',
            pagination: false,
            fileId: 'audioFile',
            play: false
            // url:'https://wavesurfer-js.org/example/split-channels/stereo.mp3'
        });
        audio1.on('audioDrawEnd', ()=>{
            this.setState((state, props)=>({
                audio1DrawEnd: true
            }))
            
        });
        audio2.on('audioDrawEnd', ()=>{
            this.setState((state, props)=>({
                audio2DrawEnd: true
            }))
            
        });
        this.setState((state, props) => ({
            audio1: audio1,
            audio2: audio2
        }));
    
    }

    handleAudio1Click = () => {
        if(!this.state.audio1Play){
            this.state.audio1.playAudio();
        }else{
            this.state.audio1.endPlayAudio();
        }
        this.setState((state, props) =>({
            audio1Play: !state.audio1Play
        }));
    };

    handleAudio2Click = () => {
        if(!this.state.audio2Play){
            this.state.audio2.playAudio();
        }else{
            this.state.audio2.endPlayAudio();
        }
        this.setState((state, props) =>({
            audio2Play: !state.audio2Play
        }));
    };

    render() {
        return (
            <div className={styles.wrap}>
                { this.state.audio1DrawEnd? <Icon type="sound" onClick={this.handleAudio1Click} /> :'' }
                <div className={styles.audio} id="audio" />
                <input type="file" name="" id="audioFile" />
                { this.state.audio2DrawEnd ? <Icon type="sound" onClick={this.handleAudio2Click} /> :'' }
                <div className={styles.audio} id="audio1" />
            </div>
        );
    }
}

export default AudioDemo;
