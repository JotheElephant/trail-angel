'use strict';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  NavigatorIOS,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { connect  } from 'react-redux';

import { routes } from '../../router';
import googleApi from '../../api/google-api';
import userActions from '../../actions/user-actions';

import Login from '../login';
import SupplyList from '../../components/supply-list/SupplyList.component'
import colors from '../../components/style/colors';
import dimensions from '../../components/style/dimensions';

class More extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      city: 'Unavailable',
      dimensions: {
        width: 1,
        height: 1
      }
    }
  }

  componentWillMount() {
    googleApi.getCity(this.props.state.appReducer.geolocation.coords)
      .then((city) => {
        this.setState({
          city: city
        });
      })
      .catch((err) => {
        console.error('Error retrieving location: ', err);
      });
  }

  _handleLogoutPress() {
    this.props.actions.logoutUser()
      .then(() => {
        this.props.navigator.push({
          title: 'Welcome to TrailAngel',
          component: Login,
          index: routes.login,
          // hack to remove back button leading to login page
          leftButtonTitle: ' ',
        });
      })
  }

  _handleSupplyListPress() {

    this.props.navigator.push({
      title: 'Supply List',
      component: SupplyList,
      index: routes.supplylist,
      leftButtonTitle: 'Back',
      onLeftButtonPress: this.props.navigator.pop

    });
  }

  _onLayoutChange = (e) => {
    this.setState({
      dimensions: {
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height
      }
    });
  }

  render() {
    const orientation = this.state.dimensions.width < this.state.dimensions.height ?
      'portrait' : 'landscape';

    let profile = {
      avatarUrl: this.props.state.userReducer.avatarUrl,
      nickname: this.props.state.userReducer.nickname,
    }
    return (
      <View style=
              {{
                marginTop: dimensions.navHeight(orientation),
                alignItems: 'center'
              }}
            onLayout={this._onLayoutChange}
      >
        <View style=
                {{
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexDirection:'row'
                }}
        >
          <Image
            source={{uri: profile.avatarUrl}}
            style={styles.avatar}
          />
          <View style={{ margin: 25 }}>
            <Text style={styles.nickname}>{profile.nickname}</Text>
            <Text style={styles.hikeDistance}>Hiked: 350 km</Text>
            <Text>Location: {this.state.city}</Text>
            <Text>Favorites: {this.props.favoritesCount}</Text>
          </View>
        </View>

        <View style={styles.separator} />
        {/* this may cause problems later for tall devices */}
        <View style={{ height: 400 }}>
          {orientation === 'portrait' ?
            <View style={{ flexDirection: 'column'}}>
              <Menu handleLogoutPress={this._handleLogoutPress.bind(this)}
                    handleSupplyListPress={this._handleSupplyListPress.bind(this)} />
              <View style={{marginTop: 185}}><Logos orientation={orientation} /></View>
            </View>
              :
            <View style={{ flexDirection: 'row' }}>
              <Menu handleLogoutPress={this._handleLogoutPress.bind(this)}
                    handleSupplyListPress={this._handleSupplyListPress.bind(this)} />
              <Logos orientation={orientation} />
            </View>
          }
        </View>

      </View>
    );
  }
};

const mapStateToProps = function(state) {
  return {
    state: state
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(More);

const Menu = (props) => (
  <View style={styles.menuContainer}>
    <TouchableHighlight
      underlayColor={colors.lightgray}
      onPress={props.handleSupplyListPress}>
      <View style={styles.menuItemContainer}>
        <View style={styles.iconView}><Icon name='list-ul' size={17} color={colors.lightgray} /></View>
        <Text style={styles.menuItemText}>Supply List</Text>
        <View style={styles.iconView}><Icon style={styles.chevron} name='chevron-right' size={12} /></View>
      </View>
    </TouchableHighlight>
    <View style={styles.separator} />
    <TouchableHighlight
      underlayColor={colors.lightgray}
      onPress={() => {
                Alert.alert(
                  'Settings',
                  'This feature is not yet available.',
                  [
                    {text: 'OK'}
                  ]
                )}
              }>
      <View style={styles.menuItemContainer}>
        <View style={styles.iconView}><Icon  name='cog' size={20} color={colors.lightgray} /></View>
        <Text style={styles.menuItemText}>Settings</Text>
        <View style={styles.iconView}><Icon style={styles.chevron} name='chevron-right' size={12} /></View>
      </View>
    </TouchableHighlight>
    <View style={styles.separator} />
    <TouchableHighlight
      underlayColor={colors.lightgray}
      onPress={props.handleLogoutPress}>
      <View style={styles.menuItemContainer}>
        <View style={styles.iconView}><Icon  name='sign-out' size={20} color={colors.lightgray} /></View>
        <Text style={styles.menuItemText}>Log Out</Text>
        <View style={styles.iconView}><Icon style={styles.chevron} name='chevron-right' size={12} /></View>
      </View>
    </TouchableHighlight>
    <View style={styles.separator} />
  </View>
);

const Logos = (props) => (
  <View style=
          {{
            marginTop: 0,
            alignItems: 'center'
          }}>
    <Image source={require('../../../img/powered-by-google-on-white.png')} />
    <Image source={require('../../../img/powered-by-darksky.png')}
           style={{ marginTop: 5, opacity: 0.5 }}/>
  </View>
);

const styles = StyleSheet.create({
  avatar: {
    height: 140,
    width: 140,
    borderRadius: 20,
    margin: 10
  },

  nickname: {
    color: colors.seafoam,
    fontSize: 20,
    fontWeight: '600',
    //textAlign: 'center',
    lineHeight: 30
  },

  separator: {
    backgroundColor: colors.beige,
    height: StyleSheet.hairlineWidth,
  },

  menuContainer: {
    flexDirection: 'column',
    width: 320,
    //margin: 10,
    marginTop: 0
  },

  menuItemContainer: {
    flexDirection: 'row',
    paddingLeft: 8,
    paddingTop: 13,
    paddingBottom: 13
  },

  iconView: {
    width: 30
  },

  menuItemText: {
    fontSize: 14,
    paddingLeft: 8,
    flex: 1
  },

  chevron: {
    paddingTop: 4,
    paddingLeft: 10,
    color: colors.lightgray
  }
});
