class ImageCanvas {
    constructor(params) {
        const { options, id, url, ratio, ratioStep, ratioMaxTimes } = params;
        const { width, height } = options || {};

        this.canvas = null; // canvas 容器
        this.url = url;  // img url
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.minRatio = this.currentRatio = ratio;   // 最小放大比例 ，当前放大比例
        this.imageOriginWidth = 0;  // 图片原始宽度
        this.imageOriginHeight = 0;  // 图片原始长度
        this.ratioStep = ratioStep || 0.8; // 默认放大缩小比例
        this.maxTimes = ratioMaxTimes || 10; // 最大放大次数
        this.offsetX = 0;
        this.offsetY = 0;
        this.rangeX = 0;
        this.rangeY = 0;
        this.allowMove = false;
        // 创建canvas容器 
        const $wrap = document.getElementById(id);
        if ($wrap) {
            const $canvas = document.createElement('canvas');
            this.setCanvasSize(width, height, $canvas);

            if (!width && !height) {
                // 如果没有 宽和高 则用容器的宽和高做为canvas的默认宽高大小
                const wrapWidth = $wrap.offsetWidth;
                const wrapHeight = $wrap.offsetHeight;
                this.canvasWidth = wrapWidth;
                this.canvasHeight = wrapHeight;
                this.setCanvasSize(wrapWidth, wrapHeight, $canvas);
            }
            $wrap.appendChild($canvas);
            this.canvas = $canvas;
            this.context = $canvas.getContext('2d');
        }
        this.currentPointX = this.canvasWidth / 2;
        this.currentPointY = this.canvasHeight / 2;

        // 设置图片图层
        this.initImageLevel(this.url);

        // 添加canvas事件
        this.initEvents(this.canvas);
    };

    /**
     * set Canvas width and height
     *
     * @param {*} width
     * @param {*} height
     * @param {*} $canvas
     * @memberof ImageCanvas
     */
    setCanvasSize(width, height, $canvas) {
        if (width) {
            $canvas.setAttribute('width', width);
        }
        if (height) {
            $canvas.setAttribute('height', height);
        }
    };

    /**
     * init image 
     *
     * @param {*} url
     * @memberof ImageCanvas
     */
    initImageLevel(url) {
        this.$imageDom = new Image();
        this.$imageDom.src = url;
        this.$imageDom.onload = () => {
            this.imageOriginWidth = this.$imageDom.width;
            this.imageOriginHeight = this.$imageDom.height;
            const imageRatio = this.imageOriginWidth / this.imageOriginHeight;
            const canvasRatio = this.canvasWidth / this.canvasHeight;
            if (imageRatio > canvasRatio) {
                this.currentRatio = this.canvasWidth / this.imageOriginWidth;
            } else {
                this.currentRatio = this.canvasHeight / this.imageOriginHeight;
            }
            this.minRatio = this.currentRatio;
            this.operateImageSize('moderate');
        }
    };

    /**
     *
     *
     * @param {*} type
     * @param {*} e
     * @returns
     * @memberof ImageCanvas
     */
    operateImageSize(type, e) {
        if (type == 'reduce' && (this.currentRatio - this.ratioStep + 0.01) < this.minRatio) return;
        if (type == 'amplification' && (this.minRatio + this.ratioStep * (this.maxTimes - 1)) < this.currentRatio) return;
        let dir = null;
        switch (type) {
            case 'amplification':
                dir = 1;
                break;
            case 'reduce':
                dir = -1;
                break;
            case 'moderate':
                // 用于判断是宽和高哪个与父容器相等
                let imageRatio = this.imageOriginWidth / this.imageOriginHeight;
                let canvasRatio = this.canvasWidth / this.canvasHeight;
                if (imageRatio > canvasRatio) {
                    this.currentRatio = this.canvasWidth / this.imageOriginWidth;
                } else {
                    this.currentRatio = this.canvasHeight / this.imageOriginHeight;
                }
                break;
        }
        // const { x, y } = this.getPoint(e && e.offsetX , e && e.offsetY, this.currentRatio)

        if (dir) {
            // 放大 或者缩小

            this.currentRatio += dir * this.ratioStep;
            let centerX = e && e.offsetX || this.canvasWidth / 2;
            let centerY = e && e.offsetY || this.canvasHeight / 2;

            this.getOffset(centerX, centerY, this.currentRatio, this.ratioStep, dir);

        } else {
            // 自适应
            this.offsetX = (this.canvasWidth - this.imageOriginWidth * this.currentRatio) * 0.5;
            this.offsetY = (this.canvasHeight - this.imageOriginHeight * this.currentRatio) * 0.5;
        }
        this.drawImage(this.$imageDom, this.offsetX, this.offsetY, this.currentRatio);
    };

