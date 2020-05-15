import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import tw from 'twin.macro';
import { Play, Edit3, Square } from 'react-feather';
import Edit from './Edit';

import Context, { ContextType } from '../../store/context';
import { ADD_ROW, FINISH_ROW, EDIT_RECORD } from '../../store/actions';
import { useInterval } from '../../hooks/useInterval';
import { getTimeObjectFromSeconds } from '../../utils/converTime';
import { RecordType } from '../../@types';

const Button = tw.button`w-10 h-10 text-white rounded-full shadow-lg focus:outline-none focus:shadow-outline`;
const InputContainer = tw.div`flex items-center justify-between w-full mr-3`;
const Input = tw.input`w-full h-10 px-1 pb-2 mt-2 mr-1 text-lg text-gray-900 focus:outline-none truncate`;

const Timer = (): JSX.Element => {
  const { state, dispatch } = React.useContext<ContextType>(Context);

  const [isRunning, setRunning] = React.useState<boolean>(state && state.isRunning);
  const [timer, setTimer] = React.useState<number>(
    state.start ? Math.abs(Date.now() - state.start) / 1000 : 0,
  );
  const [description, setDescription] = React.useState<string>(
    state.isRunning ? state.lastRecord.description : '',
  );
  const [placeholder, setPlaceholder] = React.useState<string>('');
  const [lastRecord, setLastRecord] = React.useState<RecordType>(state.lastRecord);

  // Timer
  useInterval(() => setTimer((timer) => timer + 1), isRunning ? 1000 : null);
  // Initial Render
  const descriptionRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    (async (): Promise<void> => {
      // Funny commits //
      const response = await (await fetch('http://whatthecommit.com/index.json')).json();
      setPlaceholder(response.commit_message);
      descriptionRef.current.placeholder = `What are you working on? e.g. ${response.commit_message}`;
      //setDescription(response.commit_message);
      // Funny commits //
    })();
    descriptionRef.current.focus();
    descriptionRef.current.setSelectionRange(0, 0);

    browser.storage.onChanged.addListener(({ lastRecord }: any) => {
      lastRecord && setLastRecord(lastRecord.newValue);
    });
  }, []);

  const handlePlay = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setDescription(description === '' ? placeholder : description);
    setRunning(!isRunning);
    dispatch({
      type: ADD_ROW,
      payload: {
        record: { description: description === '' ? placeholder : description },
      },
    });
  };

  const handleStop = async (): Promise<void> => {
    setTimer(0);
    setRunning(!isRunning);
    // More funny commits //
    const response = await (await fetch('http://whatthecommit.com/index.json')).json();
    setPlaceholder(response.commit_message);
    descriptionRef.current.placeholder = `What are you working on? e.g. ${response.commit_message}`;
    //setDescription(response.commit_message);
    // More funny commits //

    setDescription('');
    descriptionRef.current.focus();
    descriptionRef.current.setSelectionRange(0, 0);

    dispatch({
      type: FINISH_ROW,
      payload: {
        record: lastRecord,
      },
    });
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    setDescription(e.target.value);
  };

  const handleInputClick = (): void => {
    isRunning &&
      dispatch({
        type: EDIT_RECORD,
        payload: { record: lastRecord, isRunning: true, showEdit: true },
      });
  };

  return (
    <>
      {!state.showEdit ? (
        <form
          className='flex items-center justify-between w-full h-24 px-4 mt-12 bg-white border-b shadow-md'
          onSubmit={handlePlay}
        >
          <InputContainer
            className={
              !isRunning
                ? 'border-b border-gray-400 hover:border-magenta-400 focus-within:border-magenta-500'
                : 'cursor-pointer'
            }
            onClick={handleInputClick}
          >
            <Input
              className={isRunning ? 'max-w-sm cursor-pointer' : 'cursor-text'}
              ref={descriptionRef}
              placeholder='What are you working on?'
              value={description}
              onChange={handleInputChange}
            />
            {isRunning && (
              <span className='w-1/4 px-1 text-lg text-right text-gray-900'>
                {getTimeObjectFromSeconds(timer, true)}
              </span>
            )}
          </InputContainer>
          <div className='flex items-center justify-end'>
            {isRunning ? (
              <>
                <Button
                  type='button'
                  className='mr-2 bg-blue-600 hover:bg-blue-700'
                  aria-label='Edit Timer'
                  onClick={(): void =>
                    dispatch({
                      type: EDIT_RECORD,
                      payload: { record: lastRecord, isRunning: true, showEdit: true },
                    })
                  }
                >
                  <Edit3 className='h-4 m-2 fill-current' />
                </Button>

                <Button
                  type='button'
                  className='bg-red-600 hover:bg-red-700'
                  aria-label='Stop'
                  onClick={handleStop}
                >
                  <Square className='h-4 m-2 fill-current' />
                </Button>
              </>
            ) : (
              <Button type='submit' className='bg-green-600 hover:bg-green-700' aria-label='Play'>
                <Play className='h-4 m-2 fill-current' />
              </Button>
            )}
          </div>
        </form>
      ) : (
        <Edit timer={isRunning ? timer : null} />
      )}
    </>
  );
};

export default Timer;
