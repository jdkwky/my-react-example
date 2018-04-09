import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import EditTableDemo from 'editTable/EditTableDemo';
import TimelineDemo from 'timeline/TimelineDemo';
import registerServiceWorker from './registerServiceWorker';
import IndexPage from 'main/IndexPage';

ReactDOM.render(
  <div>
    <IndexPage />
  </div>,
  document.getElementById('root')
);

registerServiceWorker();
