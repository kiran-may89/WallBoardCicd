import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  View,
  Text,
  Platform,
  NativeModules,
  Image,
} from 'react-native';
import KeyEvent from 'react-native-keyevent';
import {connect} from 'react-redux';
import * as Keychain from 'react-native-keychain';
import {
  useNavigationComponentDidAppear,
  useNavigationComponentDidDisappear,
} from 'react-native-navigation-hooks';
import {isIphoneX} from 'react-native-device-detection';
import DeviceInfo from 'react-native-device-info';
import ErrorHandler from '../errorHandler/index';

import {countFormat, navigateTo, trigerRotation} from '../../../helpers';
import ColorsWrapper from '../../../colors';

import {initUser, checkConnection} from '../../../reducers/user';
import {t} from '../../../reducers/language';
import ListBase from './listBase';
import Loading from '../loading';

import RNReactNativeLocale from 'react-native-locale-listener';
import RNRestart from 'react-native-restart';

import cat from '../../../ios/asset/cat.png';

let borderId;
const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages //iOS 13
    : NativeModules.I18nManager.localeIdentifier;

const useForceUpdate = () => {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => ++value); // update the state to force render
};

const MainMenu = ({
  Colors,
  navigation,
  t,
  userIP,
  componentId,
  initUser,
  checkConnection,
}) => {
  const [format, setFormat] = useState(countFormat());
  const [userStatus, setUserStatus] = useState('authorized');
  const [selectedKey, setSelectedKey] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isBorder, setShowBorder] = useState(false);

  const forceUpdate = useForceUpdate();
  useNavigationComponentDidAppear(
    (e) => {
      forceUpdate();
      (async () => {
        const {password: token} = await Keychain.getGenericPassword();
        if (token) {
          setUserStatus('authorized');
        } else {
          setUserStatus('unauthorized');
        }
        // if (loaded) {
        //   const isData = await initUser();
        //   if (isData && token) {
        //     await checkConnection();
        //   }
        // }
      })();
    },
    {componentId},
  );

  const logout = () => {
    (async () => {
      await Keychain.resetGenericPassword();
      setUserStatus('unauthorized');
    })();
  };
  const navigate = (r, params, d) => {
    console.log('navigate', r, params, d, componentId);
    navigateTo(componentId, r, params, d);
  };

  const rerender = () => setFormat(countFormat());

  const TVEventHandler = async (key, data) => {
    window.isTV = true;

    // const userStatus = await checkStatus();
    const statusCount = actions[userStatus].length - 1;
    actions[userStatus].forEach((item, index) => {
      if (item.key === Number(key) - 7) {
        setSelectedKey(index);
      }
    });
    if (Number(key) === 14) {
      trigerRotation();
      return;
    }
    const okay = () => {
      if (borderId) {
        clearInterval(borderId);
      }
      setShowBorder(true);

      const i = setTimeout(() => {
        setShowBorder(false);
      }, 300);
      borderId = i;
      if (
        actions[userStatus][selectedKey] &&
        actions[userStatus][selectedKey].action
      ) {
        actions[userStatus][selectedKey].action();
      }
    };

    switch (Number(key)) {
      case 7: // 0 key
        break;
      case 8: // 1 key
        if (userStatus === 'authorized') {
          navigate('App');
        } else {
          if (userIP.data) {
            navigate('ConfirmCode');
          }
        }
        break;
      case 9: // 2 key
        if (userStatus === 'authorized') {
        } else {
          navigate('EnterConfirmCode');
        }
        break;
      case 10: // 3 key
        if (userStatus === 'authorized') {
          logout();
        } else {
          navigate('Login');
        }
        break;
      case 11: // 4 key
        navigate('ChangeTheme');
        break;
      case 12: // 5 key
        navigate('ChangeMachineSize');
        break;
      case 13: // 6 key
        navigate('ChangeLanguage');
        break;
      case 15: // 8 key
        navigate('App', {demo: 'demo-factory'});
        break;
      case 16: // 9 key
        if (userStatus === 'authorized') {
          logout();
        } else {
          // navigate('TestPage');
        }
        break;
      case 19: {
        // UP
        if (selectedKey === 0) {
          setSelectedKey(statusCount);
        } else {
          setSelectedKey(selectedKey - 1);
        }

        break;
      }
      case 20: {
        // down
        if (selectedKey === statusCount) {
          setSelectedKey(0);
        } else {
          setSelectedKey(selectedKey + 1);
        }
        break;
      }
      case 23: // okay
        okay();
        break;
      case 66: //KEYCODE_ENTER
        okay();
        break;
    }
  };

  const {scale, isTV, isPortrail} = format;

  const changeSystemLanguage = (language) => {
    if (deviceLanguage !== language) {
      RNRestart.Restart();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      KeyEvent.onKeyUpListener((keyEvent) => {
        console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
        TVEventHandler(keyEvent.keyCode);
      });
    }, 1000);
    Dimensions.addEventListener('change', rerender);

    (async () => {
      const loadedTriger = () =>
        setTimeout(() => {
          setLoaded(true);
        }, 1000);
      const {password: token} = await Keychain.getGenericPassword();
      if (token) {
        setUserStatus('authorized');
        navigate('App', {}, 0);
        loadedTriger();
        return;
      } else {
        setUserStatus('unauthorized');
      }

      const isData = await initUser();

      if (!isData) {
        loadedTriger();
        return;
      }
      if (isData.data) {
        navigate('ConfirmCode', {}, 0);
        loadedTriger();
        return;
      }
      if (!isData.data) {
        navigate('EnterConfirmCode', {}, 0);
        loadedTriger();
        return;
      }
      loadedTriger();
      return;
      // if (token && isData) {
      //   // const res = await checkConnection();
      //   const res = true;
      //   const isConnection = Boolean(res);

      //   if (token && isConnection) {
      //     navigate('App', {}, 0);
      //     loadedTriger();
      //     return;
      //   }
      //   loadedTriger();
      //   return;
      // } else {
      //   loadedTriger();
      //   return;
      // }
    })();

    RNReactNativeLocale.addLocaleListener(changeSystemLanguage);
    return () => {
      console.log('destroy');
      RNReactNativeLocale.removeLocaleListener(changeSystemLanguage);
      Dimensions.removeEventListener('change', rerender);
    };
  }, []);

  KeyEvent.onKeyUpListener((keyEvent) => {
    console.log(`onKeyUp keyCode: ${keyEvent.keyCode}`);
    TVEventHandler(keyEvent.keyCode);
  });

  if (!loaded) {
    return <Loading />;
  }
  const actions = {
    unauthorized: [
      {
        name: t(
          'activate_by_entering_code_shown_on_another_device',
          'Activate by entering a code that is shown on another device',
        ),
        key: 2,
        action: () => navigate('EnterConfirmCode'),
      },
      {
        name: t('activate_with_password', 'Activate with password'),
        key: 3,
        action: () => navigate('Login'),
      },
      {
        name: t('change_theme', 'Change dark/light theme'),
        key: 4,
        action: () => navigate('ChangeTheme'),
      },
      {
        name: t('change_tile_size', 'Change minimum machine tile size'),
        key: 5,
        action: () => navigate('ChangeMachineSize'),
      },
      {
        name: t(
          'change_language',
          'Change language / Sprache wechseln / Verander taal',
        ),
        key: 6,
        action: () => navigate('ChangeLanguage'),
      },
      {
        name: t('demo_mode', 'Demo factory'),
        key: 8,
        action: () => navigate('App', {demo: 'demo-factory'}),
      },
    ],
    authorized: [
      {
        name: t('go_to_wallboard', 'Go to Machine Status Wallboard'),
        key: 1,
        action: () => navigate('App'),
      },
      {
        name: t('deactivate_wallboard', 'Deactivate Wallboard'),
        key: 3,
        action: logout,
      },
      {
        name: t('change_theme', 'Change dark/light theme'),
        key: 4,
        action: () => navigate('ChangeTheme'),
      },
      {
        name: t('change_tile_size', 'Change minimum machine tile size'),
        key: 5,
        action: () => navigate('ChangeMachineSize'),
      },
      {
        name: t(
          'change_language',
          'Change language / Sprache wechseln / Verander taal',
        ),
        key: 6,
        action: () => navigate('ChangeLanguage'),
      },
      {
        name: t('demo_mode', 'Demo factory'),
        key: 8,
        action: () => navigate('App', {demo: 'demo-factory'}),
      },
    ],
  };

  if (userIP.data) {
    actions.unauthorized.unshift({
      name: t(
        'activate_by_confirming_code_on_other_device',
        'Activate by confirming a code on another device',
      ),
      key: 1,
      action: () => navigate('ConfirmCode'),
    });
  }

  if (isTV || window.isTV) {
    actions[userStatus].splice(
      userStatus === 'authorized' ? 5 : userIP.data ? 6 : 5,
      0,
      {
        name: t('rotate_screen', 'Rotate screen'),
        key: 7,
        action: () => trigerRotation(),
      },
    );
  }

  return [
    <ListBase
      {...{
        format,
        list: actions[userStatus],
        selectedKey,
        header: t('main_menu', 'Main Menu'),
        isBorder,
      }}
    />,
    <View
      style={{
        position: 'absolute',
        top: scale(isIphoneX && isPortrail ? 80 : 20),
        right: scale(isIphoneX && !isPortrail ? 80 : 20),
      }}>
      <Text style={{color: Colors('label'), fontSize: scale(5), opacity: 0.5}}>
        v{DeviceInfo.getVersion()} -{' '}
        <Image source={cat} style={{width: scale(10), height: scale(10)}} />
      </Text>
    </View>,
  ];
};

const mapStateToProps = ({user: {userIP, error}}) => ({userIP, error});

export default connect(mapStateToProps, {t, initUser, checkConnection})(
  ColorsWrapper(ErrorHandler(MainMenu)),
);
