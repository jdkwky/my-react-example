import React, { Component } from 'react';
import { Button } from 'antd'

import regexList from './regex';
import styles from './utilDemo.less';
import execl from './excel';
import data from './excel.json';

class UtilDemo extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    regexListRender() {
        console.log(regexList);

        return regexList.map((val, index) => {
            if (!val.hiddlen) {
                return (
                    <pre key={index} className={styles.item}>
                        <span className={styles.desc}>{val.label}</span>
                        <code className={styles.value}>{val.value}</code>
                    </pre>
                );
            }
        });
    }

    handleClick(){
        execl(data);
    }

    render() {
        return (
            <div className={styles.content}>
                {this.regexListRender()}
                <pre >
                    <span className={styles.desc}>字数限制12个字符，只支持数字字母汉字下滑线</span>
                    <code className={styles.value}>/^[\u2E80-\u9FFF0-9a-zA-Z_]{(1, 12)}$/</code>
                </pre>

            <div className="execl-test">
                <Button onClick={this.handleClick}>下载Execel文件</Button>
            </div>
            </div>
        );
    }
}

export default UtilDemo;
