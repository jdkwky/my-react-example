import audioWorker from './audioWorker';
import webWorker from './webWorker';
import BaseEvent from 'utils/baseEvent';

class Audio extends BaseEvent {
    // 绘制的线宽 1px
    constructor(params) {
        super();
        const {
            secondsPerScreen = 10, // 每屏幕最多显示几秒音频信息
            wrapId,
            fileId,
            scale = 1,
            url,
            pagination = true
        } = params;
        const axisHeight = 30;
        const scrollHeight = 8;

        this.axisHeight = axisHeight;

        this.$wrapDom = document.getElementById(wrapId);
        this.width = this.$wrapDom.offsetWidth || 0;
        this.height = this.$wrapDom.offsetHeight ?  this.$wrapDom.offsetHeight - axisHeight - scrollHeight : 0;

        this.$canvasDom = document.createElement('canvas');
        this.$canvasDom.setAttribute('width', this.width);
        this.$canvasDom.setAttribute('height', this.height );
        this.$wrapDom.appendChild(this.$canvasDom);
        this.context = this.$canvasDom.getContext('2d');

        this.$axisCanvasDom = document.createElement('canvas');
        this.$axisCanvasDom.setAttribute('width', this.width);
        this.$axisCanvasDom.setAttribute('height', axisHeight);
        this.$wrapDom.appendChild(this.$axisCanvasDom);
        this.axisContext = this.$axisCanvasDom.getContext('2d');

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyserNode = this.audioCtx.createAnalyser();
        
        this.buffer = null;
        this.duration = 0;
        this.csource = null;

        this.secondsPerScreen = secondsPerScreen;
        this.fileId = fileId; // 如果是通过本地上传音频文件则需要知道input节点
        this.scale = scale;
        this.url = url;
        this.pageSize = 1;
        this.pageNum = 1;
        this.realPageSize = this.pageSize * this.width;
        this.originalData = null;

        if (this.fileId) {
            this.getAudioByFile(this.fileId);
        }
        if (this.url) {
            this.getAudioByXHR(url);
        }
        this.initEvent();
    }

    // 通过文件获取音频数据
    getAudioByFile(id) {
        const _this = this;
        // 通过element audio源获取数据  开始
        const $fileDom = document.getElementById(id);
        if ($fileDom) {
            $fileDom.onchange = function(value) {
                var files = value.target.files;
                const fr = new FileReader();
                fr.onload = function(event) {
                    _this.audioCtx.decodeAudioData(event.target.result).then(res => {
                        _this.setBuffer(res);
                    });
                };
                fr.readAsArrayBuffer(files[0]);
            };
        }
        // 结束 通过element audio源获取数据
    }
    getAudioByXHR(url) {
        const _this = this;
        // 通过ajax请求获取数据 开始
        const ajaxRequest = new XMLHttpRequest();

        ajaxRequest.open('GET', url, true);

        ajaxRequest.responseType = 'arraybuffer';

        ajaxRequest.onload = function() {
            const audioData = ajaxRequest.response;

            _this.audioCtx.decodeAudioData(
                audioData,
                function(buffer) {
                    _this.setBuffer(buffer);
                },
                function(e) {
                    console.log('Error with decoding audio data' + e.err);
                }
            );
        };

        ajaxRequest.send();
        ajaxRequest.onerror = function(e) {
            console.log('Error with get audio data', e);
        };
        // 结束 通过ajax请求获取数据
    }
    // buffer 赋值
    setBuffer(buffer) {
        
        



        this.buffer = buffer;

        this.duration = buffer.duration || 0;
        const originalData = this.getDrawData(
            this.buffer,
            this.width,
            this.height,
            this.duration,
            this.secondsPerScreen,
            this.scale
        );
        this.originalData = originalData;

        this.setCanvasWidth(originalData.length);
        this.draw(originalData, this.height);
    }

    /**
     *  解析数据成功之后给canvas赋值
     *
     * @param {*} width
     * @memberof Audio
     */
    setCanvasWidth(width) {
        this.$axisCanvasDom.setAttribute('width', width);
        this.$canvasDom.setAttribute('width', width);
        const totalSeconds = this.duration;
        const perPx = parseFloat(width / totalSeconds) / 10;
        this.drawAxis(this.axisContext, perPx, this.axisHeight * 0.4, width);
    }

