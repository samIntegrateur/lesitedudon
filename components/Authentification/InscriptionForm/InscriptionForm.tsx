import React, { useContext, useEffect, useState, useCallback, FunctionComponent, ChangeEvent, FormEvent } from "react";
import FirebaseContext from '../../../firebase/context';
import { updateForm } from '../../../shared/form-utils';
import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import Input from '../../UI/Input/Input';
import {searchCity} from '../../../shared/geo-api';
import { Form, HTMLFormControlElement } from "../../../shared/types/form";

// todo refactor as it's similar to connexion, use classes ?
const InscriptionForm: React.FC = () => {

  let formDisplay: JSX.Element | null = null;
  let errorMessage: JSX.Element | null = null;

  const context: any = useContext(FirebaseContext);
  const { firebase } = context;

  const searchCitiesCallback = useCallback((search) => {
    return searchCity(search);
  }, []);

  const initialForm: Form = {
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
    city: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        autoComplete: 'disabled',
      },
      value: {
        displayValue: '',
        completeValue: null,
      },
      label: 'Ville',
      validation: {
        required: false,
        geoCity: true,
      },
      autocomplete: {
        apiCallFunction: searchCitiesCallback,
        resultKey: 'code',
        resultDisplay: {
          values: ['nom', 'codeDepartement'],
          separator: ' - '
        }
      },
      valid: true,
      touched: false
    }
  };

  // todo check username unicity
  const [controls, setControls] = useState<Form>(initialForm);

  const [formIsValid, setFormIsValid] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [hasError, setHasError] = useState<Error|null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let isMounted = true;

  useEffect(() => {
    return () => {
      isMounted = false;
    }
  }, []);

  const inputChangedHandler = (
    event: ChangeEvent<HTMLFormControlElement> | CustomEvent,
    controlName: string
  ) => {
    if ('persist' in event) {
      event.persist();
    }

    const { updatedForm, updatedFormValidity } = updateForm(
      event, controlName, controls
    );

    setControls(updatedForm);
    setFormIsValid(updatedFormValidity);
  };

  const submitHandler = (event: FormEvent) => {
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
      }).catch((e: Error) => {
        if (isMounted) {
          setIsLoading(false);
          setHasError(e);
        }
      });
    } else {
      // todo : this kind of message should be real time
      const e = { name: "mismatch", message: 'Les mots de passes ne correspondent pas'};
      setHasError(e);
    }
  };

  const formElementArray = [];
  for (const key in controls) {
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
              config={formElement.config}
              changed={(
                event: ChangeEvent<HTMLFormControlElement> | CustomEvent
              ) => inputChangedHandler(event, formElement.id)}
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

      <form onSubmit={submitHandler}>
        {formDisplay}
      </form>
    </div>
  );
};

export default InscriptionForm;
