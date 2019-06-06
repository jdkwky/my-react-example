class webWorker {
  /**
   * @description: webworker的简单封装
   * @param {String} data js的url/script的id或class
   * @param {Object} type 默认值给出,同页面的web worker传个’worker‘即可
   * @return: WebWorker 对象
   */
  constructor(data, type = "url") {
    this.worker = null;
    this.workerInit(data, type);
  }
  workerInit(data, type) {
    if (type === "url") {
      // 默认是以url脚本形式的worker线程
      // 此时的data应该是一个url链接
      this.worker = new Worker(data);
    } else {
      // 以字符串形式创建worker线程，把代码字符串，转成二进制对象，生成 URL，加载URL
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      this.worker = new Worker(url); // 加载
    }
  }
  /**
   * @description: 给worker线程发送消息
   * @param {*} data 要发送的数据
   */
  postMessage(data) {
    return this.worker.postMessage(data);
  }
  /**
   * @description: worker线程发送给主进程的数据
   * @param {Function} fn 把数据通过回调的形式传出去
   */
  onmessage(fn) {
    this.worker.onmessage = msg => {
      return fn(msg.data);
    };
  }
  // 主线程关闭worker线程
  closeWorker() {
    return this.worker.terminate();
  }
  /**
   * @description: 主线程监听worker线程的错误信息
   * @param {Function} fn 错误信息回调
   */
  errMsg(fn) {
    this.worker.onerror = e => {
      return fn(e);
    };
  }
}


export default webWorker;