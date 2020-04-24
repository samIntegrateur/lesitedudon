import createSagaMiddleware from 'redux-saga';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {watchOffer, watchAuth, watchConversation} from './sagas';
import offerReducer from './reducers/offer';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
import authReducer from './reducers/auth';
import conversationReducer from './reducers/conversation';
import { StoreState } from "./types/store.type";

// todo : cleanup
// a lot of actions aren't used anymore since with use firebase client (with context) instead of rest api
// Maybe keep a store for post actions ?
export const makeStore = (initialState?: StoreState) => {
  // 1: Create the middleware
  const sagaMiddleware = createSagaMiddleware();

  // Before we returned the created store without assigning it to a variable:
  // return createStore(reducer, initialState);

  const rootReducer = combineReducers({
    auth: authReducer,
    offer: offerReducer,
    conversation: conversationReducer,
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
  sagaMiddleware.run(watchAuth);
  sagaMiddleware.run(watchOffer);
  sagaMiddleware.run(watchConversation);

  // 4: now return the store:
  return store
};
