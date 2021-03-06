'use strict';

import React, { Component } from 'react';
import { View, NavigatorIOS, StyleSheet } from 'react-native';

import Login from './views/login';
import colors from './components/style/colors';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import reducers from './reducers';

const logger = createLogger();
const middleware = [
  thunk,
  __DEV__ && logger
].filter(Boolean);
const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

export default class App extends Component {


  render() {
    return (
      <Provider store={store}>
        <NavigatorIOS ref='nav'
                      style={styles.container}
                      barTintColor='white'
                      titleTextColor={colors.darkgray}
                      tintColor={colors.seafoam}
                      initialRoute={{
                        component: Login,
                        title: 'Welcome to TrailAngel'
                      }}
        />
      </Provider>
    );
  }
};

let styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.seafoam
      }
});