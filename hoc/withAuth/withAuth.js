import React, {useEffect} from 'react';
import * as actions from '../../store/actions';
import {connect} from 'react-redux';
import {compose} from 'redux';

const withAuth = (WrappedComponent) => {
  return (props) => {

    const { onTryAutoSignup, firstCheck } = props;

    useEffect(() => {
      // We use a firstCheck var to avoid spamming authCheckState on each page
      if (!firstCheck) {
        onTryAutoSignup();
      }
    }, [onTryAutoSignup, firstCheck]);
    
    return (
      <WrappedComponent {...props} />
    );
  };
};

const mapStateToProps = state => {
  return {
    firstCheck: state.auth.firstCheck,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  }
};

const composeWithAuth = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAuth
);

export default composeWithAuth;
