import React from 'react';
import classes from './ListKeyValue.module.css';

interface KeyValueType {
  key: string;
  value: string | number | Date;
}

interface ListKeyValueProps {
  dataList: KeyValueType[];
}
const ListKeyValue: React.FC<ListKeyValueProps> = ({dataList}) => {
  return (
    <ul className={classes.listKeyValue}>
      {
        dataList.map(item => (
          <li key={item.key} className={classes.listKeyValue__item}>
            <span className={classes.listKeyValue__itemKey}>
              {item.key}&nbsp;:
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
