import {API_GEO_BASE_PATH} from './constants';

interface SearchCityOptions {
    [key: string]: string | number;
}
export const searchCity = (
  search: string,
  options: SearchCityOptions = { boost: 'population', limit: 5 }
  ): Promise<[]> => {

  let optionsString = '';

  optionsString = Object.keys(options).map((key) => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`;
  }).join('&');

  return fetch(`${API_GEO_BASE_PATH}communes?nom=${search}&${optionsString}`)
    .then(response => response.json())
    .then(response => {
      return response;
    }).catch(e => {
      console.error(e);
      return [];
    })
};
