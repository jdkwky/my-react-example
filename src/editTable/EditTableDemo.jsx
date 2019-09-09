import React, { Component } from 'react';
import EditTable from './component/EditTable';
import EditableCell from './component/EditableCell';
import { hot } from 'react-hot-loader/root';

class EditTableDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      dataSource: [
        { id: 1, name: 'a', age: 16, sex: 'male' },
        { id: 2, name: 'b', age: 14, sex: 'female' },
        { id: 3, name: 'c', age: 29, sex: 'male' }
      ]
    };
  }

  handleKeyDown = (index, e) => {
    const dataSource = this.state.dataSource;
    dataSource[index].name = this.state.inputName;
    this.setState((preState, props) => ({ ...preState, dataSource: [...dataSource] }));
  };

  handleChange = (index, e) => {
    const { value } = e.target;
    this.setState((preState, props) => ({ ...preState, inputName: value }));
  };

  handleDelete = index => {
    const { dataSource } = this.state;
    const newDataSource = dataSource.filter(value => value.id !== index);

    if (newDataSource.length === 0) {
      newDataSource.push({});
    }

    this.setState((preState, props) => ({ ...preState, dataSource: [...newDataSource] }));
  };

  getColumns() {
    return [
      {
        title: 'name',
        dataIndex: 'name',
        render: (text, data, index) => {
          return (
            <EditableCell
              isDelete={true}
              onDelete={() => {
                this.handleDelete(data.id);
              }}
              isPopup={true}
              isPopDelete={true}
              editArea={
                <div
                  className="editForm"
                  onKeyDown={e => {
                    if (e.which == 13 || e.which == 108) {
                      this.handleKeyDown(index, e);
                      return true;
                    }
                    return false;
                  }}
                >
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                    }}
                  >
                    <label>姓名</label>
                    <input
                      tabIndex={1}
                      autoFocus
                      name="name"
                      onChange={e => {
                        this.handleChange(index, e);
                      }}
                      type="text"
                    />
                  </form>
                </div>
              }
              descArea={text}
            />
          );
        }
      },
      { title: 'age', dataIndex: 'age' },
      { title: 'sex', dataIndex: 'sex' }
    ];
  }

  render() {
    return (
      <div>
        <EditTable
          row={1}
          column={1}
          dataSource={this.state.dataSource || []}
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

export default hot(EditTableDemo);
