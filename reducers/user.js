import {Alert} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {createReducer, createAction} from '@reduxjs/toolkit';
import {backendCall, errorHandl} from './utils';
import DeviceInfo from 'react-native-device-info';
import {Navigation} from 'react-native-navigation';
import {HubConnectionBuilder, LogLevel} from '@aspnet/signalr';

import {t} from './language';

import {navigateTo} from '../helpers';

import jwt from 'jwt-decode';
import moment from 'moment';
const initState = {
  machines: [],
  machinesLoaded: false,
  timeOffset: 0,
  minimumTileSize: 2,
  confirmCode: {codeLoaded: false, code: ''},
  userIP: {loaded: false, data: ''},
  error: {},
  enteringCode: false,
};

export const set = createAction('user/setMachines');
export const setTime = createAction('user/setTime');
export const initIP = createAction('user/initIP');
export const initIPError = createAction('user/initIPError');
export const initConfirmCodeAction = createAction('user/initConfirmCodeAction');
export const setConfirmCode = createAction('user/confirmCode');
export const setConnectionError = createAction('user/setConnectionError');
export const updateTile = createAction('user/updateTile');
export const clearTilesAction = createAction('user/clearTiles');
export const trigerEnteringCode = createAction('user/trigerEnteringCode');
export const endEnteringCode = createAction('user/endEnteringCode');

export const updateTiles = (data) => (dispatch) => {
  dispatch(updateTile(data));
};

export const clearTiles = (data) => (dispatch) => {
  dispatch(clearTilesAction(data));
};

export const enterConfirmCode = (code, componentId, setCodes) => async (
  dispatch,
  getState,
) => {
  const device_id = DeviceInfo.getUniqueId();

  const {
    user: {userIP},
  } = getState();
  let connector_id = 'demo-factory';
  if (userIP.data && userIP.data.connector_id) {
    connector_id = userIP.data.connector_id;
  }

  const data = {
    connectorId: connector_id,
    deviceId: device_id + window.devID,
    status: true,
    code,
  };
  dispatch(trigerEnteringCode());
  const call = {
    method: (api) => api.user.enterConfirmCode,
    params: data,
    onSuccess: async (res) => {
      setTimeout(() => {
        dispatch(endEnteringCode());
      }, 1000);
      if (res && res.data && res.data.token) {
        await Keychain.setGenericPassword('token', res.data.token);
        if (componentId) {
          navigateTo(componentId, 'App');
        }
        return;
      }
      Alert.alert('Error', res.message);
      setCodes(['', '', '', '', '', '', '', '', '']);
    },
    onError: (error) => {
      dispatch(endEnteringCode());
      console.log(error, 'error');
    },
  };
  await dispatch(backendCall(call));
};

export const getConfirmCode = (trigerTimer) => async (dispatch, getState) => {
  const device_id = DeviceInfo.getUniqueId();

  const {
    user: {userIP},
  } = getState();
  let connector_id = 'demo-factory';
  if (userIP.data && userIP.data.connector_id) {
    connector_id = userIP.data.connector_id;
  }

  const data = {
    connector_id,
    device_id: device_id + window.devID,
    is_device: true,
  };
  dispatch(initConfirmCodeAction());
  const call = {
    method: (api) => api.user.getConfirmCode,
    params: data,
    onSuccess: async (res) => {
      console.log(res, 'res');
      if (res.data) {
        dispatch(setConfirmCode(res.data));
        trigerTimer();
        return;
      }
      Alert.alert('Error', res.message);
      dispatch(setConfirmCode(res.data));
    },
    onError: (error) => {
      console.log(error, 'error');
    },
  };
  await dispatch(backendCall(call));
};

export const initConfirmCode = () => async (dispatch, getState) => {
  const device_id = DeviceInfo.getUniqueId();
  const {
    user: {userIP},
  } = getState();
  let connector_id = 'demo-factory';
  if (userIP.data && userIP.data.connector_id) {
    connector_id = userIP.data.connector_id;
  }
  const data = {
    connector_id,
    device_id: device_id + window.devID,
    is_device: false,
  };
  const call = {
    method: (api) => api.user.getConfirmCode,
    params: data,
    onSuccess: async (res) => {
      console.log(res, 'res');
    },
    onError: (error) => {
      console.log(error, 'error');
    },
  };
  await dispatch(backendCall(call));
};

export const initUser = () => async (dispatch) => {
  const call = {
    method: (api) => api.user.initialize,
    onSuccess: async (res) => {
      console.log(res, 'res');
      dispatch(initIP(res.data));
    },
    onError: (error) => {
      console.log(error, 'error');
      dispatch(initIP(null));
      dispatch(initIPError());
    },
  };
  return await dispatch(backendCall(call));
};

