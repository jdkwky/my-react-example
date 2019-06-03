// 日常中常用的正则校验


const regexList = [
    {
        label: '字数限制12个字符，只支持数字字母汉字下滑线', 
        value: `/^[\u2E80-\u9FFF0-9a-zA-Z_]{1,12}$/`,
        hiddlen: true
    },{
        label: '(0,100] 之间正数，小数保留2位',
        value: '/^([1-9][0-9]{0,1}|([0-9]{1,2}\.[0-9]{1,2})|100)$/'
    },{
        label: '1-9999 之间整数',
        value: '/^([1-9][0-9]{0,3})$/'
    }
]

export default regexList;


