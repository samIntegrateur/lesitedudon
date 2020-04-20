import {updateObject} from './utility';

export const checkValidity = (value, rules, file = null) => {
  const errors = [];

  if (!rules) {
    return errors;
  }

  if (typeof value === 'string') {
    if (rules.required && value.trim() === '') {
      errors.push('Ce champ est obligatoire.');
    }

    if (rules.minLength && value.length < rules.minLength) {
      errors.push('Ce champ doit contenir au moins ' + rules.minLength + ' caractères.');
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push('Ce champ doit contenir au maximum ' + rules.minLength + ' caractères.');
    }

    if (rules.isEmail) {
      const pattern =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!pattern.test(value)) {
        errors.push('Ce champ doit contenir une adresse e-mail valide.');
      }
    }

    if (file) {

      if (rules.fileExtension && !rules.fileExtension.includes(file.type)) {
        errors.push('Ce type de ficher n\'est pas autorisé.');
      }

      if (rules.fileMaxSize) {
        const sizeInMo = (file.size/1048576);
        if (sizeInMo > rules.fileMaxSize) {
          errors.push('Le fichier est trop lourd, le poids maximum autorisé est de ' + rules.fileMaxSize + ' Mo.');
        }
      }

    }
  } else {
    if (rules.required && !value.completeValue) {
      errors.push('Ce champ est obligatoire.');
    }

    if (rules.geoCity && value.displayValue && !value.completeValue) {
      errors.push('Vous n\'avez pas sélectionné une ville valide');
    }
  }

  return errors;
};

export const isInputFileAndHasFile = (form, inputIdentifier, files) => {
  return (
    form[inputIdentifier].elementType === 'input' &&
    form[inputIdentifier].elementConfig.type === 'file' &&
    files && files.length
  );
};

// UPDATE FORM
// to be called on input change
export const updateForm = (event, inputIdentifier, form, fileReader = null) => {
  let newValue, isFile, errors;
  console.log('event', event);

  // Handle 2 value types (string or object with displayValue and completeValue)
  // and 2 event types (change and onCompleteValueChange)
  const hasCompleteValue = typeof(form[inputIdentifier].value) !== 'string';

  if (event.type === 'change') {
    if (hasCompleteValue) {
      newValue = {
        displayValue: event.target.value,
        completeValue: null,
      };
    } else {
      newValue = event.target.value;
    }
    isFile = fileReader && isInputFileAndHasFile(form, inputIdentifier, event.target.files);
  } else if (event.type === 'completeValueChange') {
    newValue = event.detail.value;
  }
  console.log('newValue', newValue);

  if (isFile) {
    fileReader.readAsDataURL(event.target.files[0]);
  }

  errors = checkValidity(
    newValue,
    form[inputIdentifier].validation,
    isFile ? event.target.files[0] : null
  );

  const updatedProperties = {
    value: newValue,
    valid: errors.length === 0,
    touched: true,
    errors: errors,
  };

  const updatedFormElement = updateObject(form[inputIdentifier], updatedProperties);

  const updatedForm = updateObject(form, {
    [inputIdentifier]: updatedFormElement
  });

  let updatedFormValidity = true;
  for (let inputIdentifier in form) {
    updatedFormValidity = updatedForm[inputIdentifier].valid && updatedFormValidity;
  }

  return {
    updatedForm,
    updatedFormValidity,
  };
};
