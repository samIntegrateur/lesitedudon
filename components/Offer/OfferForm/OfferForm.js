import React from 'react';
import axios from '../../../shared/axios';
import useFormInput from '../../../hooks/form-input';

const OfferForm = () => {

  const title = useFormInput('Titre');
  const description = useFormInput('Description');

  const offerHandler = (event) => {
    event.preventDefault();
    const newOffer = {
      title: title.value,
      description: description.value
    };
    // todo handle loading / error / success redirect
    axios.post('/offers.json', newOffer)
      .then(response => console.log('response', response))
      .catch(error => console.log('error', error));
  };

  return (
    <form onSubmit={offerHandler}>
      <div>
        <label>Titre de l'annonce</label>
        <input type="text" {...title} />
      </div>
      <div>
        <label>Description de l'annonce</label>
        <textarea {...description}></textarea>
      </div>

      <button type="submit">Publier l'annonce</button>
    </form>
  );
};

export default OfferForm;
