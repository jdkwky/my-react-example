import { calLineLen, windowToCanvas, judgePointInImg, getDurationPoints } from './utils/index';
import { message } from 'antd';

class Canvas {
    constructor(width = 2000, height = 700) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }
    mounted(id) {
        const $canvasWrap = document.getElementById(id);
        $canvasWrap.appendChild(this.canvas);
        return this;
    }
    /**
     * 清空画布公共方法
     */
    clearRect() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return this;
    }
    /**
     *
     * @param {*} points
     * @param {*} currentPoint
     * @param {*} zoom
     * @param {*} diffX
     * @param {*} diffY
     * return 返回当前点是否在路径中
     */
    isPointInPath(points, currentPoint, zoom = 1, diffX = 0, diffY = 0) {
        this.context.beginPath();
        this.context.moveTo(points[0].x * zoom + diffX, points[0].y * zoom + diffY);
        for (let i = points.length - 1; i > -1; --i) {
            this.context.lineTo(points[i].x * zoom + diffX, points[i].y * zoom + diffY);
        }
        this.context.closePath();
        if (this.context.isPointInPath(currentPoint.x, currentPoint.y)) {
            return true;
        }
    }

    /**
     * 画图片
     * @param {image} image
     * @param {dx} 绘制图片左上角x信息
     * @param {dy} 绘制图片左上角y信息
     * @param {scale} 放大倍数
     */
    drawImage(image, dx, dy, scale) {
        this.clearRect();

        if (image) {
            this.context.globalAlpha = 1;
            let imgWidth = image.width;
            let imgHeight = image.height;
            this.context.drawImage(image, 0, 0, imgWidth, imgHeight, dx, dy, imgWidth * scale, imgHeight * scale);
        }
        return this;
    }

    /**
     * 监听点击拖拽图片
     * @param {img} img
     */
    canvasEventDrag(img) {
        var imgX = 0,
            imgY = 0,
            imgScale = 1;
        const that = this;
        that.canvas.onmousedown = function(event) {
            var pos = windowToCanvas(event.clientX, event.clientY, this.canvas);
            that.canvas.onmousemove = function(evt) {
                that.canvas.style.cursor = 'move';
                var posl = windowToCanvas(evt.clientX, evt.clientY, this.canvas);
                var x = posl.x - pos.x;
                var y = posl.y - pos.y;
                pos = posl;
                imgX += x;
                imgY += y;
                that.drawImage(img, imgX, imgY, imgScale);
            };
            that.canvas.onmouseup = function() {
                that.canvas.onmousemove = null;
                that.canvas.onmouseup = null;
                that.canvas.style.cursor = 'default';
            };
        };
    }
    /**
     * 图片放大缩小
     * @param {scale} 缩放倍数
     */
    zoomImage(img, scale, x, y) {
        const that = this;
        // let imgX=0,imgY=0
        var pos = windowToCanvas(x, y, this.canvas);
        if (scale > 0) {
            // imgScale *= scale;
            that.imgX = that.imgX * scale - pos.x;
            that.imgY = that.imgY * scale - pos.y;
        } else {
            // imgScale *= scale;
            that.imgX = that.imgX * scale + pos.x * scale;
            that.imgY = that.imgY * scale + pos.y * scale;
        }
        that.drawImage(img, that.imgX, that.imgY, scale); //重新绘制图片
        return this;
    }

    /**
     * param0:{
     * p1:点1坐标
     * p2:点2坐标
     * sc:描边颜色
     * fc:填充颜色
     * }
     * 画标尺坐标点
     * @param {Object} param0
     */
    drawStaff({ p1 = {}, p2 = {}, fc, sc, lw, zoom, img, diffX, diffY }) {
        if (
            judgePointInImg({ x: p1.x * zoom + diffX, y: p1.y * zoom + diffY }, zoom, img, diffX, diffY) &&
            judgePointInImg({ x: p2.x * zoom + diffX, y: p2.y * zoom + diffY }, zoom, img, diffX, diffY)
        ) {
            this.context.beginPath();
            this.context.globalAlpha = 1;
            this.context.lineWidth = lw;

            this.context.moveTo(parseFloat(p1.x * zoom + diffX), parseFloat(p1.y * zoom + diffY));
            this.context.lineTo(parseFloat(p2.x * zoom + diffX), parseFloat(p2.y * zoom + diffY));

            const text = calLineLen(p1, p2);
            this.context.font = '20px Georgia';
            this.context.strokeStyle = sc;
            this.context.fillStyle = fc;
            this.context.stroke();
            this.context.fillText(
                text,
                parseFloat((p1.x * zoom + diffX + p2.x * zoom + diffX) / 2),
                parseFloat((p1.y * zoom + diffY + p2.y * zoom + diffY) / 2)
            );
        }
        return this;
    }

    /**
     * 判断鼠标点靠近哪个点
     * @param {Point} dot
     * @param {List} coordinates
     * @param { Number } checkedIndex
     * @param { Number } threshold
     */
    judgeNearLeastDot(coordinates, checkedIndex, dot, threshold = 10, zoom=1, diffX = 0, diffY = 0) {
        const currentLines = this.getLinePath(coordinates[checkedIndex], zoom, diffX, diffY);

        const results = [];
        const resultsMap = {};
        for (let i = 0, len = currentLines.length; i < len; i++) {
            const x2 = dot.x ? dot.x : 0;
            const y2 = dot.y ? dot.y : 0;
            const p1 = currentLines[i].p1;
            const p2 = currentLines[i].p2;
            if (
                ((p1.x <= x2 && x2 <= p2.x) || (p2.x <= x2 && x2 <= p1.x)) &&
                ((p1.y <= y2 && y2 <= p2.y) || (p2.y <= y2 && y2 <= p1.y))
            ) {
                const slop = this.calSlop(p1, p2);
                const verSlop = this.calVerticalSlop(slop);
                let x = 0;
                let y = 0;
                const x1 = p1.x || 0;
                const y1 = p1.y || 0;

                if (slop != 0 && verSlop != 0) {
                    if (y2 == slop * x2 + p1.y - slop * p1.x) {
                        // 点在当前直线上
                        x = x2;
                        y = y2;
                    } else {
                        x = parseFloat((y2 - y1 + slop * x1 - verSlop * x2) / (slop - verSlop));
                        y = parseFloat(slop * x + y1 - slop * x1);
                    }
                } else {
                    // 垂直于x轴或平行于x轴
                    if (p1.x == p2.x) {
                        // 平行于y轴
                        x = p1.x;
                        y = y2;
                    } else if (p1.y == p2.y) {
                        // 平行于x轴
                        x = x2;
                        y = p1.y;
                    }
                }

                if (
                    (p1.x <= x && x <= p2.x) ||
                    (p2.x <= x && x <= p1.x && (p1.y <= y && y <= p2.y)) ||
                    (p2.y <= y && y <= p1.y)
                ) {
                    const l = parseInt(Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2)));

                    // x y 焦点
                    let vertex = -1;
                    if (l < 10) {
                        // 说明是点在线上
                        const l1 = parseInt(Math.sqrt(Math.pow(p1.x - x2, 2) + Math.pow(p1.y - y2, 2)));
                        const l2 = parseInt(Math.sqrt(Math.pow(p2.x - x, 2) + Math.pow(p2.y - y, 2)));
                        if (l1 < threshold) {
                            x = p1.x;
                            y = p1.y;
                            vertex = 0;
                        } else if (l2 < threshold) {
                            x = p2.x;
                            y = p2.y;
                            vertex = 1;
                        }
                    }

                    results.push(l);
                    resultsMap[l] = {
                        index: i,
                        value: l,
                        dot: {
                            x,
                            y
                        },
                        checkedIndex,
                        vertex
                    };
                }
            }
        }

        if (results.length > 0) {
            const min = Math.min(...results);

            return resultsMap[min];
        }
        return null;
    }

    /**
     * 计算靠近两个点的斜率
     *
     * @param {Point} line1
     * @param {Point} line2
     */
    calSlop(line1, line2) {
        if (line1.x - line2.x != 0) {
            return parseFloat((line1.y - line2.y) / (line1.x - line2.x));
        }
        return 0;
    }
    /**
     * 计算垂线的斜率
     * @param {Number} slop
     */
    calVerticalSlop(slop) {
        if (slop != 0) {
            return parseFloat(-1 / slop);
        }
        return 0;
    }

    fillContentText(fillText, points, zoom, diffX, diffY) {
        if (fillText != null) {
            this.context.textAlign = 'center';
            this.context.textBaseline = 'middle';
            this.context.fillStyle = 'white';
            this.context.globalAlpha = 1;
            this.context.lineWidth = 1;
            const { xMin = 0, xMax = 0, yMin = 0, yMax = 0 } = getDurationPoints(
                points.map(val => {
                    return { x: val.x * zoom, y: val.y * zoom };
                }),
                diffX,
                diffY
            );
            this.context.font = '14px PingFang-SC-Regular';
            this.context.fillText(fillText, (xMin + xMax) / 2, (yMin + yMax) / 2);
        }
        return this;
    }

    /**
     * 绘制多边形路径
     * @param {Array} points
     * @param {Boolean} flag
     * @param {Boolean} fill
     * @param { String } fillColor
     * @param { String } strokeColor
     */
    drawPath(
        points,
        flag,
        fill,
        fillColor,
        strokeColor,
        fillText,
        globalAlpha = 0.2,
        zoom = 1,
        diffX = 0,
        diffY = 0
    ) {
        this.context.lineWidth = 1;
        this.context.globalAlpha = 1;
        if (points.length > 0) {
            this.context.beginPath();

            this.context.moveTo(points[0].x * zoom + diffX, points[0].y * zoom + diffY);
            for (let i = 1; i < points.length; ++i) {
                this.context.lineTo(points[i].x * zoom + diffX, points[i].y * zoom + diffY);
            }
            if (flag) {
                this.context.closePath();
            }

            this.context.strokeStyle = strokeColor;
            this.context.stroke();
            if (fill) {
                this.context.fillStyle = fillColor;

                this.context.globalAlpha = globalAlpha;
                this.context.fill();
            }
            if (fillText != null) {
                // 标签可见
                this.fillContentText(fillText, points, zoom, diffX, diffY);
            }
        }
        return this;
    }
}

