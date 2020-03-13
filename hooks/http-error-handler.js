import {useState, useEffect} from 'react';

export default httpClient => {
  const [error, setError] = useState(null);

  const requestInterceptor = httpClient.interceptors.request.use(req => {
    setError(null);
    return req;
  });

  const responseInterceptor =  httpClient.interceptors.response.use(res => res, err => {
    console.log('error', err);
    setError(err);
  });

  useEffect(() => {
    return () => {
      httpClient.interceptors.request.eject(requestInterceptor);
      httpClient.interceptors.request.eject(responseInterceptor);
    }
  }, [requestInterceptor, responseInterceptor]);

  const errorConfirmedHandler = () => {
    setError(null);
  };

  return [error, errorConfirmedHandler];

};
