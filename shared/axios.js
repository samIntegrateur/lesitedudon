import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://le-site-du-don.firebaseio.com/'
});

export default instance;
