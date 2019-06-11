class BaseEvent{

    constructor(){
        this.eventInfo = {};
    }
    on(type, fn, context){
        if(!type) return;
        if(this.eventInfo[type]){
            this.eventInfo[type].push({
                fn: fn,
                context: context
            })
        }else{
            this.eventInfo[type] = [{
                fn: fn,
                context: context
            }]
        }
    }

    emit(type, ...params){
        if(this.eventInfo[type]){
            this.eventInfo[type].forEach(val => {
                const { fn, context } =val;
                fn.call(context, ...params);
            });
        }
    }
    remove(type){
        if(this.eventInfo[type]){
            this.eventInfo[type].pop();
        }
    }

}

export default BaseEvent;