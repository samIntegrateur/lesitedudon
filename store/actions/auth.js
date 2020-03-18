import * as actionTypes from './actionTypes';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (idToken, localId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: idToken,
    userId: localId,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error,
  };
};

export const logout = () => {
  return {
    type: actionTypes.AUTH_INITIATE_LOGOUT,
  };
};

export const logoutSucceed = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
  }
};

export const checkAuthTimeout = (expirationTime) => {
  return {
    type: actionTypes.AUTH_CHECK_TIMEOUT,
    expirationTime,
  }
};

export const auth = (email, password, isSignin) => {
  return {
    type: actionTypes.AUTH_USER,
    email,
    password,
    isSignin,
  }
};

export const authCheckState = () => {
  return {
    type: actionTypes.AUTH_CHECK_STATE,
  };
};

export const authSetFirstCheck = () => {
  return {
    type: actionTypes.AUTH_SET_FIRST_CHECK,
  };
};
