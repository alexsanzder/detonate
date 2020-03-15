import React from "react";
import clsx from "clsx";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Skeleton from "@material-ui/lab/Skeleton";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";

import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";

import Edit from "../Edit";

import { AppContext } from "../../contexts/AppProvider";
import GoogleAuthContext from "../../contexts/useGoogleAuth";

import { getTimeFormated } from "../../utils/time";

import { RecordType } from "../../hooks/useGoogle";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      paddingTop: theme.spacing(2.5)
    },
    card: {
      width: "100%",
      marginBottom: theme.spacing(2.5)
    },
    cardHeader: {
      height: 55.63
    },
    cardContent: {
      padding: theme.spacing(2, 2, 1)
    },
    right: {
      marginLeft: "auto"
    },
    divider: {
      margin: theme.spacing(0, 2, 0, 2)
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(0.25)
      }
    },
    button: {
      "&:hover": {
        backgroundColor: "inherit"
      }
    },
    container: {
      position: "relative"
    },
    buttons: {
      position: "absolute",
      top: "-44px",
      right: " 0"
    },
    iconPlay: {
      "&:hover": {
        color: theme.palette.success.main
      }
    },
    iconEdit: {
      "&:hover": {
        color: theme.palette.primary.main
      }
    },
    time: {
      marginLeft: "auto",
      marginRight: theme.spacing(-1)
    },
    popper: {
      top: theme.spacing(-2.5)
    },
    hide: {
      display: "none"
    },
    warning: {
      display: "block",
      padding: theme.spacing(0, 0.5, 0, 0)
    },
    disabled: {
      opacity: 0.5
    }
  })
);

