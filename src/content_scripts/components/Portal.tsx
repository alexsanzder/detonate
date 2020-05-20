import * as React from 'react';
import ReactDOM from 'react-dom';

const Portal = ({ children }): JSX.Element => {
  const modalRoot = document.getElementById('detoante-modal');
  const el = document.createElement('div');

  React.useEffect(() => {
    modalRoot.appendChild(el);
  }, []);
  React.useEffect(() => {
    return () => modalRoot.removeChild(el);
  });
  return ReactDOM.createPortal(children, el);
};
export default React.memo(Portal);
