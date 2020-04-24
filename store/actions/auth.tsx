import { AuthActionTypes } from "./actionTypes";
import { Action } from "redux";

export const authStart = (
): Action<AuthActionTypes.AUTH_START> => {
  return {
    type: AuthActionTypes.AUTH_START,
  };
};

export interface AuthSuccessAction extends Action<AuthActionTypes.AUTH_SUCCESS> {
  idToken: string;
  userId: string;
}
export const authSuccess = (
  idToken: string,
  localId: string,
): AuthSuccessAction => {
  return {
    type: AuthActionTypes.AUTH_SUCCESS,
    idToken: idToken,
    userId: localId,
  };
};

export interface AuthFailAction extends Action<AuthActionTypes.AUTH_FAIL> {
  error: Error;
}
export const authFail = (
  error: Error,
): AuthFailAction => {
  return {
    type: AuthActionTypes.AUTH_FAIL,
    error,
  };
};

export const logout = (
): Action<AuthActionTypes.AUTH_INITIATE_LOGOUT> => {
  return {
    type: AuthActionTypes.AUTH_INITIATE_LOGOUT,
  };
};

export const logoutSucceed = (
): Action<AuthActionTypes.AUTH_LOGOUT> => {
  return {
    type: AuthActionTypes.AUTH_LOGOUT,
  }
};

export interface AuthCheckTimeoutAction extends Action<AuthActionTypes.AUTH_CHECK_TIMEOUT> {
  expirationTime: number;
}
export const checkAuthTimeout = (
  expirationTime: number,
): AuthCheckTimeoutAction => {
  return {
    type: AuthActionTypes.AUTH_CHECK_TIMEOUT,
    expirationTime,
  }
};

export interface AuthUserAction extends Action<AuthActionTypes.AUTH_USER> {
  email: string;
  password: string;
  isSignin: boolean;
}
export const auth = (
  email: string,
  password: string,
  isSignin: boolean,
): AuthUserAction => {
  return {
    type: AuthActionTypes.AUTH_USER,
    email,
    password,
    isSignin,
  }
};

export const authCheckState = (
): Action<AuthActionTypes.AUTH_CHECK_STATE> => {
  return {
    type: AuthActionTypes.AUTH_CHECK_STATE,
  };
};

export const authSetFirstCheck = (
): Action<AuthActionTypes.AUTH_SET_FIRST_CHECK> => {
  return {
    type: AuthActionTypes.AUTH_SET_FIRST_CHECK,
  };
};

export type AuthAction =
  | Action<AuthActionTypes.AUTH_START>
  | AuthSuccessAction
  | AuthFailAction
  | Action<AuthActionTypes.AUTH_INITIATE_LOGOUT>
  | Action<AuthActionTypes.AUTH_LOGOUT>
  | AuthCheckTimeoutAction
  | AuthUserAction
  | Action<AuthActionTypes.AUTH_CHECK_STATE>
  | Action<AuthActionTypes.AUTH_SET_FIRST_CHECK>
;
