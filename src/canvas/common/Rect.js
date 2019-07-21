import { Canvas } from './index';


class Rect extends Canvas {
    constructor(props) {
        super(props);
        this.canvas.addEventListener('mousedown', (event) => {
            this.handleMouseDown(event);
        });
        this.canvas.addEventListener('mousemove', (event) =>{
            this.handleMouseMove(event);
        });
        this.rect = [];
        this.editFlag = false;
        this.onEvent();
    }

    _judgeNearLeastDot(posList, pos, buttons) {
        const threshold = 5;
        const pos0 = posList[0];
        const pos1 = posList[1];
        const x0 = pos0.x;
        const x1 = pos1.x;
        const y0 = pos0.y;
        const y1 = pos1.y;
        const x = pos.x;
        const y = pos.y;
        if( (y <= y1 && y >= y0) || (y <= y0 && y>=y1)){
            if(Math.abs(x0 - x) <=threshold){
                if(buttons == 0){
                    this.emit('drawEditRect', this.rect, { y: pos.y, x : x0 });
                }else if (buttons == 1){
                    pos0.x = x;
                    this.emit('drawEditRect', this.rect, pos);
                }
                return;
            }else if (Math.abs(x1 - x) <=threshold){
                if(buttons == 0){
                    this.emit('drawEditRect', this.rect, { y: pos.y, x : x1 });
                }else if (buttons == 1){
                    pos1.x = x;
                    this.emit('drawEditRect', this.rect, pos);
                }
                return;
            }
        }
        if( (x >=x0 && x <=x1) || (x >=x1 && x <=x0) ){
            if(Math.abs(y0 - y) <=threshold){
                if(buttons == 0) {
                    this.emit('drawEditRect', this.rect , { x: pos.x, y:y0 });
                }else if (buttons == 1){
                    pos0.y = y;
                    this.emit('drawEditRect', this.rect, pos);
                }
                return;
            }else if ( Math.abs(y1 - y) <=threshold){
                if(buttons == 0) {
                    this.emit('drawEditRect', this.rect , { x: pos.x, y:y1 });
                }else if (buttons == 1){
                    pos1.y = y;
                    this.emit('drawEditRect', this.rect, pos);
                }
                return;
            }
        }
        this.emit('drawEditRect', this.rect);
    }

    _isPointInPath(pos){
        if (this.context.isPointInPath(pos.x, pos.y)) {
            return true;
        }
        return false
    }

    _drawRect (x, y , width, height) {
        this.context.beginPath();
        this.context.lineWidth="2";
        this.context.strokeStyle="green";
        this.context.rect(x,y, width, height);
        this.context.stroke();
    }
    _drawCircle(pos) {
        this.context.beginPath();
        this.context.lineWidth="2";
        this.context.strokeStyle="green";
        this.context.arc(pos.x, pos.y, 3, 0, 2 * Math.PI, true);
        this.context.stroke();
    }

    onEvent = () =>{
        this.on('drawRect', this.drawRect, this);
        this.on('drawMoveRect', this.drawMoveRect, this);
        this.on('drawEditRect', this.drawEditRect, this);
    }

    drawRect = (posList=[]) => {
        if(posList.length == 1) {
            this.clearRect();
            const pos = posList[0];
            this._drawRect(pos.x, pos.y, 0, 0);
        }else if (posList.length == 2) {
            this.clearRect();
            const pos0 = posList[0] || {};
            const pos1 = posList[1] || {};
            const x0 = pos0.x; 
            const y0 = pos0.y;
            const x1 = pos1.x; 
            const y1 = pos1.y;
            this._drawRect(x0,y0, x1-x0, y1-y0);
        }
    }

    drawMoveRect = (posList, pos) => {
        this.clearRect();
        if(posList.length == 1 && pos){
            const pos0 = posList[0] || {};
            const x0 = pos0.x; 
            const y0 = pos0.y;
            const x1 = pos.x;
            const y1 = pos.y;
            this._drawRect(x0,y0, x1-x0, y1-y0);
        }
    }

    drawEditRect(posList, pos){
        if (posList.length == 2) {
            this.clearRect();
            const pos0 = posList[0] || {};
            const pos1 = posList[1] || {};
            const x0 = pos0.x; 
            const y0 = pos0.y;
            const x1 = pos1.x; 
            const y1 = pos1.y;
            this._drawRect(x0,y0, x1-x0, y1-y0);
            this.context.fillStyle = "rgba(255,255,255,.8)";
            this.context.fill();
            if(pos){
                this._drawCircle(pos);
            }
        }
    }

    handleMouseDown =(event) =>{
        const { clientX , clientY } = event || {};
        const  pos = this.windowToCanvas(clientX,clientY);
        if(this.rect.length < 2) {
            this.rect.push(pos);
            this.emit('drawRect', this.rect);
            return ;
        }else if(this.rect.length == 2) {
            // 判断当前点击是否在路境内
            const flag = this._isPointInPath(pos);
            
            if(flag){
                // 选中
                this.emit('drawEditRect', this.rect);
                this._judgeNearLeastDot(this.rect ,pos , 1);
                this.editFlag = true;
            }else{
                this.editFlag = false;
                this.emit('drawRect', this.rect);
            }
        }
    }
    handleMouseMove = (event) =>{
        const { clientX , clientY } = event || {};
        const  pos = this.windowToCanvas(clientX,clientY);
        if(this.rect.length == 1){ 
            this.emit('drawMoveRect', this.rect, pos);
        }
        if(this.editFlag){
            const { buttons } = event || {}
            this._judgeNearLeastDot(this.rect, pos , buttons);
        }
    }

}

export default Rect;