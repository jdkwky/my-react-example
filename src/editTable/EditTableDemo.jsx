import React, { Component } from 'react';
import EditTable from './component/EditTable';
import EditableCell from './component/EditableCell';


class EditTableDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getColumns() {
    return [
      {
        title: 'name',
        dataIndex: 'name',
        render: (text, data, index) => {
          return (
            <EditableCell
              isPopup={true}
              isPopDelete={true}
              editArea={
                <div className="editForm">
                <form onSubmit={() => {}}>
                  <input name="name" type="text" />
                  <input name="password" type="password" />
                </form>
                </div>
              }
              descArea={this.state.name}
            />
          );
        }
      },
      { title: 'age', dataIndex: 'age' },
      { title: 'sex', dataIndex: 'sex' }
    ];
  }

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
        
      </div>
    );
  }
}

export default EditTableDemo;
