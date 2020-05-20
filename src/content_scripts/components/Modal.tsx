import * as React from 'react';
import ReactDOM from 'react-dom';
import { X } from 'react-feather';

import ButtonDetonate from './ButtonDetonate';

type ModalProps = {
  title: string;
  children: React.ReactChild;
  anchor: React.MutableRefObject<HTMLButtonElement>;
  closeModal: () => void;
};

const Modal = ({ anchor, title, closeModal, children }: ModalProps): JSX.Element => {
  const domEl = document.getElementById('detonate-modal');
  if (!domEl) return null;

  React.useLayoutEffect(() => {
    const pos = anchor.current.getBoundingClientRect();
    //console.log(pos);
    // setStyle({ top: pos.top, left: pos.left, position: 'fixed' });
    const style = `top: ${pos.top}px; left: ${pos.left}px; position: fixed;`;
    domEl.setAttribute('style', style);
  }, [anchor]);

  // This is where the magic happens -> our modal div will be rendered into our 'detoante-modal' div, no matter where we
  // use this component inside our React tree
  return ReactDOM.createPortal(
    <div
      className='z-50 -mt-3 -ml-4 bg-white border rounded-md shadow-md w-96'
      role='dialog'
      aria-labelledby='modal-label'
      aria-modal='true'
    >
      <div className='flex items-center justify-between p-4'>
        <ButtonDetonate onClick={closeModal} title={title} />
        <button
          className='flex items-center justify-center block w-8 h-8 px-1 m-1 -m-1 text-2xl font-medium text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:shadow-outline'
          type='button'
          aria-label='Close'
          onClick={closeModal}
        >
          <X className='stroke-2' height='20' width='20' />
        </button>
      </div>
      <div className='px-4 pt-2 pb-4'>{children}</div>
    </div>,
    domEl,
  );
};

export default React.memo(Modal);
