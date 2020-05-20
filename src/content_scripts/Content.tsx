import * as React from 'react';
import ButtonDetonate from './components/ButtonDetonate';
import { useModal } from './components/useModal';

const Content = (): JSX.Element => {
  const [description, setDescription] = React.useState<string>('');
  const [project, setProject] = React.useState<string>('');
  const [ticket, setTicket] = React.useState<string>('');
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

  const scrapeIssueInfo = () => {
    // Jira Issue description
    const summary = document.querySelector('#summary-val').innerHTML;

    // Jira Parent issue ticket
    const parentIssueKey = document.querySelector('#parent_issue_summary');
    const parentTicket = parentIssueKey && parentIssueKey.getAttribute('data-issue-key');
    const project = parentIssueKey && parentIssueKey.getAttribute('original-title');
    console.log('PRO', project);

    // Jira Issue ticket
    const issueKey = document.querySelector('#key-val');
    const issueTicket = issueKey && issueKey.getAttribute('data-issue-key');

    return {
      description: `${issueTicket} ${summary}`,
      project: project,
      ticket: parentTicket ? parentTicket : issueTicket,
    };
  };

  React.useLayoutEffect(() => {
    const { description, project, ticket } = scrapeIssueInfo();
    setDescription(description);
    setProject(project);
    setTicket(ticket);
  }, []);

  // const handleClose = () => {
  //   setAnchor(null);
  // };

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