/**
 * 参数配置统一说明
 *
 * 绘制状态下画图
 * params:{
 *  coordinates: 所有框的数据点 不包括当前正在绘制框的数据,
 *  points: 当前绘制的数据点
 *  cf: closeFlag是否闭合路径flag
 *  fc: fillColor 填充颜色
 *  sc: strokeColor 描边颜色
 *  ftf: fillTextFlag 是否显示回填文本信息
 *  al: globalAlpha 透明度
 *  zoom: 放大缩小倍数
 *  img: 背景图片
 *  diffX: 距离原点 X 的拖拽距离
 *  diffY: 距离远点 Y 的拖拽距离
 * }
 * 多边形绘制
 */

class Polygon extends Canvas {
    constructor(canvas) {
        super(canvas);
        this.multiPolygonInfo = {
            type: 'MultiPolygon',
            coordinates: []
        }; // 多边形数据存储
        this.coordinate = []; // 正在绘制的对变形数据
        this.currentDot = {}; // 当前被选中的对象
        this.checkedIndex = -1; // 当前选中图形id
        this.FC = 'rgba(239,53,62,1)'; // 默认填充颜色
        this.SC = '#EF353E'; // 默认描边颜色
        this.CFC = '#e5e5e5'; // 顶点填充色
        this.CSC = '#666'; // 顶点描边颜色
        this.MFC = 'green'; // 移动顶点填充色
        this.MSC = 'green'; // 移动顶点描边色
        this.CHECKEDFC = 'rgba(239,53,62,1)'; // 选中填充色
        this.CHECKEDSC = 'rgba(239,53,62,1)'; // 选中描边色
        this.ALPHA = 0.2; // 默认透明度
        this.CALPHA = 0.5; // 选中透明度
        this.FILLTEXTFLAG = ''; // 是否回填数据信息

        // 初始化event
        this.initEvent();
    }
    /**
     * 绘制状态下画图
     * params:{
     *  coordinates: 所有框的数据点 不包括当前正在绘制框的数据,
     *  points: 当前绘制的数据点
     *  cf: closeFlag是否闭合路径flag
     *  fc: fillColor 填充颜色
     *  sc: strokeColor 描边颜色
     *  ftf: fillTextFlag 是否显示回填文本信息
     *  al: globalAlpha 透明度
     *  zoom: 放大缩小倍数
     *  img: 背景图片
     *  diffX: 距离原点 X 的拖拽距离
     *  diffY: 距离远点 Y 的拖拽距离
     * }
     * @param { Object } params
     */
    createPolygonPath(params) {
        const { coordinates, coordinate, cf, fc, sc, ftf, al, zoom, img, diffX, diffY, timeStamp = 0 } = params;
        this.clearRect();
        this.drawImage(img, diffX, diffY, zoom);
        if (coordinates.length > 0) {
            coordinates.forEach(val => {
                this.drawPath(val, true, true, fc, sc, ftf, al, zoom, diffX, diffY, timeStamp);
            });
        }
        if (coordinate.length > 0) {
            this.drawPath(coordinate, cf, false, fc, sc, ftf, al, zoom, diffX, diffY, timeStamp);
        }
        return this;
    }

