'use strict';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as favoriteActions from '../actions/favorite-actions';
import FavoriteList from '../components/favorite/favoriteList.component';

const Favorites = (props) => {
  const { state, actions } = props;
  return (
    <FavoriteList isFetching={state.isFetching}
                  favorites={state.items}
                  {...actions} />
  );
};

const mapStateToProps = function(state) {
  return {
    state: state.favoritesReducer
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    actions: bindActionCreators(favoriteActions, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Favorites);