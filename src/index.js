import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import EditTableDemo from 'editTable/EditTableDemo';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(<EditTableDemo  />, document.getElementById('root'));

registerServiceWorker();
