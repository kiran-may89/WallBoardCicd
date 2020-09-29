import api from '../api/index';
import {Alert} from 'react-native';
import * as Keychain from 'react-native-keychain';

export const backendCall = ({
  before,
  after,
  onSuccess,
  onError,
  method,
  params = {},
}) => async (dispatch, getState) => {
  if (before) {
    dispatch(before());
  }

  try {
    // const auth = await api.test.auth();
    const {password: token} = await Keychain.getGenericPassword();
    const result = await method(api)(token, params);
    if (onSuccess) {
      console.log(result, 'result');
      const data = await result.json();
      if (onSuccess.type) {
        dispatch(onSuccess(data));
      } else {
        onSuccess(data);
      }
      return data;
    }
  } catch (error) {
    console.log(error, error.response, 'error');
    if (onError) {
      if (onError.type) {
        dispatch(onError(error.response));
      } else {
        onError(error.response);
      }
      return;
    }
    const {
      response: {status},
    } = error;

    switch (status) {
      case 401: {
        // dispatch(push('/login'));
        break;
      }
      default: {
        break;
      }
    }
  } finally {
    if (after) {
      if (after.type) {
        dispatch(after());
      } else {
        after();
      }
    }
  }
};

export const errorHandl = (error) => {
  Alert.alert('Error', error.responseException.exceptionMessage);
};
