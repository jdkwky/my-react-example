import React, { Component } from 'react';

import regexList from './regex';
import styles from './utilDemo.less';

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

    render() {
        return (
            <div className={styles.content}>
                {this.regexListRender()}
                <pre >
                    <span className={styles.desc}>字数限制12个字符，只支持数字字母汉字下滑线</span>
                    <code className={styles.value}>/^[\u2E80-\u9FFF0-9a-zA-Z_]{(1, 12)}$/</code>
                </pre>
            </div>
        );
    }
}

export default UtilDemo;
