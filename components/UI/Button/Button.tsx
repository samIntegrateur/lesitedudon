import React, { PropsWithChildren } from "react";
import classes from './Button.module.css'
import Link from 'next/link';
import { UrlObject } from "url";

type buttonStyle = 'default' | 'link' | 'primary' | 'secondary';
type buttonType = 'a' | 'button' | 'submit';

interface ButtonProps {
  style?: buttonStyle;
  type: buttonType;
  disabled?: boolean;
  clicked?: (event: React.MouseEvent<HTMLElement>) => void;
  href?: string | UrlObject;
  as?: string | UrlObject;
}
const Button: React.FC<PropsWithChildren<ButtonProps>> = (props) => {

  const classList = [classes.btn];
  let buttonElement = null;

  switch (props.style) {
    case ('default'):
      classList.push(classes.btnDefault);
      break;
    case ('link'):
      classList.push(classes.btnLink);
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
    disabled: props.disabled,
    onClick: props.clicked,
    className: classList.join(' ')
  };

  switch (props.type) {
    case ('a'):
      buttonElement = (
        <Link href={props.href ? props.href : '/'} as={props.as ? props.as : undefined}>
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

  return buttonElement;
};

export default Button;
