import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import {updateForm} from '../../../../shared/form-utils';
import Spinner from '../../../UI/Spinner/Spinner';
import { useDispatch, useSelector } from "react-redux";
import FirebaseContext from '../../../../firebase/context';
import {updateObject} from '../../../../shared/utility';
import { FormType, HTMLFormControlElement } from "../../../../shared/types/form.type";
import { StoreState } from "../../../../store/types/store.type";
import { ApiStateItem } from "../../../../store/types/common.type";
import { sendMessage, sendMessageClear } from "../../../../store/actions";

interface ConversationFormProps {
  conversationId: string;
  startConversation: boolean;
}
const ConversationForm: React.FC<ConversationFormProps> = ({
    conversationId, startConversation,
}) => {

  const { loading, error, success } = useSelector<StoreState, ApiStateItem>(state =>
    state.conversation.apiState.sendMessage
  );

  const context = useContext(FirebaseContext);
  const { firebase } = context;

  const dispatch = useDispatch();

  const messageControlRef = useRef<HTMLFormControlElement>(null);

  const initialFormState: FormType = {
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
  }, [startConversation, controls]);

  const inputChangedHandler = (
    event: ChangeEvent<HTMLFormControlElement> | CustomEvent,
    controlName: string
  ) => {
    if("persist" in event) {
      event.persist();
    }

    if (error || success) {
      dispatch(sendMessageClear());
    }

    const { updatedForm, updatedFormValidity } = updateForm(
      event, controlName, controls
    );

    setControls(updatedForm);
    setFormIsValid(updatedFormValidity);
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    if (firebase) {
      dispatch(sendMessage(controls.message.value as string, conversationId, firebase));
      setControls(initialFormState);
    }
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

export default ConversationForm;