    // clear Canvas
    clearCanvas() {
        if (this.context) {
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
    };

    // 操作图片
    drawImage(image, dx, dy, scale) {
        // 清空画布
        this.clearCanvas();
        if (image) {
            try {
                this.context.drawImage(
                    image,
                    0,
                    0,
                    this.imageOriginWidth,
                    this.imageOriginHeight,
                    dx,
                    dy,
                    this.imageOriginWidth * scale * 100,
                    this.imageOriginHeight * scale * 100
                );
            } catch (e) {
                console.log(e)
            }
        }
    };

    // 获取坐标点是否在图片中，如果不在图片中则选择靠近图片一边的位置, 如果再图片的四个顶角外面则采用顶角放大原则
    getOffset(pointX, pointY, scale, ratio, dir) {
        if (pointX && pointY) {
            // 获取图片
            const width = this.imageOriginWidth * (scale - ratio * dir);
            const height = this.imageOriginHeight * (scale - ratio * dir);
            const x = this.offsetX;
            const y = this.offsetY;
            if ((pointX < x) && (pointY >= y && pointY <= y + height)
            ) {
                // 1
                this.offsetY = pointY - (pointY - this.offsetY) / (scale - ratio * dir) * scale;
            } else if ((pointX < x) && pointY >= y + height) {
                // 2
                this.offsetX = x;
                this.offsetY = (ratio * dir * this.imageOriginHeight - this.offsetY) * (-1);
            } else if (pointX > x + width && (pointY >= y && pointY <= y + height)) {
                // 5
                this.offsetY = pointY - (pointY - this.offsetY) / (scale - ratio * dir) * scale;
                this.offsetX = (ratio * dir * this.imageOriginWidth - this.offsetX) * (-1);
            } else if ((pointX >= x && pointX <= x + width) && (pointY > y + height)) {
                // 3
                this.offsetX = pointX - (pointX - this.offsetX) / (scale - ratio * dir) * scale;
                this.offsetY = (ratio * dir * this.imageOriginHeight - this.offsetY) * (-1);
            } else if (pointY < y && (pointX >= x && pointX <= x + width)) {
                // 7
                this.offsetX = pointX - (pointX - this.offsetX) / (scale - ratio * dir) * scale;
                this.offsetY = y;
            } else if (pointX > x + width && (pointY > y + height)) {
                // 4
                this.offsetX = (ratio * dir * this.imageOriginWidth - this.offsetX) * (-1);
                this.offsetY = (ratio * dir * this.imageOriginHeight - this.offsetY) * (-1);
            } else if (pointX > x + width && pointY < y) {
                // 6
                this.offsetY = y;
                this.offsetX = (ratio * dir * this.imageOriginWidth - this.offsetX) * (-1);
            } else if (pointX < x && pointY < y) {
                //  8 
                this.offsetX = x;
                this.offsetY = y;
            } else {
                this.offsetX = pointX - (pointX - this.offsetX) / (scale - ratio * dir) * scale;
                this.offsetY = pointY - (pointY - this.offsetY) / (scale - ratio * dir) * scale;
            }
        }
    };

    // add canvasDom events
    initEvents($canvasDom) {
        $canvasDom.addEventListener('mousedown', (e) => {
            this.handleCanvasMousedown(e);
        });
        $canvasDom.addEventListener('mousemove', (e) => {
            this.handleCanvasMousemove(e);
        });
        $canvasDom.addEventListener('mouseup', (e) => {
            this.handleCanvasMouseup(e);
        });
        $canvasDom.addEventListener('mousewheel', (e) => {
            this.handleCanvasMousewheel(e);
        });

    };

    handleCanvasMousedown(e) {
        // 记录鼠标与图片offset的距离，为达到以鼠标为中心拖动的效果
        this.allowMove = true;
        this.rangeX = e.offsetX - this.offsetX;
        this.rangeY = e.offsetY - this.offsetY;
    };

    handleCanvasMousemove(e) {
        if (!this.allowMove) return;
        const offsetX = e.offsetX - this.rangeX;
        const offsetY = e.offsetY - this.rangeY;
        if (this.canvas) {
            this.drawImage(this.$imageDom, offsetX, offsetY, this.currentRatio)
        }
    };

    handleCanvasMouseup(e) {
        if (!this.allowMove) return;
        this.allowMove = false;
        // 释放的时候将图片当前的offset记录下来
        this.offsetX = e.offsetX - this.rangeX;
        this.offsetY = e.offsetY - this.rangeY;
    };

    handleCanvasMousewheel(e) {
        if (e.wheelDelta > 0) {
            this.operateImageSize('amplification', e);
        } else {
            this.operateImageSize('reduce', e);
        }
    };

}

export default ImageCanvas;