    /**
     * 绘制状态下鼠标move状态下画图
     *  loc: 当前鼠标点位置
     */
    createMovePolygonPath(params) {
        const {
            coordinates,
            coordinate,
            timeStamp,
            loc = { x: 0, y: 0 },
            fc,
            sc,
            ftf,
            al,
            zoom,
            img,
            diffX,
            diffY
        } = params;

        this.createPolygonPath({
            coordinates,
            coordinate,
            cf: false,
            fc,
            sc,
            ftf,
            al,
            zoom,
            img,
            diffX,
            diffY,
            timeStamp
        });

        this.context.lineTo(loc.x, loc.y);
        this.context.closePath();

        this.context.stroke();
        return this;
    }

    /**
     *绘制正常状态中的选中图形状态
     * @param {List} points
     * @param { Number } checkDotIndex
     * @param { String } fillColor
     * @param { String } strokeColor
     */

    drawCheckedPath(points, checkDotIndex, fc, sc, cfc, csc, mfc, msc, ftf, al, zoom, diffX, diffY) {
        for (let i = 0; i < points.length; ++i) {
            this.context.beginPath();
            this.context.moveTo(points[i].x * zoom + diffX, points[i].y * zoom + diffY);
            if (checkDotIndex != i) {
                this.context.strokeStyle = csc;
                this.context.arc(points[i].x * zoom + diffX, points[i].y * zoom + diffY, 2.5, 0, 2 * Math.PI, true);
                this.context.fillStyle = cfc;
                this.context.fill();
                this.context.stroke();
            } else if (checkDotIndex == i) {
                // 正在移动的点
                this.context.strokeStyle = msc;
                this.context.arc(points[i].x * zoom + diffX, points[i].y * zoom + diffY, 2.5, 0, 2 * Math.PI, true);
                this.context.fillStyle = mfc;
                this.context.fill();
                this.context.stroke();
            }
        }
        // 画线段
        this.drawPath(points, true, true, fc, sc, ftf, al, zoom, diffX, diffY);
        return this;
    }

