import React, {Component} from 'react'

class Event extends Component {
    constructor(props){
        super(props);
        this.state={}
    }
    componentDidMount(){
        document.getElementById('outter').addEventListener('click',()=>{
            console.log('C native outter click');
            
        });
        window.addEventListener('click',()=>{
            console.log('D native window click');
            
        })

    }

    innerClick =(e)=>{
        console.log('A this is inner Click' );
        
    }
    outterClick =(e)=>{
        console.log('B this is outter click');
        e.stopPropagation();    
    }
    render(){
        return (
            <div id="outter" onClick={this.outterClick}>
                <button id="inner" onClick={this.innerClick}>
                    BUTTON
                </button>

                <a href="https://juejin.im/post/5bdf0741e51d456b8e1d60be#%E4%BE%8B%E5%AD%90debug">原理说明</a>
            </div>
        )
    }
}

export default Event;