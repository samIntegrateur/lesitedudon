import React from 'react';
import classes from './Backdrop.module.css';

interface BackdropProps {
  show: boolean;
  clicked?: (event: React.MouseEvent<HTMLElement>) => void;
}
const Backdrop: React.FC<BackdropProps> = (props) => {
  return (
    props.show
      ? <div className={classes.backdrop} onClick={props.clicked}></div>
      : null
  );
};

export default Backdrop;