    /**
     * 返回当前点击的点 在哪条路径中
     * @param {Object} currentPoint
     */
    checkDotInPath(coordinates, currentPoint, zoom, diffX, diffY, timeStamp) {
        for (let i = coordinates.length - 1; i > -1; --i) {
            if (this.isPointInPath(coordinates[i], currentPoint, zoom, diffX, diffY)) {
                return i;
            }
        }
        return -1;
    }
    /**
     * 绘制非编辑状态情况下路径
     *
     * checkedIndex: 当前选中的路径
     * checkDotIndex : 当前选中的点左边
     *
     */
    drawAllCheckedPath(params) {
        const {
            coordinates,
            checkedIndex,
            checkDotIndex,
            fc,
            sc,
            cfc,
            csc,
            mfc,
            msc,
            checkedFc,
            checkedSc,
            ftf,
            al,
            cal,
            zoom,
            img,
            diffX,
            diffY,
            timeStamp = 0
        } = params;
        this.clearRect();
        this.drawImage(img, diffX, diffY, zoom);
        if (coordinates.length > 0) {
            coordinates.forEach((val, index) => {
                if (checkedIndex != index) {
                    this.drawPath(val, true, true, fc, sc, ftf, al, zoom, diffX, diffY, timeStamp);
                } else {
                    this.drawCheckedPath(
                        val,
                        checkDotIndex,
                        checkedFc,
                        checkedSc,
                        cfc,
                        csc,
                        mfc,
                        msc,
                        ftf,
                        cal,
                        zoom,
                        diffX,
                        diffY
                    );
                }
            });
        }
        return this;
    }

