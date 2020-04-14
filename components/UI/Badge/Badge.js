import React from 'react';
import classes from './Badge.module.css';

const Badge = (props) => {

  const classList = [classes.badge];

  switch (props.style) {
    case ('default'):
      classList.push(classes.badgeDefault);
      break;
    case ('primary'):
      classList.push(classes.badgePrimary);
      break;
    case ('secondary'):
      classList.push(classes.badgeSecondary);
      break;
    default :
      classList.push(classes.badgeDefault);
  }

  if (props.super) {
    classList.push(classes.super);
  }

  return (
    <span title={props.title}
          className={classList.join(' ')}>
      {props.children}
    </span>
  );
};

export default Badge;
