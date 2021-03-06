// import App from 'next/app';
import React, { Component } from "react";
import 'normalize.css/normalize.css';
import '../public/style/global.css';
import {Provider} from 'react-redux';
import {makeStore} from '../store/store';
import {FirebaseContext, useAuth} from '../firebase';

// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

// export default MyApp
const store = makeStore();

const MyApp: React.FC<any> = ({ Component, pageProps }) => {
  const {user, firebase, loading} = useAuth();

  return (
    <Provider store={store}>
      <FirebaseContext.Provider value={{user, firebase, loading}}>
        <Component {...pageProps} />
      </FirebaseContext.Provider>
    </Provider>
  );
}

export default MyApp;
