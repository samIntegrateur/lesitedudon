import React from 'react';
import classes from './TabContent.module.css';

const TabContent = (props) => {
  return (
    <section className={classes.tabContent}>
      {props.children}
    </section>
  );
};

export default TabContent;
