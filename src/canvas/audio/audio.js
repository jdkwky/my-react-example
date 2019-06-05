class Audio{

    // 绘制的线宽 1px
    constructor( params ){
        const {
            secondsPerScreen = 10 ,    // 每屏幕最多显示几秒音频信息
            wrapId,
            fileId,
            scale =1,
            url
        } = params;
        this.$wrapDom = document.getElementById(wrapId);
        this.width = this.$wrapDom.offsetWidth || 0;
        this.height = this.$wrapDom.offsetHeight || 0;
        this.$canvasDom = document.createElement('canvas');
        this.$canvasDom.setAttribute('width', this.width);
        this.$canvasDom.setAttribute('height', this.height);
        this.$wrapDom.appendChild(this.$canvasDom);
        this.context = this.$canvasDom.getContext('2d');
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.buffer = null;
        this.duration = 0;
        this.secondsPerScreen = secondsPerScreen;
        this.fileId = fileId;   // 如果是通过本地上传音频文件则需要知道input节点
        this.scale = scale;
        this.url = url;
        this.getAudioByFile(this.fileId);
        this.getAudioByXHR(url);

    }

    // todo 数据处理问题放到webworker中执行

    // 通过文件获取音频数据
    getAudioByFile(id) {
        const _this = this;
        // 通过element audio源获取数据  开始
        const $fileDom = document.getElementById(id); 
        if($fileDom){
            $fileDom.onchange = function(value) {
                var files = value.target.files;
                const fr = new FileReader();
                fr.onload = function(event) {
                    _this.audioCtx.decodeAudioData(event.target.result).then(res=>{
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
        ajaxRequest.onerror = function(e){
            console.log('Error with get audio data', e);
        }
        // 结束 通过ajax请求获取数据
    }
    // buffer 赋值
    setBuffer(buffer){
        this.buffer = buffer;
        this.duration = buffer.duration || 0 ;
        const data = this.getDrawData(this.buffer, this.width, this.height,this.duration, this.secondsPerScreen, this.scale);
        this.draw(data, this.height)
    }

    getDrawData(buffer, width, height, duration, secondsPerScreen, scale){
        const radioSeconds = duration * 1000 ; // ms
        let realWidth = width * radioSeconds / (secondsPerScreen * 1000);
        let maxWidth = realWidth * scale;
        const copyMaxWidth = maxWidth;
        const minStep = buffer.getChannelData(0).length / maxWidth;

        if(realWidth < width ){
            realWidth = width;
            maxWidth =  width * scale;
        }

        const originalData = new Float32Array(maxWidth);
        for (let i = 0; i < maxWidth; i++) {
            if (typeof originalData[ i ] && i < copyMaxWidth) {
                let sum = 0;
                for (let j = 0; j < buffer.numberOfChannels; j++) {
                    sum += parseFloat(buffer.getChannelData(j)[ parseInt(i * minStep) ]);
                }
                originalData[ i ] = this.analysisPeekValue(sum,height);
            } else {
                originalData[ i ] = 0;
            }
        }
        return originalData;
    } 

    analysisPeekValue(value, height){
        const p = 100;
        if(value != 0){
            if( Math.abs(p) * value  > (height / 2)){
                return (height / 2) * (value / Math.abs(value))
            }else{
                return value * p 
            }
        }
        return 0;
    } 

    
    draw( arr , height){
        // todo  改变频谱颜色   
        for (var i = 0; i < arr.length; i++) {
            const rectHeight = arr[i];
            if (rectHeight > 0) {
                this.context.fillRect(i * 1, height / 2 - rectHeight, 1, rectHeight);
            } else {
                this.context.fillRect(i * 1, height / 2, 1, -rectHeight);
            }
        }
    } 

    // todo  添加放大缩小

    // todo  增加分页

    // todo  增加播放语音 暂停语音功能



}


export default Audio;