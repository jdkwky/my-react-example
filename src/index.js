import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import EditTableDemo from 'editTable/EditTableDemo';
import TimelineDemo from 'timeline/TimelineDemo';
import registerServiceWorker from './registerServiceWorker';
import IndexPage from 'main/IndexPage';
import printMe from './print.js';

console.log('11111111111111');

console.log(module.hot, 'module-hot');

ReactDOM.render(
  <div>
    <IndexPage />
  </div>,
  document.getElementById('root')
);

registerServiceWorker();



if (module.hot) {
  module.hot.accept('./print.js', function () {
    console.log('Accepting the updated printMe module!');
    printMe();
  })
  module.hot.accept('./editTable/component/EditableCell.jsx', function () {
    console.log('Accept the update EditTable module!');

  })
}
