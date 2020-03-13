// Before this, import what you need and create a root saga as usual

import createSagaMiddleware from 'redux-saga';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {watchOffer} from './sagas';
import offerReducer from './reducers/offer';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';

export const makeStore = (initialState, options) => {
  // 1: Create the middleware
  const sagaMiddleware = createSagaMiddleware();

  // Before we returned the created store without assigning it to a variable:
  // return createStore(reducer, initialState);

  const rootReducer = combineReducers({
    offer: offerReducer,
  });

  // const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

  const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  });

  // 2: Add an extra parameter for applying middleware:
  const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk, sagaMiddleware)
  ));

  // 3: Run your sagas:
  sagaMiddleware.run(watchOffer);

  // 4: now return the store:
  return store
};
