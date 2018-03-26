import React, { Component } from 'react';
import EditTable from 'editTable/EditTable';
import { Button } from 'antd';

class App extends Component {
  getColumns () {
    return [
      { title: 'name', dataIndex: 'name' },
      { title: 'age', dataIndex: 'age' },
      { title: 'sex', dataIndex: 'sex' }
    ];
  };

  render() {
    const dataSource = [
      { name: 'a', age: 16, sex: 'male' },
      { name: 'b', age: 14, sex: 'female' },
      { name: 'c', age: 29, sex: 'male' }
    ];
    return (
      <div>
        <EditTable
          row={1}
          column={1}
          dataSource={dataSource || []}
          groupTitle={{
            name: '姓名',
            age: '年龄',
            sex: '性别'
          }}
          columns={this.getColumns()}
        />
        <Button type="primary">test</Button>
      </div>
    );
  }
}

export default App;
