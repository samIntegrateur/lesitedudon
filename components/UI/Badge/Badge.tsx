import React, { PropsWithChildren } from "react";
import classes from './Badge.module.css';

type badgeStyle = 'default' | 'primary' | 'secondary';

interface BadgeProps {
  style?: badgeStyle;
  super?: boolean;
  title?: string;
}
const Badge: React.FC<PropsWithChildren<BadgeProps>> = (props) => {

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
    <span title={props.title ? props.title : undefined}
          className={classList.join(' ')}>
      {props.children}
    </span>
  );
};

export default Badge;