const Summary = (): JSX.Element => {
  const classes = useStyles();

  const { locale } = React.useContext(AppContext);
  const { records, loadTable } = React.useContext(GoogleAuthContext);

  const [openEdit, setOpenEdit] = React.useState(false);
  const [record, setRecord] = React.useState();

  const groupBy = (array: any[], key: string): any => {
    return records?.reduce((result: any, currentValue: any) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  };
  const data = groupBy(records, "date");

  const formatedDate = (date: string): string => {
    const splits = date.split(".");
    return new Date(splits.reverse().join("-")).toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const totalTime = (data: any): string => {
    const total = data?.reduce((acc: number, curr: any) => {
      return acc + curr.time;
    }, 0);
    return getTimeFormated(total);
  };

  const handleOpenEdit = (
    _event: React.ChangeEvent<{}>,
    record: RecordType
  ): void => {
    setRecord(record);
    setOpenEdit(!openEdit);
  };

  const handleCloseEdit = (): void => {
    loadTable && loadTable();
    setOpenEdit(false);
  };

  return (
    <Grid container className={classes.root}>
      {data ? (
        Object.keys(data).map((date: string) => (
          <Card className={classes.card} key={date}>
            <CardHeader
              //className={classes.cardHeader}
              disableTypography
              title={
                <Typography color="textPrimary" variant="body1">
                  <b>{formatedDate(date)}</b>
                </Typography>
              }
              action={
                <Typography color="textPrimary" variant="body1">
                  <b>{totalTime(data[date])}</b>
                </Typography>
              }
            />
            {data[date].map((record: RecordType) => (
              <React.Fragment key={record.id}>
                <Divider className={classes.divider} light />
                <CardActionArea
                  key={record.id}
                  onClick={(e): void => handleOpenEdit(e, record)}
                >
                  <CardContent className={classes.cardContent}>
                    <Grid container>
                      <Grid item xs={9}>
                        <Typography
                          noWrap
                          variant="subtitle2"
                          classes={{
                            root:
                              record.description === "(no description)"
                                ? classes.disabled
                                : undefined
                          }}
                        >
                          {record.description}
                        </Typography>
                      </Grid>
                      <Grid item className={classes.right}>
                        <Typography
                          variant="subtitle2"
                          color={record.time < 0.5 ? "error" : "inherit"}
                        >
                          <Tooltip
                            title="Minimum time 0.5h"
                            arrow
                            classes={{
                              tooltip:
                                record.time < 0.5
                                  ? classes.popper
                                  : classes.hide
                            }}
                          >
                            <Grid container>
                              <Grid item>
                                <WarningRoundedIcon
                                  fontSize="small"
                                  className={clsx(classes.hide, {
                                    [classes.warning]: record.time < 0.5
                                  })}
                                />
                              </Grid>
                              <Grid item>{getTimeFormated(record.time)}</Grid>
                            </Grid>
                          </Tooltip>
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions disableSpacing>
                    <Grid item className={classes.chips}>
                      {record.company && (
                        <Chip
                          size="small"
                          color="default"
                          variant="outlined"
                          label={record.company}
                          disabled={record.company === "(no company)"}
                        />
                      )}
                      {record.project && (
                        <Chip
                          size="small"
                          color="default"
                          variant="outlined"
                          label={record.project && record.project}
                          disabled={record.project === "(no project)"}
                        />
                      )}
                      {record.ticket && (
                        <Chip
                          size="small"
                          color="default"
                          variant="outlined"
                          label={record.ticket}
                          disabled={record.ticket === "(no ticket)"}
                        />
                      )}
                    </Grid>
                  </CardActions>
                </CardActionArea>
                <div className={classes.container}>
                  <div className={classes.buttons}>
                    <IconButton
                      className={classes.button}
                      size="medium"
                      onClick={(e): void => handleOpenEdit(e, record)}
                    >
                      <EditRoundedIcon
                        fontSize="small"
                        className={classes.iconEdit}
                      />
                    </IconButton>
                    <IconButton className={classes.button} size="medium">
                      <PlayArrowRoundedIcon
                        fontSize="small"
                        className={classes.iconPlay}
                      />
                    </IconButton>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </Card>
        ))
      ) : (
        <React.Fragment>
          <Card className={classes.card}>
            <CardHeader
              className={classes.cardHeader}
              disableTypography
              title={
                <Grid container>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={18}
                    width={"70%"}
                  />
                  <Skeleton
                    className={classes.time}
                    variant="text"
                    animation="wave"
                    height={18}
                    width={"20%"}
                  />
                </Grid>
              }
            />
            <Divider className={classes.divider} />
            <CardActionArea>
              <CardContent className={classes.cardContent}>
                <Grid container>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={16}
                    width={"75%"}
                  />
                  <Skeleton
                    className={classes.right}
                    variant="text"
                    animation="wave"
                    height={16}
                    width={"15%"}
                  />
                </Grid>
              </CardContent>
              <CardContent>
                <Grid container>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={16}
                    width={"60%"}
                  />
                  <Skeleton
                    className={classes.right}
                    variant="text"
                    animation="wave"
                    height={16}
                    width={"20%"}
                  />
                </Grid>
              </CardContent>
            </CardActionArea>
            <Divider className={classes.divider} />
            <CardActionArea>
              <CardContent className={classes.cardContent}>
                <Grid container>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={16}
                    width={"60%"}
                  />
                  <Skeleton
                    className={classes.right}
                    variant="text"
                    animation="wave"
                    height={16}
                    width={"30%"}
                  />
                </Grid>
              </CardContent>
              <CardContent>
                <Grid container>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={16}
                    width={"70%"}
                  />
                  <Skeleton
                    className={classes.right}
                    variant="text"
                    animation="wave"
                    height={16}
                    width={"20%"}
                  />
                </Grid>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.card}>
            <CardHeader
              className={classes.cardHeader}
              disableTypography
              title={
                <Grid container>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={18}
                    width={"75%"}
                  />
                  <Skeleton
                    className={classes.time}
                    variant="text"
                    animation="wave"
                    height={18}
                    width={"20%"}
                  />
                </Grid>
              }
            />
            <Divider className={classes.divider} />
            <CardActionArea>
              <CardContent className={classes.cardContent}>
                <Grid container>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={16}
                    width={"55%"}
                  />
                  <Skeleton
                    className={classes.right}
                    variant="text"
                    animation="wave"
                    height={16}
                    width={"15%"}
                  />
                </Grid>
              </CardContent>
              <CardContent>
                <Grid container>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={16}
                    width={"70%"}
                  />
                  <Skeleton
                    className={classes.right}
                    variant="text"
                    animation="wave"
                    height={16}
                    width={"20%"}
                  />
                </Grid>
              </CardContent>
            </CardActionArea>
          </Card>
        </React.Fragment>
      )}
      <Edit
        open={openEdit}
        handleClose={handleCloseEdit}
        record={record}
        setRecord={setRecord}
      />
    </Grid>
  );
};
export default Summary;
