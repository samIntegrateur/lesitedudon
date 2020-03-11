import React, {useState} from 'react';
import axios from '../../../shared/axios';
import Input from '../../UI/Input/Input';
import {checkValidity, updateObject} from '../../../shared/utility';
import Button from '../../UI/Button/Button';
import {useRouter} from 'next/router';

const OfferForm = () => {
  const router = useRouter();

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

    // format to appropriate json model
    const formData = {};
    for (let formElementIdentifier in offerForm) {
      formData[formElementIdentifier] = offerForm[formElementIdentifier].value;
    }
    formData.creationDate = new Date();

    // todo handle loading / error / success redirect
    axios.post('/offers.json', formData)
      .then(response => console.log('response', response))
      .catch(error => console.log('error', error));
  };

  // Format offerForm for jsx
  const formElementArray = [];
  for (let key in offerForm) {
    formElementArray.push({
      id: key,
      config: offerForm[key]
    })
  }

  let form = (
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
              style="primary"
              disabled={!formIsValid}>
        Publier l'annonce
      </Button>
    </form>
  );

  // if (props.loading) {
  //   form = <Spinner/>;
  // }

  return (
    form
  );
};

export default OfferForm;
