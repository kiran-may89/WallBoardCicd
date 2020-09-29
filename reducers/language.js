import {Alert, Platform, NativeModules, AsyncStorage} from 'react-native';
import {createReducer, createAction} from '@reduxjs/toolkit';
import DeviceInfo from 'react-native-device-info';

import {backendCall, errorHandl} from './utils';

const initState = {
  language: [],
  languageTiles: [],
  selectedLanguage: '',
  langiageLoaded: false,
};
// en_US
// en_GB
// nl_NL
// de_DE

export const set = createAction('user/setLanguage');
export const update = createAction('user/updateCurrent');
export const setErorr = createAction('user/setErorr');

const getSutible = () => {
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages //iOS 13
      : NativeModules.I18nManager.localeIdentifier;

  switch (deviceLanguage.slice(0, 2)) {
    case 'en':
      return 'English';
    case 'nl':
      return 'Nederlands';
    case 'de':
      return 'Deutsch';
    default:
      return 'English';
  }
};

export const t = (key, noExist) => (dispatch, getState) => {
  const {
    language: {selectedLanguage, language},
  } = getState();

  let sln = selectedLanguage;
  if (sln === 'system') {
    sln = getSutible();
  }

  const s = language[sln] && language[sln][key];
  if (s) {
    return s;
  }
  if (noExist) {
    return noExist;
  }

  return 'Unknown';
};

export const updateLanguage = (ln) => async (dispatch) => {
  await AsyncStorage.setItem('language', ln);
  dispatch(update(ln));
};

export const getLanguage = () => async (dispatch) => {
  const srotedList = AsyncStorage.getItem('list');
  const srotedTiles = AsyncStorage.getItem('tiles');
  const versionLn = AsyncStorage.getItem('versionLn');
  if (srotedList && srotedTiles && versionLn === DeviceInfo.getVersion()) {
    let ln = await AsyncStorage.getItem('language');
    dispatch(
      set({
        list: JSON.parse(srotedList),
        tiles: JSON.parse(srotedTiles),
        selectedLanguage: ln,
      }),
    );
    return;
  }
  const call = {
    method: (api) => api.language.getLanguage,
    onSuccess: async (data) => {
      const error = () => {
        Alert.alert('Language error');
      };
      const lists = data.data;
      if (!lists || lists.length === 0) {
        Alert.alert('Language no found');
        return;
      }
      const list = {};
      const tiles = [];
      try {
        lists.map((item) => {
          const translation = JSON.parse(item.language_json);
          tiles.push(item.language_tile);
          list[item.language_tile] = translation;
        });
      } catch (e) {
        error();
        return;
      }
      if (tiles.length === 0) {
        error();
        return;
      }
      let ln = await AsyncStorage.getItem('language');

      await AsyncStorage.setItem('list', JSON.stringify(list));
      await AsyncStorage.setItem('tiles', JSON.stringify(tiles));
      await AsyncStorage.setItem('versionLn', DeviceInfo.getVersion());
      dispatch(set({list, tiles, selectedLanguage: ln}));
    },
    onError: (error) => {
      dispatch(setErorr());
      console.log(error, 'error');
    },
  };
  await dispatch(backendCall(call));
};

export default createReducer(initState, {
  [set]: (state, action) => ({
    ...state,
    langiageLoaded: true,
    language: action.payload.list,
    languageTiles: action.payload.tiles,
    selectedLanguage: action.payload.selectedLanguage,
  }),
  [setErorr]: (state, action) => ({
    ...state,
    langiageLoaded: true,
  }),
  [update]: (state, action) => ({
    ...state,
    selectedLanguage: action.payload,
  }),
});
