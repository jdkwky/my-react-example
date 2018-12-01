import React, { Component } from 'react';
import styles from './canvas.less';
import { Polygon } from './common';

class Draw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pointWraps: [], // 全部多边形数据
            points: [], // 当前正在绘制多边形数据
            currentDot: {}, // 当前被选中的对象
            polygon: null, // 对变形对象
            checkedIndex: -1, // 当前选中图形id
            FC: 'rgba(239,53,62,1)', // 默认填充色
            SC: '#EF353E', // 默认描边颜色
            CFC: '#e5e5e5', // 顶点填充色
            CSC: '#666', // 顶点描边色
            MFC: 'green', // 移动顶点填充色
            MSC: 'green', // 移动顶点描边色
            CHECKEDFC: 'rgba(239,53,62,1)', // 选中填充色
            CHECKEDSC: 'rgba(239,53,62,1)', // 选中描边色
            ALPHA: 0.2, // 默认透明度
            CALPHA: 0.5, // 选中透明度
            FILLTEXTFLAG: true // 是否回填数据信息
        };
    }

    componentDidMount() {
        const canvas = document.getElementById('canvas');
        this.setState({ polygon: new Polygon(canvas) });

        document.body.addEventListener(
            'keydown',
            e => {
                const { keyCode } = e;
                if (keyCode == 13) {
                    let { points, pointWraps, polygon } = this.state;
                    if (points.length > 2) {
                        const lines = polygon.getLinePath(points);
                        const wl = pointWraps.length;
                        const obj = { points, lines };

                        pointWraps.push(obj);
                        polygon.createPolygonPath({ ...this.getBasePolygonParam(), cf: true });
                        points = [];
                        // 吐出新数据
                        this.setState({
                            pointWraps,
                            points
                        });
                    }
                }
            },
            { passive: true }
        );
    }

    getBasePolygonParam = () => {
        return {
            pointWraps: this.state.pointWraps,
            points: this.state.points,
            checkedIndex: this.state.checkedIndex,
            currentChecked: this.state.currentDot,
            fc: this.state.FC,
            sc: this.state.SC,
            cfc: this.state.CFC,
            csc: this.state.CSC,
            mfc: this.state.MFC,
            msc: this.state.MSC,
            checkedFc: this.state.CHECKEDFC,
            checkedSc: this.state.CHECKEDSC,
            ftf: this.state.FILLTEXTFLAG,
            al: this.state.ALPHA,
            cal: this.state.CALPHA
        };
    };

    handleMouseDown = event => {
        const loc = this.state.polygon.windowToCanvas(event.clientX, event.clientY);
        let checkedId = -1;
        if (Object.keys(this.state.currentDot).length <= 0) {
            checkedId = this.state.polygon.checkDotInPath(this.state.pointWraps, loc);
            this.setState({
                checkedIndex: checkedId
            });
        }
        if (checkedId == -1) {
            // 证明数据没有被选中
            // 当成点存储

            const { points } = this.state;
            points.push(loc);
            this.setState({
                points
            });
        } else {
            // 选中
            // 如果是选中状态
            const { pointWraps, polygon } = this.state;
            const current = polygon.calcDotNearLine(pointWraps, checkedId, loc, 10);
            if (current.index > -1) {
                // 说明已经存在靠近鼠标点的线段
                polygon.editPoints({ ...this.getBasePolygonParam(), currentChecked: current });
                this.setState({
                    currentDot: current
                });
            } else {
                polygon.drawAllCheckedPath({ ...this.getBasePolygonParam(), checkedIndex: checkedId });
            }
        }
    };

    handleMouseUp = event => {

        this.setState({
            
            currentDot:{}
        });

    };

    handleMouseMove = event => {
        const { polygon, pointWraps, checkedIndex } = this.state;
        const loc = polygon.windowToCanvas(event.clientX, event.clientY);
        event.preventDefault();
        if (this.state.points.length > 0) {
            if (this.state.checkedIndex <= -1) {
                polygon.createMovePolygonPath({ ...this.getBasePolygonParam(), loc });
            }
        } else {
            if (this.state.checkedIndex > -1) {
                if (Object.keys(this.state.currentDot).length > 0) {
                    polygon.editMovePoints({
                        ...this.getBasePolygonParam(),
                        currentChecked: this.state.currentDot,
                        loc
                    });
                } else {
                    // 存在选中点
                    // 判断鼠标点是不是在线附近
                    const current = polygon.calcDotNearLine(pointWraps, checkedIndex, loc, 10);

                    if (current.index > -1) {
                        // 点在线附近
                        polygon.drawMouseMovePoints({ ...this.getBasePolygonParam(), currentChecked: current });
                    }
                }
            }
        }
    };

    render() {
        return (
            <div>
                <canvas
                    className={styles.canvas}
                    width="2000"
                    height="700"
                    id="canvas"
                    onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.handleMouseUp}
                />
            </div>
        );
    }
}

export default Draw;
