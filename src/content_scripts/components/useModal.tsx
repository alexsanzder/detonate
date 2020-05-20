import * as React from 'react';

import Modal from './Modal';

export const useModal = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  const show = (): void => setIsVisible(true);
  const hide = (): void => setIsVisible(false);

  const Portal = ({
    title,
    anchor,
    children,
  }: {
    title: string;
    anchor: React.MutableRefObject<HTMLButtonElement>;
    children: React.ReactChild;
  }): JSX.Element => (
    <>
      {isVisible && (
        <Modal anchor={anchor} title={title} closeModal={hide}>
          {children}
        </Modal>
      )}
    </>
  );

  return {
    show,
    hide,
    Portal,
  };
};
