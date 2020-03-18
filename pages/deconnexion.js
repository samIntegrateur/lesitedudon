import React, {useEffect} from 'react';
import Layout from '../layout/Layout';
import {connect} from 'react-redux';
import * as actions from '../store/actions/';
import Button from '../components/UI/Button/Button';
import Spinner from '../components/UI/Spinner/Spinner';

const Deconnexion = (props) => {

  let display = null;

  const {onLogout} = props;

  useEffect(() => {
    onLogout();
  }, [onLogout]);

  if (props.isAuthenticated) {
    display = Spinner;
  } else {
    display = (
      <div>
        <p>Vous avez bien été déconnecté !</p>
        <Button type="a"
                style="default"
                href="/">
          Retourner à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <Layout
      title="Déconnexion - Le site du don"
      description="Déconnexion - Le site du don">
     {display}
    </Layout>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Deconnexion);
