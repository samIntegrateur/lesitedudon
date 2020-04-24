import {updateObject} from '../../shared/utility';
import { AuthState } from "../types/auth";
import { Reducer } from "redux";
import { AuthAction } from "../actions";
import { AuthActionTypes } from "../actions/actionTypes";

const initialState: AuthState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  firstCheck: false,
};

const authReducer: Reducer<AuthState, AuthAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case AuthActionTypes.AUTH_START : {
      return updateObject(state, {
        error: null,
        loading: true
      });
    }
    case AuthActionTypes.AUTH_SUCCESS : {
      return updateObject(state, {
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false,
      });
    }
    case AuthActionTypes.AUTH_FAIL : {
      return updateObject(state, {
        error: action.error,
        loading: false
      });
    }
    case AuthActionTypes.AUTH_LOGOUT : {
      return updateObject(state, {
        token: null,
        userId: null
      });
    }
    case AuthActionTypes.AUTH_SET_FIRST_CHECK : {
      return updateObject(state, {
        firstCheck: true
      });
    }
    default:
      return state;
  }
};

export default authReducer;
