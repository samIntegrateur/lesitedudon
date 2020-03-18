import React, {useState} from 'react';
import {checkValidity, updateObject} from '../../../shared/utility';
import Input from '../../UI/Input/Input';
import Spinner from '../../UI/Spinner/Spinner';
import Button from '../../UI/Button/Button';
import * as actions from '../../../store/actions/';
import {connect} from 'react-redux';

const ConnexionForm = (props) => {

  let formDisplay = null;
  let errorMessage = null;

  const [controls, setControls] = useState({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: ''
      },
      label: 'E-mail',
      value: '',
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: ''
      },
      label: 'Mot de passe',
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    },
  });
  const [formIsValid, setFormIsValid] = useState(false);
  const [isSignin, setIsSignin] = useState(true);

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(controls, {
      [controlName]: updateObject(controls[controlName], {
        value: event.target.value,
        valid: checkValidity(event.target.value, controls[controlName].validation),
        touched: true,
      })
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedControls) {
      formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
    }

    setControls(updatedControls);
    setFormIsValid(formIsValid);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onAuth(controls.email.value, controls.password.value, isSignin);
  };

  const switchAuthModeHandler = () => {
    setIsSignin(!isSignin);
  };

  const formElementArray = [];
  for (let key in controls) {
    formElementArray.push({
      id: key,
      config: controls[key]
    })
  }

  if (props.loading) {
    formDisplay = <Spinner />;
  } else {
    formDisplay = (
      <div>
        {
          formElementArray.map(formElement => (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              invalid={!formElement.config.valid}
              shouldValidate={formElement.config.validation}
              touched={formElement.config.touched}
              changed={(event) => inputChangedHandler(event, formElement.id)}
            />
          ))
        }

        <Button
          type="submit"
          style="secondary"
          disabled={!formIsValid}>
          Valider
        </Button>
        <div>
          <Button
            type="button"
            style="link"
            clicked={switchAuthModeHandler}>
            {isSignin ? 'Créer un compte' : 'J\'ai déjà un compte, me connecter'}
          </Button>
        </div>
      </div>
    );
  }

  if (props.error) {
    errorMessage = (
      <p>{props.error.message}</p>
    );
  }

  if (props.isAuthenticated) {
    formDisplay = (
      <div>
        <p>Vous avez bien été connecté !</p>
        <Button type="a"
                style="default"
                href="/">
          Retourner à l'accueil
        </Button>
      </div>
    )
  }

  return (
    <div>
      {errorMessage}

      <form onSubmit={submitHandler}>
        <h1>{isSignin ? 'Connexion' : 'Je crée mon compte'}</h1>

        {formDisplay}
      </form>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignin) => dispatch(actions.auth(email, password, isSignin)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnexionForm);
