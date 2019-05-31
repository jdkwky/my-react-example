/**
 * 计算两点之间距离 绝对值
 * @param {Object} p1
 * @param {Object} p2
 */

export function calLineLen(p1, p2) {
    const x1 = p1.x || 0;
    const x2 = p2.x || 0;
    const y1 = p1.y || 0;
    const y2 = p2.y || 0;

    return parseInt(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
}

/**
 * 获取最小x点和最大x点左边   获取最小y点和最大y点
 * 替代  getDuration
 * @param {List} points
 */

export function getMaxMinPoint(points) {
    const xList = points.map(val => val.x);
    const yList = points.map(val => val.y);
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
 * 窗口坐标转换为canvas坐标
 * @param x
 * @param y
 * @param canvas 当前画布对象
 * @returns {{x: number, y: number}}
 */

export function windowToCanvas(x, y, canvas) {
    let bbox = canvas.getBoundingClientRect(); // 获取canvas元素的边界框
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}

/**
 * 判断当前点是否在图片外
 * @param {Object} point
 * @param {img} img
 * @param {Number} diffX
 * @param {Number} diffY
 */
export function judgePointInImg(point, zoom = 1, img = { width: 0, height: 0 }, diffX, diffY) {
    const { x, y } = point;
    const width = img.width * zoom;
    const height = img.height * zoom;
    const minX = diffX;
    const maxX = diffX + width;
    const minY = diffY;
    const maxY = diffY + height;
    if (width == 0 && height == 0) {
        return true;
    }
    if (minX <= x && x <= maxX && (minY <= y && y <= maxY)) {
        return true;
    }
    return false;
}

/**
 * 获取最小x点和最大x点   获取最小y点和最大y点
 * @param {List} points
 * @param {List} points
 * @param {List} points
 */
export function getDurationPoints(points, diffX, diffY) {
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
