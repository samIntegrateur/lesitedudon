import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import {updateForm} from '../../../shared/form-utils';
import Input from '../../UI/Input/Input';
import Spinner from '../../UI/Spinner/Spinner';
import Button from '../../UI/Button/Button';
import FirebaseContext from '../../../firebase/context';
import { Form, HTMLFormControlElement } from "../../../shared/types/form";

const ConnexionForm: React.FC = () => {

  let formDisplay: JSX.Element | null = null;
  let errorMessage: JSX.Element | null = null;

  const context: any = useContext(FirebaseContext);
  const { firebase } = context;

  const initialForm: Form = {
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
  };

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

    if('persist' in event) {
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

    setIsLoading(true);

    firebase.login({email: controls.email.value, password: controls.password.value})
      .then(() => {
        if (isMounted) {
          setIsLoading(false);
          setIsSuccess(true);
        }
      }).catch((e: Error) => {
       if (isMounted) {
         setIsLoading(false);
         setHasError(e);
       }
    })

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
      <p className="error">{hasError.message}</p>
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
