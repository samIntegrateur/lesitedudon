import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import Input from '../../UI/Input/Input';
import {updateForm} from '../../../shared/form-utils';
import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import * as actions from '../../../store/actions';
import { useDispatch, useSelector } from "react-redux";
import FirebaseContext from '../../../firebase/context';
import { CustomFormData, FormType, HTMLFormControlElement } from "../../../shared/types/form.type";
import { StoreState } from "../../../store/types/store.type";
import { OfferApiState, PostOfferState } from "../../../store/types/offer.type";

let fileReader: FileReader;
// fix for netlify
// https://www.udemy.com/course/gatsby-js-firebase-hybrid-realtime-static-sites/learn/lecture/16186367#questions
if (typeof window !== 'undefined') {
  fileReader = new FileReader()
}

const OfferForm: React.FC = () => {

  let formDisplay: JSX.Element | null = null;

  const { firebase } = useContext(FirebaseContext);

  const { loading, error, success, postId } = useSelector<StoreState, PostOfferState>(state =>
    state.offer.apiState[OfferApiState.POST_OFFER]
  );

  const dispatch = useDispatch();

  const [image, setImage] = useState<string>('');

  const initialForm = {
    title: {
      label: 'Titre',
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: ''
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false,
      errors: [],
    },
    description: {
      label: 'Description',
      elementType: 'textarea',
      elementConfig: {
        placeholder: ''
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false,
      errors: [],
    },
    image: {
      label: 'Uploader une image',
      elementType: 'input',
      elementConfig: {
        type: 'file',
        placeholder: '',
        accept: 'image/png, image/jpeg, image/jpg'
      },
      value: '',
      file: '',
      validation: {
        required: false,
        fileExtension: [
          'image/png',
          'image/jpg',
          'image/jpeg'
        ],
        // nb: base64 upload seems to be limited to 10mo with firebase cloud functions
        // as a base64 is ~33% bigger than the original, we keep a margin
        // https://stackoverflow.com/questions/34109053/what-file-size-is-data-if-its-450kb-base64-encoded
        fileMaxSize: 7
      },
      valid: true,
      touched: false,
      errors: [],
    },
  };

  const [offerForm, setOfferForm] = useState<FormType>(initialForm);
  const [formIsValid, setFormIsValid] = useState<boolean>(false);

  const fileReaderLoadHandler = () => {
    const result = fileReader.result as string;
    setImage(result);
  };

  useEffect(() => {
    if (fileReader) {
      fileReader.addEventListener('load', fileReaderLoadHandler);
    }

    return (): void => {
      if (fileReader) {
        fileReader.removeEventListener('load', fileReaderLoadHandler);
      }
    }
  }, []);

  useEffect(() => {
    return (): void => {
      dispatch(actions.postOfferClear());
    }
  }, [dispatch]);

  const inputChangedHandler = (
    event: ChangeEvent<HTMLFormControlElement> | CustomEvent,
    inputIdentifier: string
  ): void => {

    if ('persist' in event) {
      event.persist();
    }
    const { updatedForm, updatedFormValidity } = updateForm(
      event, inputIdentifier, offerForm, fileReader
    );

    setOfferForm(updatedForm);
    setFormIsValid(updatedFormValidity);
  };

  const offerSubmitHandler = (event: FormEvent): void => {
    event.preventDefault();

    const formData: CustomFormData = {};
    for (const formElementIdentifier in offerForm) {
      if (formElementIdentifier === 'image') {
        if (image) {
          formData[formElementIdentifier] = image;
        }
      } else {
        formData[formElementIdentifier] = offerForm[formElementIdentifier].value;
      }
    }

    if (firebase) {
      dispatch(actions.postOffer(formData, firebase));
    }
  };

  // Format offerForm for jsx
  const formElementArray = [];
  for (const key in offerForm) {
    formElementArray.push({
      id: key,
      config: offerForm[key]
    })
  }

  if (loading) {
    formDisplay = <Spinner/>;
  } else {
    if (success) {
      formDisplay = (
        <div>
          <p>Votre annonce a bien été publiée&nbsp;!</p>

          <Button type="a"
                  style="default"
                  href={`/annonce/[id]`} as={`/annonce/${postId}`}>
            Voir mon annonce
          </Button>

          <Button type="a"
                  style="default"
                  href="/">
            Retourner à l'accueil
          </Button>
        </div>
      );
    } else if (error) {
      formDisplay = (
        <div>
          <p>Une erreur s'est produite, votre annonce n'a pu être publiée.</p>

          {error.message ? <p className="error">{error.message}</p> : null}

          <Button type="a"
                  style="default"
                  href="/">
            Retourner à l'accueil
          </Button>
        </div>
      );
    } else {
      formDisplay = (
        <form onSubmit={offerSubmitHandler}>
          {formElementArray.map(formElement => (
            <Input
              key={formElement.id}
              config={formElement.config}
              changed={(
                event: ChangeEvent<HTMLFormControlElement> | CustomEvent
              ) => inputChangedHandler(event, formElement.id)}
            />
          ))}

          <Button type="a"
                  style="default"
                  href="/">
            Annuler
          </Button>
          <Button type="submit"
                  style="secondary"
                  disabled={!formIsValid}>
            Publier l'annonce
          </Button>

        </form>
      );
    }

  }

  return formDisplay;
};

export default OfferForm;