export const checkConnection = () => async (dispatch) => {
  const call = {
    method: (api) => api.user.negotiate,
    onSuccess: async (res) => {
      console.log(res, 'res');
      if (!res.url || !res.accessToken) {
        console.log('negotiate error');
        return;
      }
      try {
        connection = new HubConnectionBuilder()
          .withUrl(res.url, {accessTokenFactory: () => res.accessToken})
          .configureLogging(LogLevel.Information)
          .build();
      } catch (err) {
        console.log(err, 'err');
        dispatch(setConnectionError());
        // setTimeout(() => start(), 5000);
      }

      async function start() {
        try {
          await connection.start();
          console.log('connected');
          connection.stop();
          return true;
        } catch (err) {
          console.log(err, 'err');
          dispatch(setConnectionError());
          // setTimeout(() => start(), 5000);
        }
      }
      return start();
    },
    onError: (error) => {
      dispatch(setConnectionError());
      console.log(error, 'error');
    },
  };
  return await dispatch(backendCall(call));
};

export const userLogin = (data, callback, onError) => async (dispatch) => {
  const call = {
    method: (api) => api.user.login,
    params: data,
    onSuccess: async (res) => {
      if (res && res.result && res.result.token) {
        await Keychain.setGenericPassword('token', res.result.token);
        if (callback) {
          callback();
        }
        return;
      }
      onError();
      Alert.alert(
        'Error',
        dispatch(
          t(
            'invalid_email_password',
            'Invalid email/password combination, please try again',
          ),
        ),
      );

      return;
    },
    onError: (error) => {
      onError();
      console.log(error, 'error');
    },
  };
  await dispatch(backendCall(call));
};

let machineStore = {};
let connection;
export const negotiateClose = () => async () => {
  if (connection) {
    connection.stop();
  }
};
export const negotiate = () => async (dispatch) => {
  const call = {
    method: (api) => api.user.negotiate,
    onSuccess: async (res) => {
      console.log(res, 'res');
      if (!res.url || !res.accessToken) {
        console.log('negotiate error');
        return;
      }
      connection = new HubConnectionBuilder()
        .withUrl(res.url, {accessTokenFactory: () => res.accessToken})
        .configureLogging(LogLevel.Information)
        .build();

      async function start() {
        try {
          await connection.start();
          console.log('connected');
        } catch (err) {
          console.log(err);
          setTimeout(() => start(), 5000);
        }
      }

      const {password: token} = await Keychain.getGenericPassword();

      let taget = 'demo-factory';

      if (token) {
        const userInfo = jwt(token);
        taget = userInfo.groupsid;
      }

      connection.on(taget, (machine) => {
        machineStore[machine.machineId] = machine;
      });

      // connection.onclose(async () => {
      //   console.log('onclose');
      //   await start();
      // });

      start();
    },
    onError: (error) => {
      console.log(error, 'error');
    },
  };
  await dispatch(backendCall(call));
};

export const updateTilesInfo = (data) => (dispatch, getState) => {
  const {
    user: {machines, timeOffset},
  } = getState();
  if (!machines || !machines.length) {
    return;
  }
  const time = moment.utc().add(timeOffset, 'milliseconds');

  const newData = JSON.parse(JSON.stringify(machines));
  const array = newData.map((item) => {
    (() => {
      if (machineStore[item.machineId]) {
        item = {
          ...item,
          ...machineStore[item.machineId],
        };
      }

      if (item.statusId === 1 || item.statusId === 2) {
        if (machineStore[item.machineId]) {
          let history = [
            {
              green: item.chartTime4_1,
              blue: item.chartTime4_2,
            },
            {
              green: item.chartTime3_1,
              blue: item.chartTime3_2,
            },
            {
              green: item.chartTime2_1,
              blue: item.chartTime2_2,
            },
            {
              green: item.chartTime1_1,
              blue: item.chartTime1_2,
            },
          ];

          const lastModified = time.diff(
            moment.utc(item.lastModified),
            'seconds',
          );

          const current = {
            green: 0,
            blue: 0,
          };

          if (item.statusId === 1) {
            item.time = {
              green: lastModified,
              blue: 0,
              history: history,
            };
          }

          if (item.statusId === 1) {
            current.green = lastModified;
          }
          if (item.statusId === 2) {
            const g = item.chartTime0_1;
            current.green = g;
            current.blue = lastModified;
          }

          item.time = {
            ...current,
            history,
          };
        } else {
          if (item.statusId === 1) {
            item.time.green += 1;
          }
          if (item.statusId === 2) {
            item.time.blue += 1;
          }
        }
      }
    })();
    return item;
  });
  machineStore = {};
  console.log(array, 'array');
  dispatch(set(array));
};

