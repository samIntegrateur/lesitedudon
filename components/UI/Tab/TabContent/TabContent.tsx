import React from 'react';
import classes from './TabContent.module.css';

const TabContent: React.FC = (props): JSX.Element => {
  return (
    <section className={classes.tabContent}>
      {props.children}
    </section>
  );
};

export default TabContent;
