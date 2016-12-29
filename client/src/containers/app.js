'use strict';

import React, { Component } from 'react';
import { createStore, applyMiddleWare, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import * as reducers from '../reducers';
import TrailAngel from './trail-angel';

const createStoreWithMiddleware = applyMiddleWare(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <TrailAngel />
      </Provider>
    );
  }
};