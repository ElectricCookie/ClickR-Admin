import {createDevTools} from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'

import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {syncHistoryWithStore, routerReducer} from 'react-router-redux'

import * as Reducers from "./reducers/index";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Components from "./components/components";

import { StyleRoot } from "radium";


import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();


const reducer = combineReducers({
    ...Reducers,
    routing: routerReducer
});



const store = createStore(
    reducer,
    window.devToolsExtension && window.devToolsExtension()
);


const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider>
            <Router history={history}>
                <Route path="/login" component={Components.Login} />
                <Route path="/register" component={Components.Register} />
                <Route path="/" component={Components.App}>
                    <IndexRedirect to="manage-scenarios" />
                    <Route path="manage-scenarios" component={Components.ManageScenarios} />
                    <Route path="manage-tracks" component={Components.ManageTracks} />
                    <Route path="edit-track/:id" component={Components.EditTrack} />
                    <Route path="edit-scenario/:id" component={Components.EditScenario} />
                </Route>
            </Router>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('mount')
);