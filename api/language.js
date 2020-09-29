import {serialize} from '../helpers';

// const baseURL = 'http://sf-access.azurewebsites.net/api';
export default {
  getLanguage: (token, data) => {
    return fetch(
      'https://smartfactorynlfunctions.azurewebsites.net/api/language/getwallboardlanguage',
      {
        method: 'GET',
      },
    );
  },
};
