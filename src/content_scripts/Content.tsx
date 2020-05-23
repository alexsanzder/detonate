import * as React from 'react';
import ButtonDetonate from './components/ButtonDetonate';
import { useModal } from './components/useModal';

export interface ContentProps {
  description?: string;
  project?: string;
  ticket?: string;
}

const Content = ({ description, project, ticket }: ContentProps): JSX.Element => {
  const [record, setRecord] = React.useState({});

  const [isRunning, setRunning] = React.useState<boolean>(false);
  const { show, Portal } = useModal(); // we could also spread 'hide' here, if we somehow needed it outside of the modal
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const descRef = React.useRef<HTMLInputElement>(null);

  const setFocus = (): void => {
    descRef.current && descRef.current.setSelectionRange(0, 0);
    descRef.current && descRef.current.focus();
  };

  React.useEffect(() => {
    setFocus();
  }, [descRef, setFocus]);

  // const handleStart = () => {};

  // const handleUpdate = () => {};

  // const handleStop = () => {};

  return (
    <>
      <ButtonDetonate
        ref={buttonRef}
        onClick={show}
        title={isRunning && isRunning ? 'Stop timer' : 'Start timer'}
      />
      <Portal anchor={buttonRef} title={isRunning && isRunning ? 'Stop timer' : 'Start timer'}>
        <form className='flex flex-col items-center justify-center w-full'>
          <input
            ref={descRef}
            className='w-full px-4 py-2 mb-2 text-base font-normal text-gray-700 border rounded-md hover:border-blue-500 focus:outline-none focus:shadow-outline'
            placeholder='Add description'
            value={description}
          />
          <input
            className='w-full px-4 py-2 mb-2 text-base font-normal text-gray-700 border rounded-md hover:border-blue-500 focus:outline-none focus:shadow-outline'
            placeholder='Add project'
            value={project}
          />
          <input
            className='w-full px-4 py-2 mb-2 text-base font-normal text-gray-700 border rounded-md hover:border-blue-500 focus:outline-none focus:shadow-outline'
            placeholder='Add ticket'
            value={ticket}
          />
          <button className='w-full px-4 py-2 mt-3 text-white border rounded-md shadow-sm border-magenta-500 bg-magenta-500 hover:bg-magenta-600 hover:border-magenta-600 focus:outline-none focus:shadow-outline'>
            Done
          </button>
        </form>
      </Portal>
    </>
  );
};

export default Content;