export const getTiles = (componentId, isDemo) => async (dispatch) => {
  // if (isDemo) {
  //   await dispatch(
  //     userLogin({email: 'dev29111996@gmail.com', password: '!1Test1234'}),
  //   );
  // }
  const unlogin = async () => {
    await Keychain.resetGenericPassword();
    return Navigation.popToRoot(componentId);
  };

  let userInfo;

  if (!isDemo) {
    const {password: token} = await Keychain.getGenericPassword();

    if (!token) {
      return await unlogin();
    }
    userInfo = jwt(token);
    if (!userInfo || !userInfo.groupsid) {
      return await unlogin();
    }
  }

  const callTime = {
    method: (api) => api.user.getTime,
    onSuccess: async (data) => {
      console.log(data, 'callTime - data');
      if (data && data.utc_datetime) {
        const offset =
          moment.utc(data.utc_datetime).format('x') - moment.utc().format('x');
        dispatch(setTime(offset));
        return offset;
      } else {
        dispatch(setTime(0));
        return 0;
      }
    },
    onError: (error) => {
      dispatch(setTime(0));
      console.log(error, 'error get time');
    },
  };

  const call = {
    method: (api) => (isDemo ? api.user.getDemoTiles : api.user.getTiles),
    params: {connector_id: isDemo ? isDemo : userInfo.groupsid},
    onSuccess: async (data) => {
      console.log(data, 'tile data');
      if (data.status_code === 401) {
        return unlogin();
      }
      const offsetData = await dispatch(backendCall(callTime));
      let offset = 0;
      if (offsetData && offsetData.utc_datetime) {
        offset =
          moment.utc(offsetData.utc_datetime).format('x') -
          moment.utc().format('x');
      }

      if (data.has_error) {
        Navigation.popToRoot(componentId);
        return Alert.alert('Error', data.message);
      }

      if (data.data.length === 0) {
        navigateTo(componentId, 'NoMachines');
        return;
      }
      const time = moment.utc().add(offset, 'milliseconds');

      data.data.forEach((item) => {
        if (item.statusId === 1 || item.statusId === 2) {
          let history = [
            {
              green: item.chartTime4_1,
              blue: item.chartTime4_2,
            },
            {
              green: item.chartTime3_1,
              blue: item.chartTime3_2,
            },
            {
              green: item.chartTime2_1,
              blue: item.chartTime2_2,
            },
            {
              green: item.chartTime1_1,
              blue: item.chartTime1_2,
            },
          ];

          const current = {
            green: 0,
            blue: 0,
          };
          const lastModified = time.diff(
            moment.utc(item.lastModified),
            'seconds',
          );

          if (item.statusId === 1) {
            current.green = lastModified;
          }
          if (item.statusId === 2) {
            const g = item.chartTime0_1;
            current.green = g;
            current.blue = lastModified;
          }

          item.time = {
            ...current,
            history: history,
          };
        }
      });
      console.log(data.data, 'data.data123');
      dispatch(set(data.data));
    },
    onError: (error) => {
      console.log(error, 'error');
      unlogin();
    },
  };

  await dispatch(backendCall(call));
};

export default createReducer(initState, {
  [set]: (state, action) => ({
    ...state,
    machines: action.payload,
    machinesLoaded: true,
  }),
  [setTime]: (state, action) => ({
    ...state,
    timeOffset: action.payload,
  }),
  [setConfirmCode]: (state, action) => ({
    ...state,
    confirmCode: {
      codeLoaded: true,
      code: action.payload,
    },
  }),
  [initConfirmCodeAction]: (state, action) => ({
    ...state,
    confirmCode: {
      codeLoaded: false,
      code: '',
    },
  }),
  [updateTile]: (state, action) => ({
    ...state,
    minimumTileSize: action.payload,
  }),
  [initIP]: (state, action) => ({
    ...state,
    userIP: {
      loaded: true,
      data: action.payload,
    },
  }),
  [initIPError]: (state, action) => ({
    ...state,
    error: {
      type: 'noInternet',
    },
  }),
  [setConnectionError]: (state, action) => ({
    ...state,
    error: {
      type: 'noConnection',
    },
  }),
  [clearTilesAction]: (state, action) => ({
    ...state,
    machines: [],
    machinesLoaded: false,
    timeOffset: 0,
  }),
  [trigerEnteringCode]: (state, action) => ({
    ...state,
    enteringCode: true,
  }),
  [endEnteringCode]: (state, action) => ({
    ...state,
    enteringCode: false,
  }),
});
