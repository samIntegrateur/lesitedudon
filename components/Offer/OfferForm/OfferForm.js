import React, {useState} from 'react';
import axios from '../../../shared/axios';
import Input from '../../UI/Input/Input';
import {checkValidity, updateObject} from '../../../shared/utility';
import Button from '../../UI/Button/Button';
import moment from 'moment';
import Spinner from '../../UI/Spinner/Spinner';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';

const OfferForm = () => {
  let formDisplay = null;

  const [postSuccess, setPostSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    event.preventDefault();

    const formData = {};
    for (let formElementIdentifier in offerForm) {
      formData[formElementIdentifier] = offerForm[formElementIdentifier].value;
    }
    formData.creationDate = moment().unix();

    axios.post('/offers.json', formData)
      .then(response => {
        setIsLoading(false);
        if (response) {
          setPostSuccess(true);
        } else {
          setPostSuccess(false);
        }
      })
      .catch(error => {
        setIsLoading(false);
        setPostSuccess(false);
        return error;
      });
  };

  // Format offerForm for jsx
  const formElementArray = [];
  for (let key in offerForm) {
    formElementArray.push({
      id: key,
      config: offerForm[key]
    })
  }

  if (isLoading) {
    formDisplay = <Spinner/>;
  } else {
    if (postSuccess) {
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

export default withErrorHandler(OfferForm, axios);
