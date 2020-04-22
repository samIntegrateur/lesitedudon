import React, { ChangeEvent, FormEvent, FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import {updateForm} from '../../../../shared/form-utils';
import classes from './ConversationForm.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import * as actions from '../../../../store/actions';
import {connect} from 'react-redux';
import FirebaseContext from '../../../../firebase/context';
import {updateObject} from '../../../../shared/utility';
import { ConversationFormProps } from "./ConversationForm.type";
import { Form, HTMLFormControlElement } from "../../../../shared/types/form";

const ConversationForm: React.FC<ConversationFormProps> = ({
    conversationId, startConversation,
    loading, error, success, onSendMessage, onSendMessageClear
}) => {

  const messageControlRef = useRef<HTMLFormControlElement>(null);

  const initialFormState: Form = {
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
      hideErrors: true,
    }
  };

  const [formIsValid, setFormIsValid] = useState(false);
  const [controls, setControls] = useState(initialFormState);


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

  const context: any = useContext(FirebaseContext);
  const { firebase } = context;

  const inputChangedHandler = (
    event: ChangeEvent<HTMLFormControlElement> | CustomEvent,
    controlName: string
  ) => {
    if("persist" in event) {
      event.persist();
    }

    if (error || success) {
      onSendMessageClear();
    }

    const { updatedForm, updatedFormValidity } = updateForm(
      event, controlName, controls
    );

    setControls(updatedForm);
    setFormIsValid(updatedFormValidity);
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    onSendMessage(controls.message.value, conversationId, firebase);
    setControls(initialFormState);
  };

  return (
    <form onSubmit={submitHandler}>
      <Input
        config={controls.message}
        changed={(
          event: ChangeEvent<HTMLFormControlElement> | CustomEvent
        ) => inputChangedHandler(event, 'message')}
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
      {!!error && (
          <p className="error">{error.message}</p>
        )
      }


    </form>
  );
};

// todo: replace with useDispatch / useSelector, no hoc with hooks
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