    /**
     * 计算点是否在线左右  阈值可设置
     * @param {Number} threshold
     * @param { List<Point> } coordinates
     * @param { Number } checkedIndex
     * @param diffX 底层差值x
     * @param diffY  底层差值y
     */

    calcDotNearLine(coordinates, checkedIndex, dot, threshold = 5, zoom = 1, diffX = 0, diffY = 0) {
        //判断此点距离哪个点最近
        if (coordinates.length > 0) {
            const result = this.judgeNearLeastDot(coordinates, checkedIndex, dot, 10, zoom, diffX, diffY);
            if (result && result.value <= threshold) {
                return result;
            }
        }
        return {};
    }
    /**
     * 将一组多边形中的线段两两连线
     * @param {Object} points
     */
    getLinePath(points, zoom, diffX, diffY) {
        const lines = [];
        for (let i = 0, len = points.length; i < len; i++) {
            if (i < len - 1) {
                lines.push({
                    p1: { x: points[i].x * zoom + diffX, y: points[i].y * zoom + diffY },
                    p2: {
                        x: points[i + 1].x * zoom + diffX,
                        y: points[i + 1].y * zoom + diffY
                    }
                });
            } else {
                lines.push({
                    p1: { x: points[i].x * zoom + diffX, y: points[i].y * zoom + diffY },
                    p2: { x: points[0].x * zoom + diffX, y: points[0].y * zoom + diffY }
                });
            }
        }
        return lines;
    }
    /**
     * 将编辑图形时产生的点放入到大数组中  修改了数据信息
     *
     * params
     *
     */
    editPoints(params) {
        const { coordinates, currentChecked, zoom=1, diffX=0, diffY=0, img, timeStamp = 0 } = params;
        const checkedIndex = currentChecked.checkedIndex;
        // 第几条线
        const index = currentChecked.index;
        const dot = currentChecked.dot;
        const vertex = currentChecked.vertex;
        let checkDotIndex = index + vertex;
        if (judgePointInImg(dot, zoom, img, diffX, diffY)) {
            if (vertex == -1) {
                // 说明不是个顶点

                coordinates[checkedIndex].splice(index + 1, 0, {
                    x: (dot.x - diffX) / zoom,
                    y: (dot.y - diffY) / zoom
                });
                // const lines = this.getLinePath(coordinates[checkedIndex], zoom, diffX, diffY);
                // coordinates[checkedIndex].lines = lines;
                checkDotIndex = index + 1;
            }
            // 重绘
            this.drawAllCheckedPath({
                ...params,
                checkDotIndex,
                checkedIndex,
                timeStamp
            });
        }
        return this;
    }
    /**
     * 鼠标移动时将点数据动态更新到数组中  修改了数据信息
     *
     * params
     */
    editMovePoints(params) {
        const { coordinates, currentChecked, loc, zoom=1, diffX=0, diffY=0, img, timeStamp } = params;
        if (judgePointInImg(loc, zoom, img, diffX, diffY)) {
            const checkedIndex = currentChecked.checkedIndex;
            // 第几条线
            const index = currentChecked.index;
            const vertex = currentChecked.vertex;
            
            let checkDotIndex = vertex + index;
            if (vertex == -1) {
                // 说明不是个顶点
                coordinates[checkedIndex][index + 1] = {
                    x: (loc.x - diffX) / zoom || 0,
                    y: (loc.y - diffY) / zoom || 0
                };
                checkDotIndex = index + 1;
            } else {
                // 说明是个顶点
                const i = index + vertex;
                coordinates[checkedIndex][i] = {
                    x: (loc.x - diffX) / zoom || 0,
                    y: (loc.y - diffY) / zoom || 0
                };
            }
            // 重绘
            this.drawAllCheckedPath({
                ...params,
                checkedIndex,
                checkDotIndex,
                timeStamp
            });
        }
        return this;
    }
    /**
     * 绘制自动检测的点坐标
     * @param {Object} params
     */
    drawMouseMovePoints(params) {
        const { mfc, currentChecked, timeStamp = 0 } = params;

        this.drawAllCheckedPath({ ...params, checkDotIndex: -1, timeStamp });

        if (currentChecked && currentChecked.dot) {
            const dot = currentChecked.dot;
            const x = dot.x;
            const y = dot.y;
            this.context.beginPath();
            this.context.moveTo(x, y);
            this.context.fillStyle = mfc;
            this.context.arc(x, y, 2.5, 0, 2 * Math.PI, false);
            this.context.fill();
        }
        return this;
    }
    /**
     * 原图可见 或者 结果可见之后  需要将在点击原图可见或者结果可见之后的图形显示出来 之后画的图形既包括填充描边也包括文字填充
     * @param {*} params
     * timeStamp 点击原图可见或者结果可见的时间戳
     */
    drawPolygonAfterTimeStamp(params) {
        const { coordinates, coordinate, timeStamp, cf, fc, sc, ftf, al, zoom, img, diffX, diffY } = params;
        this.clearRect();
        this.drawImage(img, diffX, diffY, zoom);
        if (coordinates.length > 0) {
            coordinates.forEach(val => {
                if (val.timeStamp >= timeStamp) {
                    this.drawPath(val, true, true, fc, sc, ftf, al, zoom, diffX, diffY, timeStamp);
                }
            });
        }
        if (coordinate.length > 0) {
            this.drawPath(coordinate, cf, false, fc, sc, ftf, al, zoom, diffX, diffY, timeStamp);
        }
        return this;
    }
    // 获取基本配置参数

