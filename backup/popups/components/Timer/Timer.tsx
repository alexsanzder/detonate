import * as React from 'react';
import clsx from 'clsx';

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import Fab from '@material-ui/core/Fab';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import {} from '@material-ui/core/colors';

import Edit from '../Edit/Edit';

import GoogleAuthContext from '../../contexts/useGoogleAuth';
import { AppContext, defaultRecord } from '../../contexts/AppProvider';
import { ThemeContext } from '../../contexts/ThemeProvider';

import { useInterval } from '../../hooks/useInterval';

import { getFraction, getTimeFromSeconds } from '../../utils/converTime';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'sticky',
      top: '48px',
      zIndex: 100,
    },
    paper: {
      backgroundColor: '#585858',
      margin: 0,
    },
    card: {
      borderRadius: 0,
      backgroundColor: theme.palette.background.paper,
    },
    input: {
      cursor: 'pointer',
    },
    fab: {
      marginLeft: theme.spacing(1),
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.25),
      },
    },
    wrapper: {
      position: 'relative',
    },
    buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700],
      },
    },
    fabProgress: {
      color: green[700],
      position: 'absolute',
      top: -4,
      left: -3,
      zIndex: 1,
    },
    fabProgressEdit: {
      color: theme.palette.primary.dark,
      position: 'absolute',
      top: -4,
      left: 5,
      zIndex: 1,
    },
    fabProgressStop: {
      color: theme.palette.secondary.dark,
      position: 'absolute',
      top: -4,
      right: -3,
      zIndex: 1,
    },
  }),
);

const Timer = (): JSX.Element => {
  const classes = useStyles();

  const { addRecord, updateRecord, currentUser, loadTable } = React.useContext(GoogleAuthContext);
  const { themeName } = React.useContext(ThemeContext);

  const {
    locale,
    running,
    toggleRunning,
    reload,
    toggleReload,
    record,
    setRecord,
  } = React.useContext(AppContext);

  const [openEdit, setOpenEdit] = React.useState<boolean>(false);
  const [seconds, setSeconds] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<string>('');
  const [success, setSuccess] = React.useState<string>('');

  useInterval(() => setSeconds((seconds) => seconds + 1), running ? 1000 : null);

  React.useEffect(() => {
    if (loading && reload && !running) {
      setSeconds(0);
      setRecord(defaultRecord);
      // loadTable && loadTable();
      setSuccess('');
    }
  }, [loading, reload, running, setRecord]);

  const handlePlay = async (): Promise<void> => {
    setSuccess('');
    setLoading('play');
    const today = new Date().toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const response =
      addRecord &&
      (await addRecord([
        currentUser.getName(),
        today,
        record?.company ? record?.company : '(no company)',
        record?.project ? record?.project : '(no project)',
        record?.description ? record?.description : '(no description)',
        record?.ticket ? record?.ticket : '(no ticket)',
        '0',
      ]));

    const {
      result: {
        updates: { updatedRange },
      },
    } = response;

    setRecord({
      id: updatedRange,
      name: currentUser.getName(),
      date: today,
      company: record?.company ? record?.company : '(no company)',
      project: record?.project ? record?.project : '(no project)',
      description: record?.description ? record?.description : '(no description)',
      ticket: record?.ticket ? record?.ticket : '(no ticket)',
      time: record?.time ? record?.time : seconds,
    });

    setSuccess('play');
    setLoading('');
    toggleRunning(!running);
  };

  const handleStop = async (): Promise<void> => {
    toggleRunning(false);
    setLoading('stop');
    setSuccess('');
    setRecord({ ...record, description: 'Loading...' });

    const today = new Date().toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    if (record.date === today) {
      updateRecord &&
        (await updateRecord(record.id ? record?.id : '', [
          null,
          today,
          record.company,
          record.project,
          record.description,
          record.ticket,
          record.time + getFraction(seconds),
        ]));
    } else {
      addRecord &&
        (await addRecord([
          currentUser.getName(),
          today,
          record.company,
          record.project,
          record.description,
          record.ticket,
          getFraction(seconds),
        ]));
    }

    toggleReload(true);
    toggleRunning(false);
    setLoading('');
    setSuccess('stop');
  };

  const handleOpenEdit = (): void => {
    if (running) {
      setSuccess('');
      setLoading('');
      setOpenEdit(!openEdit);
    }
  };

  const timer = React.useRef<any>();
  const handleCloseEdit = (): void => {
    setOpenEdit(false);
    if (loading === '') {
      setSuccess('');
      setLoading('edit');
      timer.current = setTimeout(() => {
        setSuccess('edit');
        setLoading('');
      }, 1000);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRecord({ ...record, [event.target.name]: event.target.value });
  };

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          classes={
            themeName === 'darkTheme'
              ? {
                  root: classes.paper,
                }
              : undefined
          }
          disableTypography
          title={
            <Grid container onClick={handleOpenEdit}>
              <Grid item xs={9}>
                <InputBase
                  fullWidth
                  name='description'
                  placeholder='What are you working on?'
                  inputProps={{
                    className: running ? classes.input : undefined,
                  }}
                  value={record.description}
                  onChange={handleChange}
                />
              </Grid>
              {running && (
                <Grid item xs={3}>
                  <InputBase
                    fullWidth
                    placeholder='00:00:00'
                    value={getTimeFromSeconds(seconds)}
                    inputProps={{
                      readOnly: true,
                      style: {
                        textAlign: 'right',
                      },
                      className: running ? classes.input : undefined,
                    }}
                  />
                </Grid>
              )}
            </Grid>
          }
          action={
            !running ? (
              <div className={classes.wrapper}>
                <Fab
                  color='default'
                  size='small'
                  onClick={handlePlay}
                  className={clsx({
                    [classes.buttonSuccess]: success === 'play',
                  })}
                >
                  {success === 'play' ? <CheckRoundedIcon /> : <PlayArrowRoundedIcon />}
                </Fab>
                {loading === 'play' && (
                  <CircularProgress size={47} className={classes.fabProgress} />
                )}
              </div>
            ) : (
              <div>
                <div className={classes.wrapper}>
                  <Fab
                    className={clsx(classes.fab, {
                      [classes.buttonSuccess]: success === 'edit',
                    })}
                    color='primary'
                    size='small'
                    onClick={handleOpenEdit}
                  >
                    {success === 'edit' ? <CheckRoundedIcon /> : <EditRoundedIcon />}
                  </Fab>
                  {loading === 'edit' && (
                    <CircularProgress size={47} className={classes.fabProgressEdit} />
                  )}
                  <Fab
                    className={clsx(classes.fab, {
                      [classes.buttonSuccess]: success === 'stop',
                    })}
                    color='secondary'
                    size='small'
                    onClick={handleStop}
                  >
                    {success === 'stop' ? <CheckRoundedIcon /> : <StopRoundedIcon />}
                  </Fab>
                  {loading === 'stop' && (
                    <CircularProgress size={47} className={classes.fabProgressStop} />
                  )}
                </div>
              </div>
            )
          }
        />
      </Card>
      <Edit
        open={openEdit}
        handleClose={handleCloseEdit}
        timer={getTimeFromSeconds(seconds)}
        record={record}
        setRecord={setRecord}
      />
    </div>
  );
};

export default Timer;
