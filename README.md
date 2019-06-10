
#### 环境搭建注意事项

1. [React Error]: Target container is not a DOM element

>  原因:  在 index.html中将绑定的js文件写在了header中，在渲染组件时需要找到页面上的根节点去渲染 ，绑定在header中还没有根节点就去渲染组件，所以会报错

> 解决方案：将js文件绑定在底部

2. 在react中如何引入antd UI组件

> babel-loader 中 加入  ['import', { libraryName: 'antd', style: 'css' }]
> 
> - ["import", { "libraryName": "antd", "style": true }]: import js and css modularly > > >  >(LESS/Sass source files)
> - ["import", { "libraryName": "antd", "style": "css" }]: import js and css modularly (css built files)

3. react 如何支持es6的箭头函数

> 安装以下四个包
> - babel-plugin-transform-class-properties
> - babel-preset-es2015
> - babel-preset-react
> - babel-preset-stage-0
>
>  webpack.config.js 配置文件说明：
>
> ```
>   loader: 'babel-loader',
>    options: {
>            presets: ['env', 'react', 'es2015', 'stage-0'],
>           plugins: ['transform-class-properties']
>         }
> ```

4. react中引入antd UI组件没有样式问题

> webpack.config.js 中去除  css modules

5. import 以jsx结尾的组件时，必须要写文件的扩展名

```
 resolve: {
    extensions: ['.js', '.jsx'], // 自动解析 js jsx 扩展名
  }
```

6. antd 和css moudel冲突但是本地需要css moudel


```
{
    test: /(\.css|\.less)$/,
    use: [
        {
            loader: 'style-loader'
        },
        {
        loader: 'css-loader',
            options: {
            modules: true, // 指定启用css modules
            localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
            }
        },
        {
            loader: 'less-loader'
        },
        {
            loader: 'postcss-loader'
        }
    ],
    exclude: /node_modules/ //那些文件不需要用上述loader
},
{
    test: /(\.css|\.less)$/,
    use: [
        {
            loader: 'style-loader'
        },
        {
            loader: 'css-loader'
        },
    ],
    exclude: /src/ //那些文件不需要用上述loader
}
```

> #####  npm  改变 全局模块 缓存 安装位置
>
> - 启动CMD依次执行以下两条命令
npm config set prefix "XXX\nodejs\node_global"
npm config set cache "XXX\nodejs\node_cache"
>
>- 设置环境变量：
NODE_PATH = XXX\Node\nodejs
PATH = %NODE_PATH%\;%NODE_PATH%\node_modules;%NODE_PATH%\node_global;


#### 盲点
一、React事件机制 
1.  与VUE不同之处： VUE中的事件是在模板编译的时候直接添加到dom元素上的，而react中并不是这样，react中的事件机制比较复杂，react实现了一套能兼容所有平台的事件机制

> 参考文档： https://juejin.im/post/5bdf0741e51d456b8e1d60be#%E4%BE%8B%E5%AD%90debug

二、 webworker

1. webworker postMessage向子worker传递数据时只能传递基本数据类型、数组、对象，不能传递 window、AudioBuffer、AudioContext等复杂数据结构





#### 工具类 
1. 多边形绘制工具
2. 音频绘制工具
3. 图片放大缩小功能
4. 增加一些常用的正则表达式
5. excel数据导出功能








