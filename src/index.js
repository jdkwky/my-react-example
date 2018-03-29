import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import EditTableDemo from 'editTable/EditTableDemo';
import TimelineDemo from 'timeline/TimelineDemo'
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(<div><EditTableDemo  /><TimelineDemo /></div>, document.getElementById('root'));

registerServiceWorker();
