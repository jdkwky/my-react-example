import React, { Component } from 'react';
export default function(getComponent) {

    return class AsyncComponent extends Component {
        static Component = null;
        state = { Component: AsyncComponent.Component };
            
        componentWillMount() {
            if (!this.state.Component) {
                getComponent().then(({ default: Component }) => {
                    AsyncComponent.Component = Component;
                    this.setState({ Component });
                });
            }
        }
        getNewRender = () => {
            const { Component } = this.state;
            return <Component {...this.props} />;
        };

        render() {
            const { Component } = this.state;
            if (Component) {
                return this.getNewRender();
            }
            return null;
        }
    }
}
