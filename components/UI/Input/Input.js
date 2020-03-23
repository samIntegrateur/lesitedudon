import React from 'react';
import classes from './Input.module.css'

const Input = (props) => {

  let inputElement = null;
  const formGroupClasses = [classes.formGroup];

  if (props.invalid && props.shouldValidate && props.touched) {
    formGroupClasses.push(classes.formGroupIsInvalid);
  }

  switch(props.elementType) {
    case('Input'):
      inputElement = <input
        className={classes.formGroup__control}
        {...props.elementConfig}
        value={props.value}
        onChange={props.changed} />;
      break;
    case('textarea'):
      inputElement = <textarea
        className={classes.formGroup__control}
        {...props.elementConfig}
        value={props.value}
        onChange={props.changed} />;
      break;
    case('select'):
      inputElement = (
        <select
          className={classes.formGroup__control}
          value={props.value}
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
        value={props.value}
        onChange={props.changed} />;
  }

  return (
    <div className={formGroupClasses.join(' ')}>
      {/*todo add id and for*/}
      <label className={classes.formGroup__label}>{props.label}</label>
      {inputElement}
    </div>
  );
};

export default Input;
