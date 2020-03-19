import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility';

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  firstCheck: false,
};

const authStart = (state, action) => {
  return updateObject(state, {error: null, loading: true});
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.idToken,
    userId: action.userId,
    error: null,
    loading: false,
  });
};

const authFail = (state, action) => {
  return updateObject(state, {error: action.error, loading: false});
};

const authLogout = (state, action) => {
  return updateObject(state, { token: null, userId: null });
};

const authSetFirstCheck = (state, action) => {
  return updateObject(state, { firstCheck: true });
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START : return authStart(state, action);
    case actionTypes.AUTH_SUCCESS : return authSuccess(state, action);
    case actionTypes.AUTH_FAIL : return authFail(state, action);
    case actionTypes.AUTH_LOGOUT : return authLogout(state, action);
    case actionTypes.AUTH_SET_FIRST_CHECK : return authSetFirstCheck(state, action);
    default:
      return state;
  }
};

export default authReducer;
