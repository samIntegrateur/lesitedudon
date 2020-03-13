import React, {Fragment} from 'react';
import useHttpErrorHandler from '../../hooks/http-error-handler';
import Button from '../../components/UI/Button/Button';

const withErrorHandler = (WrappedComponent, axios) => {

  return (props) => {
    const [error, clearError] = useHttpErrorHandler(axios);

    let errorTemplate = null;

    if (error) {
      errorTemplate = (
        <div style={{marginBottom: '2rem'}}>
          <p style={{color: 'red', fontWeight: 'bold'}}>
            La requête a échoué, nous sommes navrés pour le désagrément.<br />
            Merci de nous contacter si le problème persiste.
          </p>
          <p>
            Message d'erreur :
          </p>
          <pre>
            {error.message}
          </pre>
          <Button type="button" clicked={clearError}>Effacer l'erreur</Button>
        </div>
      );
    }

    return (
      <Fragment>
        {errorTemplate}
        <WrappedComponent {...props} />
      </Fragment>
    );

  }
};

export default withErrorHandler;
