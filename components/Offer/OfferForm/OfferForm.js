import React, {useEffect, useState} from 'react';
import Input from '../../UI/Input/Input';
import {checkValidity, updateObject} from '../../../shared/utility';
import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import * as actions from '../../../store/actions';
import {connect} from 'react-redux';

const OfferForm = (props) => {
  let formDisplay = null;

  const {loading, error, success, onPostOffer, onPostOfferClear} = props;

  useEffect(() => {
    return () => {
      onPostOfferClear();
    }
  }, [onPostOfferClear]);

  const [offerForm, setOfferForm] = useState({
    title: {
      label: 'Titre de l\'annonce',
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
      touched: false
    },
    description: {
      label: 'Description de l\'annonce',
      elementType: 'textarea',
      elementConfig: {
        placeholder: ''
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const inputChangedHandler = (event, inputIdentifier) => {
    const updatedFormElement = updateObject(offerForm[inputIdentifier], {
      value: event.target.value,
      valid: checkValidity(event.target.value, offerForm[inputIdentifier].validation),
      touched: true,
    });
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
      formData[formElementIdentifier] = offerForm[formElementIdentifier].value;
    }
    formData.creationDate = new Date();

    onPostOffer(formData);
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
          <p>Votre annonce a bien été publiée !</p>
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
              invalid={!formElement.config.valid}
              shouldValidate={formElement.config.validation}
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
    onPostOffer: (offer) => dispatch(actions.postOffer(offer)),
    onPostOfferClear: (offer) => dispatch(actions.postOfferClear()),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(OfferForm);
