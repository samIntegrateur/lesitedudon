import React, {useContext, useEffect, useState} from 'react';
import FirebaseContext from '../../../firebase/context';
import {checkValidity, updateObject} from '../../../shared/utility';
import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import Input from '../../UI/Input/Input';

// todo refactor as it's similar to connexion, use classes ?
const InscriptionForm = () => {

  let formDisplay = null;
  let errorMessage = null;

  const {firebase} = useContext(FirebaseContext);

  // todo check username unicity
  const [controls, setControls] = useState({
    username: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: ''
      },
      label: 'Pseudo',
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false
    },
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
    confirmPassword: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: ''
      },
      label: 'Confirmer mot de passe',
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let isMounted = true;

  useEffect(() => {
    return () => {
      isMounted = false;
    }
  }, []);

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

    if (controls.password.value === controls.confirmPassword.value) {
      setIsLoading(true);
      firebase.register({
        username: controls.username.value,
        email: controls.email.value,
        password: controls.password.value,
      }).then(() => {
        if (isMounted) {
          setIsLoading(false);
          setIsSuccess(true);
        }
      }).catch(e => {
        if (isMounted) {
          setIsLoading(false);
          setHasError(e);
        }
      });
    } else {
      // todo : this kind of message should be real time
      const e = { message: 'Les mots de passes ne correspondent pas'};
      setHasError(e);
    }
  };

  const formElementArray = [];
  for (let key in controls) {
    formElementArray.push({
      id: key,
      config: controls[key]
    })
  }

  if (isLoading) {
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
              label={formElement.config.label}
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
            type="a"
            href="/connexion"
            style="link">
            J'ai déjà un compte, me connecter
          </Button>
        </div>
      </div>
    );
  }


  if (hasError) {
    errorMessage = (
      <p>{hasError.message}</p>
    );
  }

  if (isSuccess) {
    formDisplay = (
      <div>
        <p>Votre compte a bien été créé&nbsp;! Vous êtes désormais connecté.</p>
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
      <h1>Je crée mon compte</h1>

      {errorMessage}

      <form onSubmit={submitHandler}>
        {formDisplay}
      </form>
    </div>
  );
};

export default InscriptionForm;
