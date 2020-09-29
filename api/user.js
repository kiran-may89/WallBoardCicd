import {serialize} from '../helpers';

// const baseURL = 'http://sf-access.azurewebsites.net/api';
export default {
  login: (token, data) =>
    fetch('https://api.smarfac.com/api/v1/users/login-wallboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }),
  getTiles: (token, data) => {
    return fetch(
      `https://api-functions.smarfac.com/api/tiles?${serialize(data)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },
  negotiate: (token, data) => {
    return fetch('https://api-functions.smarfac.com/api/negotiate', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getDemoTiles: (token, data) => {
    return fetch(
      `https://api-functions.smarfac.com/api/demotiles?${serialize(data)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },
  getTime: (token, data) => {
    return fetch('https://worldtimeapi.org/api/ip', {
      method: 'GET',
    });
  },
  initialize: (token, data) => {
    return fetch('https://api-functions.smarfac.com/api/device/initialize', {
      method: 'GET',
    });
  },
  getConfirmCode: (token, data) => {
    return fetch('https://api-functions.smarfac.com/api/device/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
  enterConfirmCode: (token, data) => {
    return fetch('https://api-functions.smarfac.com/api/device/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
};
