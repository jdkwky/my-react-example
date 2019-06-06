
const audioWorker = `

self.onmessage = e => {
    console.log('主线程传来的信息：', e.data);
    
};`;


export default audioWorker;


