import React, { useRef, useState, useEffect, useCallback, ChangeEvent } from "react";
import classes from './Input.module.css'
import Autocomplete from '../Autocomplete/Autocomplete';
import { ComplexValue, FormControl, HTMLFormControlElement } from "../../../shared/types/form.type";

interface InputProps {
  config: FormControl;
  changed: ((event: ChangeEvent<HTMLFormControlElement> | CustomEvent) => void);
}
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
  // Don't handle input value for file, it can causes issues
  const isInputFile = elementType === 'input' && elementConfig?.type === 'file';

  let inputElement = null;
  const formGroupClasses = [classes.formGroup];

  if (invalid && shouldValidate && touched && !hideErrors) {
    formGroupClasses.push(classes.formGroupIsInvalid);
  }

  const [inputDisplayValue, setInputDisplayValue] = useState<string>('');

  // Handle 2 value types (string or object with displayValue and completeValue)
  useEffect(() => {
    if (isInputFile) {
      return;
    }
    if (typeof value === 'string') {
      setInputDisplayValue(value);
    } else if ('displayValue' in value && 'completeValue' in value) {
      setInputDisplayValue(value.displayValue);
    }
  }, [value, isInputFile]);

  // Create another event type for complexValue
  const onCompleteValueChange = useCallback((newValue: ComplexValue) => {
    const event = new CustomEvent('completeValueChange', {
      detail: { value: newValue }
    });
    changed(event);
  }, [changed]);

  // Used for autocomplete
  const inputRef = useRef(null);

  const valueProp = isInputFile ? {} : {
    value: inputDisplayValue,
  };

  switch(elementType) {
    case('input'):
      inputElement =
        <input
        className={classes.formGroup__control}
        {...elementConfig}
        {...valueProp}
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
        {...valueProp}
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
          updateValueFunction={onCompleteValueChange}
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
