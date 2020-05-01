import React from 'react';
import classes from './Spinner.module.css';

interface SpinnerProps {
  primary?: boolean;
  small?: boolean;
}
const Spinner: React.FC<SpinnerProps> = (props) => {
  const classList = [classes.loader];
  if (props.primary) {
    classList.push(classes.loaderPrimary);
  }
  if (props.small) {
    classList.push(classes.loaderSmall);
  }
  return (
    <div className={classList.join(' ')}>Loading...</div>
  )
};

export default Spinner;
