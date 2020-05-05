import React from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    time: {
      marginLeft: "auto",
      marginRight: theme.spacing(-1)
    }
  })
);

export const Placeholder = (): JSX.Element => {
  const classes = useStyles();

  return (
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
  );
};

export default Placeholder;
