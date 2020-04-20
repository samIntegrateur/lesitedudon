import React, {useRef, useState, useEffect, useCallback} from 'react';
import classes from './Input.module.css'
import Autocomplete from '../Autocomplete/Autocomplete';

const Input = (props) => {

  let inputElement = null;
  const formGroupClasses = [classes.formGroup];

  if (props.invalid && props.shouldValidate && props.touched && !props.hideErrors) {
    formGroupClasses.push(classes.formGroupIsInvalid);
  }

  const [inputDisplayValue, setInputDisplayValue] = useState('');

  const value = props.value;

  // Handle 2 value types (string or object with displayValue and completeValue)
  // todo: better with typescript
  useEffect(() => {
    console.log('value effect', value);
    if (typeof value === 'string') {
      setInputDisplayValue(value);
    } else if (value.displayValue !== undefined && value.completeValue !== undefined) {
      setInputDisplayValue(value.displayValue);
    } else {
      console.error('Input has an incorrect value format');
      setInputDisplayValue('');
    }
  }, [value]);

  // Create another event type for completeValue
  const onCompleteValueChange = useCallback((newValue) => {
    console.log('onCompleteValueChange');
    const event = new CustomEvent('completeValueChange', {
      detail: { value: newValue }
    });
    props.changed(event);
  });

  // Used for autocomplete
  const inputRef = useRef(null);

  switch(props.elementType) {
    case('input'):
      inputElement = <input
        className={classes.formGroup__control}
        {...props.elementConfig}
        value={inputDisplayValue}
        ref={props.autocomplete ? inputRef : null}
        onChange={props.changed} />;
      break;
    case('textarea'):
      inputElement = <textarea
        className={classes.formGroup__control}
        {...props.elementConfig}
        value={inputDisplayValue}
        ref={props.autocomplete ? inputRef : null}
        onChange={props.changed} />;
      break;
    case('select'):
      inputElement = (
        <select
          className={classes.formGroup__control}
          value={inputDisplayValue}
          onChange={props.changed}>
          {props.elementConfig.options.map(option => (
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
        {...props.elementConfig}
        value={inputDisplayValue}
        ref={props.autocomplete ? inputRef : null}
        onChange={props.changed} />;
  }

  return (
    <div className={formGroupClasses.join(' ')}>
      {/*todo add id and for*/}
      {/*todo add helpers like max size and authorized file ext */}
      {props.label &&
        <label className={classes.formGroup__label}>
          {props.label}
          {!!props.required &&
          <span>*</span>
          }
        </label>
      }

      {inputElement}

      {props.autocomplete &&
        <Autocomplete
          inputRef={inputRef}
          // todo: for now we just handle completeValue, handle simple string
          searchValue={inputDisplayValue}
          updateValue={onCompleteValueChange}
          apiCallFunction={props.autocomplete.apiCallFunction}
          resultKey={props.autocomplete.resultKey}
          resultDisplay={props.autocomplete.resultDisplay}
        />
      }

      {!!props.errors && !!props.errors.length && !props.hideErrors &&
        <div className="errors">
          {props.errors.map(error => (
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
