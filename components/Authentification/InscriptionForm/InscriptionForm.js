import React, {useContext, useEffect, useState, useRef, useCallback} from 'react';
import FirebaseContext from '../../../firebase/context';
import {updateForm} from '../../../shared/form-utils';
import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import Input from '../../UI/Input/Input';
import {API_GEO_BASE_PATH} from '../../../shared/contants';
import Autocomplete from '../../UI/Autocomplete/Autocomplete';
import {updateObject} from '../../../shared/utility';

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

  const [searchValue, setSearchValue] = useState({
    displayValue: '', // The input value
    completeValue: null, // The complete object
  });
  const inputRef = useRef(null);

  let isMounted = true;

  useEffect(() => {
    return () => {
      isMounted = false;
    }
  }, []);

  const searchCities = useCallback((search) => {
    return fetch(`${API_GEO_BASE_PATH}communes?nom=${search}&boost=population&limit=5`)
      .then(response => response.json())
      .then(response => {
        return response;
      }).catch(e => {
        console.error(e);
        return [];
      })
  }, []);

  const onUpdateValue = (newValue) => {
    console.log('onUpdateValue', newValue);
    setSearchValue(newValue);
  };

  const inputChangedHandler = (event, controlName) => {
    event.persist();

    const { updatedForm, updatedFormValidity } = updateForm(
      event, controlName, controls
    );

    setControls(updatedForm);
    setFormIsValid(updatedFormValidity);
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
              errors={formElement.config.errors}
              invalid={!formElement.config.valid}
              shouldValidate={formElement.config.validation}
              required={formElement.config.validation && formElement.config.validation.required}
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
      <p className="error">{hasError.message}</p>
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

      <div className="part">
        <label>Ville</label><br/>
        <input type="text"
               value={searchValue.displayValue}
               ref={inputRef}
               onChange={(e) => {
                 setSearchValue(updateObject(searchValue, { completeValue: null, displayValue: e.target.value}))
               }} />
        <Autocomplete
          inputRef={inputRef}
          searchValue={searchValue.displayValue}
          updateValue={onUpdateValue}
          apiCallFunction={searchCities}
          resultKey="code"
          resultDisplay={{
            values: ['nom', 'codeDepartement'],
            separator: ' - '
          }}
        />
      </div>

      <form onSubmit={submitHandler}>
        {formDisplay}
      </form>
    </div>
  );
};

export default InscriptionForm;
