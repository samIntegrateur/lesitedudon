import React, {useContext, useEffect, useState} from 'react';
import Input from '../../UI/Input/Input';
import {updateForm} from '../../../shared/form-utils';
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

  const {firebase} = useContext(FirebaseContext);
  const {loading, error, success, postId, onPostOffer, onPostOfferClear} = props;
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

  const fileReaderLoadHandler = () => {
    setImage(fileReader.result);
  };

  useEffect(() => {
    return () => {
      onPostOfferClear();
    }
  }, [onPostOfferClear]);

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
        // nb: base64 upload seems to be limited to 10mo with firebase cloud functions
        // as a base64 is ~33% bigger than the original, we keep a margin
        // https://stackoverflow.com/questions/34109053/what-file-size-is-data-if-its-450kb-base64-encoded
        fileMaxSize: 7
      },
      valid: true,
      touched: false,
      errors: [],
    },
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const inputChangedHandler = (event, inputIdentifier) => {
    event.persist ? event.persist() : null;

    const { updatedForm, updatedFormValidity } = updateForm(
      event, inputIdentifier, offerForm, fileReader
    );

    setOfferForm(updatedForm);
    setFormIsValid(updatedFormValidity);
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
    postId: state.offer.apiState.postOffer.postId,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onPostOffer: (offer, firebase) => dispatch(actions.postOffer(offer, firebase)),
    onPostOfferClear: () => dispatch(actions.postOfferClear()),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(OfferForm);
