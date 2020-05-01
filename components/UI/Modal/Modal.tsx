import React from 'react';
import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

// todo: block scroll and handle accessibility
interface ModalProps {
  show: boolean;
  modalClosed?: (event: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
}
const modal: React.FC<ModalProps> = props => {
  return (
    <>
      <Backdrop show={props.show} clicked={props.modalClosed} />
      <div className={classes.modal}
           style={{
             transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
             opacity: props.show ? '1' : '0'
           }}>
        {props.children}
      </div>
    </>
  );

};

export default React.memo(
  modal,
  (prevProps, nextProps) =>
    nextProps.show === prevProps.show &&
    nextProps.children === prevProps.children
);
// optimization: we don't need to update its children if the modal is not opened
