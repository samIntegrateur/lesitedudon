import React, {useContext, useEffect, useRef, useState} from 'react';
import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import {updateForm} from '../../../../shared/form-utils';
import classes from './ConversationForm.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import * as actions from '../../../../store/actions';
import {connect} from 'react-redux';
import FirebaseContext from '../../../../firebase/context';
import {updateObject} from '../../../../shared/utility';

const ConversationForm = ({conversationId, startConversation, loading, error, success, onSendMessage, onSendMessageClear}) => {

  const messageControlRef = useRef(null);

  const initialFormState = {
    message: {
      elementType: 'textarea',
      elementConfig: {
        placeholder: 'Envoyer un message',
        ref: messageControlRef,
      },
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    }
  };

  useEffect(() => {
    if (messageControlRef.current) {
      messageControlRef.current.focus();
    }
  }, [messageControlRef]);

  useEffect(() => {
    if (startConversation && !controls.message.touched && !controls.message.value) {
      const updatedMessage = updateObject(
        controls.message,
        {
          value: 'Bonjour, je suis intéressé par votre annonce, est-elle toujours d\'actualité ?',
          valid: true,
          touched: true,
        }
      );
      const updatedForm = updateObject(controls, {
        message: updatedMessage
      });

      setControls(updatedForm);
      setFormIsValid(true);
    }
  }, [startConversation]);

  const {firebase} = useContext(FirebaseContext);
  const [formIsValid, setFormIsValid] = useState(false);
  const [controls, setControls] = useState(initialFormState);

  const inputChangedHandler = (event, controlName) => {
    event.persist();

    if (error || success) {
      onSendMessageClear();
    }

    const { updatedForm, updatedFormValidity } = updateForm(
      event, controlName, controls
    );

    setControls(updatedForm);
    setFormIsValid(updatedFormValidity);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    onSendMessage(controls.message.value, conversationId, firebase);
    setControls(initialFormState);
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
        loading
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
        error && (
          <p className="error">{error.message}</p>
        )
      }

    </form>
  );
};


const mapStateToProps = state => {
  return {
    loading: state.conversation.apiState.sendMessage.loading,
    error: state.conversation.apiState.sendMessage.error,
    success: state.conversation.apiState.sendMessage.success,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onSendMessage: (message, conversationId, firebase) => dispatch(actions.sendMessage(message, conversationId, firebase)),
    onSendMessageClear: () => dispatch(actions.sendMessageClear()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ConversationForm);
