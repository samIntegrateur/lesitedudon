import React, {useRef, useState, useEffect, useCallback} from 'react';
import classes from './Input.module.css'
import Autocomplete from '../Autocomplete/Autocomplete';
import { ComplexValue } from "../../../shared/types/form";
import { InputProps } from "./Input.type";

const Input: React.FC<InputProps> = ({config, changed}: InputProps) => {

  const {
    elementType,
    elementConfig,
    label,
    value,
    autocomplete,
    errors,
    hideErrors,
    touched,
  } = config;

  const invalid = !config.valid;
  const shouldValidate = config.validation;
  const required = config.validation && config.validation.required;

  let inputElement = null;
  const formGroupClasses = [classes.formGroup];

  if (invalid && shouldValidate && touched && !hideErrors) {
    formGroupClasses.push(classes.formGroupIsInvalid);
  }

  const [inputDisplayValue, setInputDisplayValue] = useState<string>('');

  // Handle 2 value types (string or object with displayValue and completeValue)
  useEffect(() => {
    console.log('value effect', value);
    if (typeof value === 'string') {
      setInputDisplayValue(value);
    } else if ('displayValue' in value && 'completeValue' in value) {
      setInputDisplayValue(value.displayValue);
    }
  }, [value]);

  // Create another event type for complexValue
  const onCompleteValueChange = useCallback((newValue: ComplexValue) => {
    console.log('onCompleteValueChange');
    const event = new CustomEvent('completeValueChange', {
      detail: { value: newValue }
    });
    changed(event);
  }, []);

  // Used for autocomplete
  const inputRef = useRef(null);

  switch(elementType) {
    case('input'):
      inputElement = <input
        className={classes.formGroup__control}
        {...elementConfig}
        value={inputDisplayValue}
        ref={autocomplete ? inputRef : null}
        onChange={changed} />;
      break;
    case('textarea'):
      inputElement = <textarea
        className={classes.formGroup__control}
        {...elementConfig}
        value={inputDisplayValue}
        ref={autocomplete ? inputRef : null}
        onChange={changed} />;
      break;
    case('select'):
      inputElement = (
        <select
          className={classes.formGroup__control}
          value={inputDisplayValue}
          onChange={changed}>
          {elementConfig && elementConfig.options && elementConfig.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    default:
      inputElement = <input
        className={classes.formGroup__control}
        {...elementConfig}
        value={inputDisplayValue}
        ref={autocomplete ? inputRef : null}
        onChange={changed} />;
  }

  return (
    <div className={formGroupClasses.join(' ')}>
      {/*todo add id and for*/}
      {/*todo add helpers like max size and authorized file ext */}
      {label &&
        <label className={classes.formGroup__label}>
          {label}
          {required &&
            <span>*</span>
          }
        </label>
      }

      {inputElement}

      {!!autocomplete &&
        <Autocomplete
          inputRef={inputRef}
          // todo: for now we just handle completeValue, handle simple string
          searchValue={inputDisplayValue}
          updateValue={onCompleteValueChange}
          apiCallFunction={autocomplete.apiCallFunction}
          resultKey={autocomplete.resultKey}
          resultDisplay={autocomplete.resultDisplay}
        />
      }

      {!!errors && !!errors.length && !hideErrors &&
        <div className="errors">
          {errors.map(error => (
            <p key={error}>
              {error}
            </p>
          ))}
        </div>
      }

    </div>
  );
};

export default Input;
