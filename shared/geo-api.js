import {API_GEO_BASE_PATH} from './contants';

export const searchCity = (search, options = {boost: 'population', limit: 5}) => {

  let optionsString = '';

  if (options) {
    console.log('options');
    optionsString = Object.keys(options).map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`;
    }).join('&');
  }

  return fetch(`${API_GEO_BASE_PATH}communes?nom=${search}&${optionsString}`)
    .then(response => response.json())
    .then(response => {
      return response;
    }).catch(e => {
      console.error(e);
      return [];
    })
};
