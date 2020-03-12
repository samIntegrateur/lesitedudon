import React from 'react';
import classes from './Button.module.css'
import Link from 'next/link';

const Button = (props) => {

  const classList = [classes.btn];
  let buttonElement = null;

  switch (props.style) {
    case ('default'):
      classList.push(classes.btnDefault);
      break;
    case ('primary'):
      classList.push(classes.btnPrimary);
      break;
    case ('secondary'):
      classList.push(classes.btnSecondary);
      break;
    default :
      classList.push(classes.btnDefault);
  }

  const argsList = {
    disabled:props.disabled,
    onClick:props.clicked,
    className:classList.join(' ')
  };

  switch (props.type) {
    case ('a'):
      buttonElement = (
        <Link href={props.href ? props.href : '/'}>
          <a {...argsList}>
            {props.children}
          </a>
        </Link>
      );
      break;
    case ('button'):
      buttonElement = (
        <button type="button" {...argsList}>
          {props.children}
        </button>
      );
      break;
    case ('submit'):
      buttonElement = (
        <button type="submit" {...argsList}>
          {props.children}
        </button>
      );
      break;
    default:
      buttonElement = (
        <button type="button" {...argsList}>
          {props.children}
        </button>
      );
  }

  return (
    buttonElement
    // <button
    //   type={props.type}
    //   disabled={props.disabled}
    //   onClick={props.clicked}
    //   className={classList.join(' ')}
    // >{props.children}</button>
  );
};

export default Button;
