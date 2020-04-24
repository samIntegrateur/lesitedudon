import {updateObject} from './utility';
import { ComplexValue, FormType, HTMLFormControlElement, Rules } from "./types/form.type";
import { REGEX_EMAIL } from "./constants";
import { ChangeEvent } from "react";

export const checkValidity = (
  value: string | ComplexValue,
  rules: Rules | null,
  file?: Blob | false,
): string[] => {

  const errors: string[] = [];

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
      if (!REGEX_EMAIL.test(value)) {
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

export const isInputFileAndHasFile = (
  form: FormType, inputIdentifier: string, target: HTMLFormControlElement
): Blob | false => {

  const config = form[inputIdentifier].elementConfig;
  if (
    form[inputIdentifier].elementType === 'input' &&
    config && config.type && config.type === 'file' &&
    'files' in target
  ) {
    target = target as HTMLInputElement;
    if (target.files && target.files.length) {
      return target.files[0]
    }
  }
  return false;
};

// UPDATE FORM
// to be called on input change
export const updateForm = (
  event: ChangeEvent<HTMLFormControlElement> | CustomEvent,
  inputIdentifier: string,
  form: FormType,
  fileReader?: FileReader
): {
  updatedForm: FormType;
  updatedFormValidity: boolean;
} => {

  let newValue;
  let file: Blob | undefined | false;
  console.log('event', event);

  // Handle 2 value types (string or object with displayValue and completeValue)
  // and 2 event types (change and onCompleteValueChange)
  const hasCompleteValue = typeof(form[inputIdentifier].value) !== 'string';

  if (event.type === 'change') {
    event = event as ChangeEvent<HTMLFormControlElement>;
    if (hasCompleteValue) {
      newValue = {
        displayValue: event.target.value || '',
        completeValue: null,
      };
    } else {
      newValue = event.target.value;
    }

    file = isInputFileAndHasFile(form, inputIdentifier, event.target);
  } else if (event.type === 'completeValueChange') {
    event = event as CustomEvent;
    newValue = event.detail.value;
  }
  console.log('newValue', newValue);

  if (file && fileReader) {
    file = file as Blob;
    fileReader.readAsDataURL(file);
  }

  const errors = checkValidity(
    newValue,
    form[inputIdentifier].validation || null,
    file,
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
  for (const inputIdentifier in form) {
    updatedFormValidity = updatedForm[inputIdentifier].valid && updatedFormValidity;
  }

  return {
    updatedForm,
    updatedFormValidity,
  };
};
