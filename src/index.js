import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import EditTableDemo from 'editTable/EditTableDemo';
import TimelineDemo from 'timeline/TimelineDemo';
import registerServiceWorker from './registerServiceWorker';
import IndexPage from 'main/IndexPage';
import printMe from './print.js';
import singleSpaReact from 'single-spa-react';

// console.log('11111111111111');

// console.log(module.hot, 'module-hot');

// ReactDOM.render(
//     <div>
//         <IndexPage />
//     </div>,
//     document.getElementById('root')
// );
/**start 微服务 */
// 微服务
// 导出生命周期

if (!window.singleSpaNavigate) {
    // 如果不是single-spa模式 test
    ReactDOM.render(
        <div>
            <IndexPage />
        </div>,
        document.getElementById('root')
    );
}
const lifecycles = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: () => <IndexPage />,
    errorBoundary(err, info, props) {
        return <div> Error </div>;
    },
    domElementGetter: () => document.getElementById('vue'),
});
export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;

/** end 微服务 */

// registerServiceWorker();
/**  热更新 */
// if (module.hot) {
//     module.hot.accept('./print.js', function() {
//         console.log('Accepting the updated printMe module!');
//         printMe();
//     });
//     module.hot.accept('./editTable/component/EditableCell.jsx', function() {
//         console.log('Accept the update EditTable module!');
//     });
// }
