
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


