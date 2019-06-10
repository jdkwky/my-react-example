/**
 * Created on 17/12/21.
 * toExcel 导出excel表格
 *
 * ex：
 * import excel from '../../util/excel';
 * const params = {
    fileName: '经纪人收益管理', //导出文件名
    worksheet: ['经纪人收益管理'], //导出excel的sheet名
    data: [
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
        }
    ],
    callback: res => {
        console.log(res);
    },
    fields: [
        //直接取数据时直接填字段名，需要格式化时传入格式化函数
        {
            name: '时间',
            field: 'date'
        },
        {
            name: '名称',
            field: 'name'
        },
        {
            name: '地址',
            field: 'address',
            formatter: this.setAddress,
            format: 'text'
        } //需要进行格式化的函数名,要以字符串方式展示设置format: 'text'
    ]
};
excel(params);
 */

const Excel = params => {
    const { data, fields } = params;
    let { fileName, worksheet, callback } = params;
    callback = callback || function() {};
    // 参数校验初始化
    if (!fields || (fields && !fields.length)) {
        callback({
            status: 'error',
            msg: '导出字段为空。'
        });
        return '';
    }
    if (!data || (data && !data.length)) {
        callback({
            status: 'error',
            msg: '没有数据可以导出。'
        });
        return '';
    }
    fileName = fileName || '导出表格' + Date.parse(new Date()) / 1000;
    if (!worksheet || (worksheet && !worksheet.length)) {
        worksheet = ['sheet1'];
    }
    // 格式化导出数据
    const exportData = formatData({ data, fields });
    if (!exportData) {
        callback({
            status: 'error',
            msg: '格式化数据错误'
        });
        return '';
    }
    // 导出excel
    const exportExcel = toExcel({ exportData, fields, fileName, worksheet });
    if (exportExcel === false) {
        callback({
            status: 'error',
            msg: '导出失败'
        });
        return '';
    }
};

// 格式化导出数据
const formatData = ({ data, fields }) => {
    try {
        const returnData = data.map(value => {
            const fieldArr = [];
            value &&
                fields.map(v => {
                    let val = '';
                    if (v.formatter) {
                        val = v.formatter(value[v.field], value);
                    } else if (v.cont) {
                        val = v.cont;
                    } else {
                        val = value[v.field];
                    }
                    if (val == undefined || val == null) {
                        val = '';
                    }
                    if (v.format) {
                        fieldArr.push({
                            type: 'ROW_HEADER',
                            value: val + '',
                            format: v.format
                        });
                    } else {
                        fieldArr.push({
                            type: 'ROW_HEADER',
                            value: val + ''
                        });
                    }
                });
            return fieldArr;
        });
        return returnData;
    } catch (e) {
        console.log('格式化', e);
        return false;
    }
};

// 导出excel数据
const toExcel = ({ exportData, fields, fileName, worksheet }) => {
    try {
        let excel = '<table border="1">';
        //设置表头
        let row = '<tr>';
        fields.forEach(value => {
            row += '<th>' + value.name + '</th>';
        });
        excel += row + '</tr>';
        //设置数据
        exportData &&
            exportData.forEach(value => {
                let rowData = '<tr>';

                value &&
                    value.forEach(v => {
                        v.value = v.value || '';
                        if (v.format) {
                            rowData +=
                                '<td class="' +
                                v.format +
                                '">' +
                                v.value +
                                '</td>';
                        } else {
                            rowData += '<td>' + v.value + '</td>';
                        }
                    });

                excel += rowData + '</tr>';
            });
        excel += '</table>';

        const excelFile = [
            '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">',
            '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">',
            '<head>',
            '<!--[if gte mso 9]>',
            '<xml>',
            '<x:ExcelWorkbook>',
            '<x:ExcelWorksheets>',
            '<x:ExcelWorksheet>',
            '<x:Name>' + worksheet + '</x:Name>',
            '<x:WorksheetOptions>',
            '<x:DisplayGridlines/>',
            '</x:WorksheetOptions>',
            '</x:ExcelWorksheet>',
            '</x:ExcelWorksheets>',
            '</x:ExcelWorkbook>',
            '</xml>',
            '<![endif]-->',
            '<style type="text/css">br {mso-data-placement:same-cell;} .text{ mso-number-format:\'@\';}</style>',
            '</head>',
            '<body>',
            excel,
            '</body>',
            '</html>'
        ].join('');
        const uri =
            'data:application/vnd.ms-excel;charset=utf-8,' +
            encodeURIComponent(excelFile);
        const link = document.createElement('a');
        link.href = uri;
        link.style = 'visibility:hidden';
        link.download = fileName + '.xls';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        return false;
    }
};

module.exports = Excel;
