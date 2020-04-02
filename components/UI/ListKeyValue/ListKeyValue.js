import React from 'react';
import classes from './ListKeyValue.module.css';

const ListKeyValue = ({data}) => {
  return (
    <ul className={classes.listKeyValue}>
      {
        data.map(item => (
          <li key={item.label} className={classes.listKeyValue__item}>
            <span className={classes.listKeyValue__itemKey}>
              {item.label}&nbsp;:
            </span>
            <strong className={classes.listKeyValue__itemValue}>
              {item.value}
            </strong>
          </li>
        ))
      }
    </ul>
  );
};

export default ListKeyValue;