    /**
     * 绘制时间
     *
     * @param {*} context
     * @param {*} step
     * @param {*} height
     * @param {*} length 最大长度
     * @memberof Audio
     */
    drawAxis(context, step, height, length) {
        const f = 5;
        let threshold = 5;

        if (step < 10) {
            threshold = 100;
        }
        const _minus = height * 0.6;

        context.save();

        context.beginPath();

        // start draw line
        context.moveTo(0, height);
        context.lineTo(length, height);
        //  end draw line

        context.moveTo(0, 0);
        context.lineTo(0, height);
        context.fillText(0 + 's', 0, height + 10);

        let index = 0;

        for (let i = step; i < length; i = i + step) {
            index++;
            if (index % threshold === 0) {
                context.moveTo(i, 0);
                context.fillText(index * 0.1 + 's', i - step * 0.5, height + 10);
            } else {
                if (threshold > 5) {
                    if (index % (threshold / f) == 0 && threshold / f > 1) {
                        context.moveTo(i, _minus);
                    }
                } else {
                    context.moveTo(i, _minus);
                }
            }
            context.lineTo(i, height);
        }
        context.lineWidth = 1;
        // context.strokeStyle = '';
        context.stroke();
        context.restore();
    }

    /**
     * 根据解析出的音频数据和最大canvas长度抽取数据
     *
     * @param {*} buffer
     * @param {*} width
     * @param {*} height
     * @param {*} duration
     * @param {*} secondsPerScreen
     * @param {*} scale
     * @returns
     * @memberof Audio
     */
    getDrawData(buffer, width, height, duration, secondsPerScreen, scale) {
        const threshold = 10000;
        const radioSeconds = duration * 1000; // ms
        let realWidth = (width * radioSeconds) / (secondsPerScreen * 1000);
        let maxWidth = realWidth * scale;
        const copyMaxWidth = maxWidth;
        const minStep = buffer.getChannelData(0).length / maxWidth;

        if (realWidth < width) {
            realWidth = width;
            maxWidth = width * scale;
        }

        const originalData = new Float32Array(maxWidth);
        for (let i = 0; i < maxWidth; i++) {
            if (typeof originalData[i] && i < copyMaxWidth) {
                let sum = 0;
                for (let j = 0; j < buffer.numberOfChannels; j++) {
                    sum += parseFloat(buffer.getChannelData(j)[parseInt(i * minStep)]);
                }
                originalData[i] = this.analysisPeekValue(sum, height);
            } else {
                originalData[i] = 0;
            }
        }

        if (originalData.length > threshold) {
            const newOriginalData = new Float32Array(threshold);
            const length = originalData.length;
            const step = Math.floor(length / threshold);
            for (let i = 0; i < threshold; i++) {
                if (typeof originalData[i] && i < length) {
                    newOriginalData[i] = originalData[i * step];
                }
            }
            return newOriginalData;
        }
        return originalData;
    }

    /**
     * 格式化音频数据峰值
     *
     * @param {*} value
     * @param {*} height
     * @returns
     * @memberof Audio
     */
    analysisPeekValue(value, height) {
        const p = 100;
        if (value != 0) {
            if (Math.abs(p) * value > height / 2) {
                return (height / 2) * (value / Math.abs(value));
            } else {
                return value * p;
            }
        }
        return 0;
    }

    /**
     * 将音频数据绘制出来
     *
     * @param {*} arr
     * @memberof Audio
     */
    draw(arr) {
        this.clearCanvas();
        // todo  改变频谱颜色
        for (var i = 0; i < arr.length; i++) {
            const rectHeight = arr[i];
            if (rectHeight > 0) {
                this.context.fillRect(i * 1, this.height / 2 - rectHeight, 1, rectHeight);
            } else {
                this.context.fillRect(i * 1, this.height / 2, 1, -rectHeight);
            }
        }
        this.emit('audioDrawEnd');
    }

    initEvent() {
        this.$wrapDom.addEventListener('scroll', e => {});
    }

    /**
     * 清空canvas
     *
     * @memberof Audio
     */
    clearCanvas() {
        this.context.clearRect(0, 0, this.realPageSize, this.height);
    }

    /**
     * 音频播放
     *
     * @memberof Audio
     */
    playAudio() {

        

        this.csource = this.audioCtx.createBufferSource();
        this.csource.buffer = this.buffer;
        this.analyserNode.fftSize = 256;
        this.csource.connect(this.analyserNode);
        this.analyserNode.connect(this.audioCtx.destination);
        this.csource.start(0);

        const array = new Float32Array(this.analyserNode.frequencyBinCount); 
        this.analyserNode.getFloatFrequencyData(array)
        
        console.log('===========================');
        console.log('this.analyserNode', this.analyserNode,array);
        console.log('===========================');
        var time = setInterval(() => {
            const { currentTime } = this.analyserNode.context || {};
            
            if(currentTime >= this.duration){
                clearInterval(time);
                return ;
            }
            this.analyserNode.getFloatFrequencyData(array)
            console.log('===========================');
            console.log('this.analyserNode', this.analyserNode,array);
            console.log('===========================');
        }, 1000);
        

    }

    /**
     *音频停止播放
     *
     * @memberof Audio
     */
    endPlayAudio() {
        this.csource.stop();
    }
}

export default Audio;
