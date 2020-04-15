import React from 'react';
import classes from './Container.module.css';

const Container = (props) => {

  const classList = [classes.container];

  if (props.small) {
    classList.push(classes.containerSmall);
  }
  
  return (
    <div className={classList.join(' ')}>
      {props.children}
    </div>
  );
};

export default Container;
