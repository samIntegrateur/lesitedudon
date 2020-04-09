import React, {useState} from 'react';
import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import {updateForm} from '../../../../shared/form-utils';
import classes from './ConversationForm.module.css';
import Spinner from '../../../UI/Spinner/Spinner';

const ConversationForm = () => {
  const [formIsValid, setFormIsValid] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [controls, setControls] = useState({
    message: {
      elementType: 'textarea',
      elementConfig: {
        placeholder: 'Envoyer un message'
      },
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false
    }
  });

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
    setIsLoading(true);
    // todo send message fn
    setIsLoading(false);
  };

  return (
    <form onSubmit={submitHandler}>
      <Input
        elementType={controls.message.elementType}
        elementConfig={controls.message.elementConfig}
        value={controls.message.value}
        errors={controls.message.errors}
        invalid={!controls.message.valid}
        shouldValidate={controls.message.validation}
        required={controls.message.validation && controls.message.validation.required}
        touched={controls.message.touched}
        hideErrors={true}
        changed={(event) => inputChangedHandler(event, 'message')}
      />
      {
        isLoading
        ? <Spinner small />
        : (
            <Button
              type="submit"
              style="secondary"
              disabled={!formIsValid}>
              Envoyer
            </Button>
          )
      }
      {
        hasError && (
          <p className="error">{hasError.message}</p>
        )
      }

    </form>
  );
};

export default ConversationForm;