    getBasePolygonParam = () => {
        return {
            coordinates: this.multiPolygonInfo.coordinates,
            coordinate: this.coordinate,
            checkedIndex: this.checkedIndex,
            currentChecked: this.currentDot,
            fc: this.FC,
            sc: this.SC,
            cfc: this.CFC,
            csc: this.CSC,
            mfc: this.MFC,
            msc: this.MSC,
            checkedFc: this.CHECKEDFC,
            checkedSc: this.CHECKEDSC,
            ftf: this.FILLTEXTFLAG,
            al: this.ALPHA,
            cal: this.CALPHA
        };
    };

    /** start draw Polygon Event */
    initEvent() {
        this.drawPolygonMousemoveEvent();
        this.drawPolygonMousedownEvent();
        this.drawPolygonMouseupEvent();
        this.enterEvent();
    }

    drawPolygonMousedownEvent() {
        try {
            this.canvas.addEventListener('mousedown', event => {
                const loc = windowToCanvas(event.clientX, event.clientY, this.canvas);
                
                let checkedIndex =  this.checkDotInPath(this.multiPolygonInfo.coordinates, loc);
                
                if (Object.keys(this.currentDot).length <= 0  || checkedIndex == -1 ) {
                    // 说明当前点并不是在线上
                    
                    this.checkedIndex  = checkedIndex;
                    if (checkedIndex == -1 || this.coordinate.length >0) {
                        // 证明没有面被选中
                        // 当成点存储
                        this.coordinate.push(loc);
                    } else {
                        // 点在面上
                        const currentDot = this.calcDotNearLine(
                            this.multiPolygonInfo.coordinates,
                            checkedIndex,
                            loc,
                            10
                        );
                        this.currentDot = currentDot;
                        if (this.currentDot.index > -1) {
                            // 说明存在靠近鼠标点线段， 即需要点 线匹配
                            this.editPoints({ ...this.getBasePolygonParam(), currentChecked: currentDot });
                            this.canvas.addEventListener('mousemove', (event)=>{
                                const { buttons } = event;
                                if(buttons !=0  && this.coordinate.length == 0){
                                    this.drawPolygonMousedownMoveEvent(event);
                                }
                            });
                        } else {
                            //没有靠近鼠标点的线段 即鼠标点在平面中
                            
                            this.drawAllCheckedPath({ ...this.getBasePolygonParam(), checkedIndex: this.checkedIndex });
                        }
                    }
                }else if(Object.keys(this.currentDot).length > 0){
                    
                        
                        if(this.checkedIndex === checkedIndex) {
                            if (this.currentDot.index > -1) {
                                // 说明存在靠近鼠标点线段， 即需要点 线匹配
                                this.checkedIndex = this.currentDot.checkedIndex;
                                this.editPoints({ ...this.getBasePolygonParam(), currentChecked: this.currentDot });
                                this.canvas.addEventListener('mousemove', (event)=>{
                                    const { buttons } = event;
                                    if(buttons !=0  && this.coordinate.length == 0){
                                        this.drawPolygonMousedownMoveEvent(event);
                                    }
                                });
                            } 
                        }
                        //没有靠近鼠标点的线段 即鼠标点在平面中
                        this.checkedIndex = checkedIndex;
                        this.drawAllCheckedPath({ ...this.getBasePolygonParam(), checkedIndex: this.checkedIndex });
                        // this.currentDot ={};
                }
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    drawPolygonMousedownMoveEvent (event) {
        const loc = windowToCanvas(event.clientX, event.clientY, this.canvas);
        this.editMovePoints({
            ...this.getBasePolygonParam(),
            currentChecked: this.currentDot,
            loc
        });
    }

    drawPolygonMouseupEvent() {
        try {
            this.canvas.addEventListener('mouseup', () => {
                // this.currentDot = {};
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    drawPolygonMousemoveEvent() {
        try {
            this.canvas.addEventListener('mousemove', () => {
                const { multiPolygonInfo, checkedIndex, coordinate } = this;
                const loc = windowToCanvas(event.clientX, event.clientY, this.canvas);
                event.preventDefault();
                if (coordinate.length > 0) {
                    // 说明是正在绘制新的图形
                    if (this.checkedIndex <= -1) {
                        this.createMovePolygonPath({ ...this.getBasePolygonParam(), loc });
                    } else {
                        // 绘制的是存在选中态的图形
                        this.drawAllCheckedPath({ ...this.getBasePolygonParam(), checkedIndex });
                    }
                } else {
                    if (checkedIndex > -1) {
                        const currentChecked = this.calcDotNearLine(multiPolygonInfo.coordinates, checkedIndex, loc, 10);
                        if (currentChecked.index > -1) {
                            // 点在线附近
                            this.drawMouseMovePoints({ ...this.getBasePolygonParam(), currentChecked });
                            this.currentDot = currentChecked ; // 当前移动点位置
                        } else {
                            // 点不在线附近  需要重新绘制图形
                            if(this.currentDot){
                                this.drawAllCheckedPath({ ...this.getBasePolygonParam(), checkedIndex });
                            }
                        }
                    }
                    // 其余情况属于mouseDown中的mouseUp事件
                }
            });
        } catch (e) {}
    }
    destoryDrawPolygonEvent() {
        this.canvas.removeEventListener('mousedown');
        this.canvas.removeEventListener('mousemove');
        this.canvas.removeEventListener('mouseup');
    }

    enterEvent() {
        document.body.addEventListener(
            'keydown',
            event => {
                const { keyCode } = event;
                if (keyCode == 13) {
                    if (this.coordinate.length > 2) {
                        this.multiPolygonInfo.coordinates.push(this.coordinate);
                        this.coordinate = [];
                    } else {
                        message.error('小于两个点的图形不能存储');
                    }
                }
            },
            {
                passive: true
            }
        );
    }

    /** draw Polygon end Event  */
}

export { Polygon, Canvas };
