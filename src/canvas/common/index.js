class Canvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }
    windowToCanvas(x, y) {
        const bbox = this.canvas.getBoundingClientRect();
        return {
            x: x - bbox.left * (this.canvas.width / bbox.width),
            y: y - bbox.top * (this.canvas.height / bbox.height)
        };
    }

    /**
     * 画图片
     * @param {img} img
     * @param {imgX} 图片所在x信息
     * @param {imgY} 图片所在y信息
     * @param {imgScale} 放大倍数
     */
    drawImage(img, imgX, imgY, imgScale) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (img) {
            this.context.globalAlpha = 1;
            this.context.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                imgX,
                imgY,
                img.width * imgScale,
                img.height * imgScale
            );
        }
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
            var pos = that.windowToCanvas(event.clientX, event.clientY);
            that.canvas.onmousemove = function(evt) {
                that.canvas.style.cursor = 'move';
                var posl = that.windowToCanvas(evt.clientX, evt.clientY);
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
        var pos = that.windowToCanvas(x, y);
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
    }

    /**
     * 判断当前点是否在图片外
     * @param {Object} point
     * @param {img} img
     * @param {Number} diffX
     * @param {Number} diffY
     */
    judgePointInImg(point, zoom = 1, img = this.canvas, diffX = 0, diffY = 0) {
        const { x, y } = point;
        const width = img.width * zoom;
        const height = img.height * zoom;
        const minX = diffX;
        const maxX = diffX + width;
        const minY = diffY;
        const maxY = diffY + height;

        if (minX <= x && x <= maxX && (minY <= y && y <= maxY)) {
            return true;
        }
        return false;
    }

    /**
     * 计算两点之间距离 绝对值
     * @param {Object} p1
     * @param {Object} p2
     */

    calLineLen(p1, p2) {
        const x1 = p1.x || 0;
        const x2 = p2.x || 0;
        const y1 = p1.y || 0;
        const y2 = p2.y || 0;

        return parseInt(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
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
        if (this.judgePointInImg(p1, zoom, img, diffX, diffY) && this.judgePointInImg(p2, zoom, img, diffX, diffY)) {
            this.context.beginPath();
            this.context.lineWidth = lw;
            this.context.moveTo(p1.x, p1.y);
            this.context.lineTo(p2.x, p2.y);
            const text = this.calLineLen(p1, p2);
            this.context.font = '20px Georgia';
            this.context.strokeStyle = sc;
            this.context.fillStyle = fc;
            this.context.stroke();
            this.context.fillText(text, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
        }
    }

    /**
     * 清空画布公共方法
     */
    clearAllRect() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * 获取最小x点和最大x点左边   获取最小y点和最大y点
     * @param {List} points
     */
    getDuration(points, diffX, diffY) {
        const xList = points.map(val => val.x + diffX);
        const yList = points.map(val => val.y + diffY);
        const xMin = Math.min(...xList);
        const xMax = Math.max(...xList);
        const yMin = Math.min(...yList);
        const yMax = Math.max(...yList);
        return {
            xMin,
            xMax,
            yMin,
            yMax
        };
    }

    /**
     *
     * @param {Object} points
     * @param {Object} currentPoint
     * 绘制当前数组路径，并判断当前点是否在当前路径中
     */
    getPath(points, currentPoint, zoom = 1, diffX = 0, diffY = 0) {
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
     * 判断鼠标点靠近哪个点
     * @param {Point} dot
     * @param {List} pointWraps
     * @param { Number } checkedIndex
     * @param { Number } threshold
     */
    judgeNearLeastDot(pointWraps, checkedIndex, dot, threshold = 10, zoom) {
        const currentLines = pointWraps[checkedIndex].lines || [];

        const results = [];
        const resultsMap = {};
        for (let i = 0, len = currentLines.length; i < len; i++) {
            const x2 = dot.x ? dot.x : 0;
            const y2 = dot.y ? dot.y : 0;
            const p1 = currentLines[i].p1;
            const p2 = currentLines[i].p2;
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

            if ((p1.x <= x && x <= p2.x) || (p2.x <= x && x <= p1.x)) {
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

    /**
     * 绘制多边形路径
     * @param {Array} points
     * @param {Boolean} flag
     * @param {Boolean} fill
     * @param { String } fillColor
     * @param { String } strokeColor
     *
     */

    drawPath(
        pointObj,
        flag,
        fill,
        fillColor,
        strokeColor,
        fillTextFlag = true,
        globalAlpha = 0.2,
        zoom = 1,
        diffX = 0,
        diffY = 0
    ) {
        this.context.lineWidth = 1;
        this.context.globalAlpha = 1;
        const { points = [] } = pointObj;
        if (points.length > 0) {
            this.context.beginPath();

            this.context.moveTo(points[0].x * zoom + diffX, points[0].y * zoom + diffY);
            for (let i = 1; i < points.length; ++i) {
                this.context.lineTo(points[i].x * zoom + diffX, points[i].y * zoom + diffY);
            }
            if (flag) {
                this.context.closePath();
            }
            if (pointObj.color) {
                this.context.strokeStyle = pointObj.color;
            } else {
                this.context.strokeStyle = strokeColor;
            }
            this.context.stroke();
            if (fill) {
                if (pointObj.color) {
                    this.context.fillStyle = pointObj.color;
                } else {
                    this.context.fillStyle = fillColor;
                }

                this.context.globalAlpha = globalAlpha;
                this.context.fill();
            }
            if (fillTextFlag) {
                if (pointObj.formLabelArr) {
                    let text = pointObj.id + '-';
                    pointObj.formLabelArr.forEach((val, index) => {
                        let str = '';
                        if (Object.prototype.toString.call(val.value) == '[object Array]') {
                            str = val.value.join(',');
                        } else {
                            str = val.value;
                        }
                        text += str;
                        if (index != pointObj.formLabelArr.length - 1) {
                            text += '-';
                        }
                    });

                    this.context.textAlign = 'center';
                    this.context.textBaseline = 'middle';
                    this.context.fillStyle = 'white';
                    this.context.globalAlpha = 1;
                    const { xMin = 0, xMax = 0, yMin = 0, yMax = 0 } = this.getDuration(
                        points.map(val => {
                            return { x: val.x * zoom, y: val.y * zoom };
                        }),
                        diffX,
                        diffY
                    );
                    this.context.font = '14px PingFang-SC-Regular';
                    this.context.fillText(text, (xMin + xMax) / 2, (yMin + yMax) / 2);
                }
            }
        }
    }
}

/**
 * 参数配置统一说明
 *
 * 绘制状态下画图
 * params:{
 *  pointWraps: 所有框的数据点 不包括当前正在绘制框的数据,
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
 *
 */

class Polygon extends Canvas {
    constructor(canvas) {
        super(canvas);
    }
    /**
     * 绘制状态下画图
     * params:{
     *  pointWraps: 所有框的数据点 不包括当前正在绘制框的数据,
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
        const { pointWraps, points, cf, fc, sc, ftf, al, zoom, img, diffX, diffY } = params;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawImage(img, diffX, diffY, zoom);
        if (pointWraps.length > 0) {
            pointWraps.forEach(val => {
                this.drawPath(val, true, true, fc, sc, ftf, al, zoom, diffX, diffY);
            });
        }
        if (points.length > 0) {
            this.drawPath({ points }, cf, false, fc, sc, ftf, al, zoom, diffX, diffY);
        }
    }

    /**
     * 绘制状态下鼠标move状态下画图
     *  loc: 当前鼠标点位置
     */
    createMovePolygonPath(params) {
        const { pointWraps, points, loc = { x: 0, y: 0 }, fc, sc, ftf, al, zoom, img, diffX, diffY } = params;

        this.createPolygonPath({
            pointWraps,
            points,
            cf: false,
            fc,
            sc,
            ftf,
            al,
            zoom,
            img,
            diffX,
            diffY
        });

        this.context.lineTo(loc.x, loc.y);
        this.context.closePath();

        this.context.stroke();
    }

    /**
     *绘制正常状态中的选中图形状态
     * @param {List} points
     * @param { Number } checkDotIndex
     * @param { String } fillColor
     * @param { String } strokeColor
     */

    drawCheckedPath(pointObj, checkDotIndex, fc, sc, cfc, csc, mfc, msc, ftf, al, zoom = 1, diffX = 0, diffY = 0) {
        const { points = [] } = pointObj;
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
        this.drawPath(pointObj, true, true, fc, sc, ftf, al, zoom, diffX, diffY);
    }

    /**
     * 返回当前点击的点 在哪条路径中
     * @param {Object} currentPoint
     */
    checkDotInPath(pointWraps, currentPoint, zoom, diffX, diffY) {
        for (let i = pointWraps.length - 1; i > -1; --i) {
            if (this.getPath(pointWraps[i].points, currentPoint, zoom, diffX, diffY)) {
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
            pointWraps,
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
            diffY
        } = params;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.drawImage(img, diffX, diffY, zoom);
        if (pointWraps.length > 0) {
            pointWraps.forEach((val, index) => {
                if (checkedIndex != index) {
                    this.drawPath(val, true, true, fc, sc, ftf, al, zoom, diffX, diffY);
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
    }

    /**
     * 计算点是否在线左右  阈值可设置
     * @param {Number} threshold
     * @param { List<Point> } pointWraps
     * @param { Number } checkedIndex
     */

    calcDotNearLine(pointWraps, checkedIndex, dot, threshold = 5, zoom = 1) {
        //判断此点距离哪个点最近
        if (pointWraps.length > 0) {
            const result = this.judgeNearLeastDot(pointWraps, checkedIndex, dot, 10, zoom);
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
    getLinePath(points, zoom = 1, diffX = 0, diffY = 0) {
        const lines = [];
        for (let i = 0, len = points.length; i < len; i++) {
            if (i < len - 1) {
                lines.push({
                    p1: { x: points[i].x * zoom + diffX, y: points[i].y * zoom + diffY },
                    p2: { x: points[i + 1].x * zoom + diffX, y: points[i + 1].y * zoom + diffY }
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
        const { pointWraps, currentChecked, zoom, diffX, diffY, img } = params;
        const checkedIndex = currentChecked.checkedIndex;
        // 第几条线
        const index = currentChecked.index;
        const dot = currentChecked.dot;
        const vertex = currentChecked.vertex;
        let checkDotIndex = index + vertex;
        if (this.judgePointInImg(dot, zoom, img, diffX, diffY)) {
            if (vertex == -1) {
                // 说明不是个顶点

                pointWraps[checkedIndex].points.splice(index + 1, 0, {
                    x: (dot.x - diffX) / zoom,
                    y: (dot.y - diffY) / zoom
                });
                const lines = this.getLinePath(pointWraps[checkedIndex].points, zoom, diffX, diffY);
                pointWraps[checkedIndex].lines = lines;
                checkDotIndex = index + 1;
            }
            // 重绘
            this.drawAllCheckedPath({ ...params, checkDotIndex, checkedIndex });
        }
    }
    /**
     * 鼠标移动时将点数据动态更新到数组中  修改了数据信息
     *
     * params
     */
    editMovePoints(params) {
        const { pointWraps, currentChecked, loc, zoom = 1, diffX = 0, diffY = 0, img } = params;
        if (this.judgePointInImg(loc, zoom, img, diffX, diffY)) {
            const checkedIndex = currentChecked.checkedIndex;
            // 第几条线
            const index = currentChecked.index;
            const vertex = currentChecked.vertex;
            let checkDotIndex = vertex + index;
            if (vertex == -1) {
                // 说明不是个顶点
                pointWraps[checkedIndex].points[index + 1] = {
                    x: (loc.x - diffX) / zoom || 0,
                    y: (loc.y - diffY) / zoom || 0
                };
                checkDotIndex = index + 1;
            } else {
                // 说明是个顶点
                const i = index + vertex;
                pointWraps[checkedIndex].points[i] = { x: (loc.x - diffX) / zoom || 0, y: (loc.y - diffY) / zoom || 0 };
            }
            const lines = this.getLinePath(pointWraps[checkedIndex].points, zoom, diffX, diffY);
            pointWraps[checkedIndex].lines = lines;
            // 重绘
            this.drawAllCheckedPath({ ...params, checkedIndex, checkDotIndex });
        }
    }
    /**
     *
     * @param {Object} params
     */
    drawMouseMovePoints(params) {
        const { mfc, currentChecked } = params;
       
        this.drawAllCheckedPath({ ...params, checkDotIndex: -1 });

        if (currentChecked && currentChecked.dot) {
            const dot = currentChecked.dot;
            const x = dot.x;
            const y = dot.y;

            this.context.beginPath();
            this.context.moveTo(x, y);
            this.context.globalAlpha = 1;
            this.context.fillStyle = mfc;
            this.context.arc(x, y, 2.5, 0, 2 * Math.PI, false);
            this.context.fill();
        }
    }
}

export { Polygon, Canvas };
