import React, {useContext, useEffect, useState} from 'react';
import {checkValidity, updateObject} from '../../../shared/utility';
import Input from '../../UI/Input/Input';
import Spinner from '../../UI/Spinner/Spinner';
import Button from '../../UI/Button/Button';
import FirebaseContext from '../../../firebase/context';

const ConnexionForm = () => {

  let formDisplay = null;
  let errorMessage = null;

  const {firebase} = useContext(FirebaseContext);

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

    setIsLoading(true);

    firebase.login({email: controls.email.value, password: controls.password.value})
      .then(() => {
        if (isMounted) {
          setIsLoading(false);
          setIsSuccess(true);
        }
      }).catch(e => {
       if (isMounted) {
         setIsLoading(false);
         setHasError(e);
       }
    })

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
            href="/inscription"
            style="link">
            Créer un compte
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
        <p>Vous avez bien été connecté&nbsp;!</p>
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
      <h1>Connexion</h1>

      {errorMessage}

      <form onSubmit={submitHandler}>
        {formDisplay}
      </form>
    </div>
  );
};


export default ConnexionForm;
