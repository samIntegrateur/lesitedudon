import React, {useContext, useEffect, useState} from 'react';
import Input from '../../UI/Input/Input';
import {updateObject} from '../../../shared/utility';
import {checkValidity} from '../../../shared/form-utils';
import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import * as actions from '../../../store/actions';
import {connect} from 'react-redux';
import FirebaseContext from '../../../firebase/context';

let fileReader;
// fix for netlify
// https://www.udemy.com/course/gatsby-js-firebase-hybrid-realtime-static-sites/learn/lecture/16186367#questions
if (typeof window !== 'undefined') {
  fileReader = new FileReader()
}

const OfferForm = (props) => {
  let formDisplay = null;

  const {user, firebase} = useContext(FirebaseContext);
  const {loading, error, success, onPostOffer, onPostOfferClear} = props;
  const [image, setImage] = useState('');

  useEffect(() => {
    if (fileReader) {
      fileReader.addEventListener('load', fileReaderLoadHandler);
    }

    return () => {
      if (fileReader) {
        fileReader.removeEventListener('load', fileReaderLoadHandler);
      }
    }
  }, [fileReader]);

  const fileReaderLoadHandler = (e) => {
    console.log('e', e);
    console.log('fileReader result', fileReader.result);
    setImage(fileReader.result);
  };

  useEffect(() => {
    return () => {
      onPostOfferClear();
    }
  }, [onPostOfferClear]);

  // todo : add input type validator
  // and error messages strategy for all fields
  const [offerForm, setOfferForm] = useState({
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
        fileMaxSize: 10
      },
      valid: false,
      touched: false,
      errors: [],
    },
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const inputChangedHandler = (event, inputIdentifier) => {
    event.persist();

    if (inputIdentifier === 'image') {
      fileReader.readAsDataURL(event.target.files[0]);
    }

    const errors = checkValidity(
      event.target.value,
      offerForm[inputIdentifier].validation,
      inputIdentifier === 'image' ? event.target.files[0] : null
    );

    const updatedProperties = {
      value: event.target.value,
      valid: errors.length === 0,
      touched: true,
      errors: errors,
    };

    const updatedFormElement = updateObject(offerForm[inputIdentifier], updatedProperties);

    const updatedOrderForm = updateObject(offerForm, {
      [inputIdentifier]: updatedFormElement
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }

    setOfferForm(updatedOrderForm);
    setFormIsValid(formIsValid);
  };

  const offerSubmitHandler = (event) => {
    event.preventDefault();

    const formData = {};
    for (let formElementIdentifier in offerForm) {
      if (formElementIdentifier === 'image') {
        console.log('image');
        if (image) {
          console.log('image true');
          formData[formElementIdentifier] = image;
        }
      } else {
        formData[formElementIdentifier] = offerForm[formElementIdentifier].value;
      }
    }

    console.log('formData', formData);

    onPostOffer(formData, firebase);
  };

  // Format offerForm for jsx
  const formElementArray = [];
  for (let key in offerForm) {
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

          {/*todo: get id to display link */}
          {/*<Button type="a"*/}
          {/*        style="default"*/}
          {/*        href={`/annonce/[id]`} as={`/annonce/${offer.id}`}>*/}
          {/*  Voir mon annonce*/}
          {/*</Button>*/}

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

          {/*<Button type="a"*/}
          {/*        style="default"*/}
          {/*        clicked={setPostError(false)}>*/}
          {/*  Réessayer*/}
          {/*</Button>*/}
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
              label={formElement.config.label}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              errors={formElement.config.errors}
              invalid={!formElement.config.valid}
              shouldValidate={formElement.config.validation}
              required={formElement.config.validation && formElement.config.validation.required}
              touched={formElement.config.touched}
              changed={(event) => inputChangedHandler(event, formElement.id)}
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

const mapStateToProps = state => {
  return {
    loading: state.offer.loading,
    error: state.offer.apiState.postOffer.error,
    success: state.offer.apiState.postOffer.success,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onPostOffer: (offer, firebase) => dispatch(actions.postOffer(offer, firebase)),
    onPostOfferClear: () => dispatch(actions.postOfferClear()),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(OfferForm);
