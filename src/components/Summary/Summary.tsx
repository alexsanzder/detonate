import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";
import Fab from "@material-ui/core/Fab";

import { AppContext } from "../../contexts/AppProvider";
import GoogleAuthContext from "../../contexts/useGoogleAuth";

import { getTimeFormated } from "../../utils/time";

import { RecordType } from "../../hooks/useGoogle";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      padding: theme.spacing(2)
    },
    card: {
      marginBottom: 20
    },
    media: {
      height: 140
    },
    actions: {
      display: "flex"
    },
    coin: {
      marginLeft: "auto"
    },
    favorite: {
      marginLeft: 300,
      marginTop: -250
    }
  })
);

const Summary = (): JSX.Element => {
  const classes = useStyles();

  const { reload, toggleReload, locale } = React.useContext(AppContext);
  const { records, loadTable } = React.useContext(GoogleAuthContext);

  const groupBy = (array: any[], key: string) => {
    return records?.reduce((result: any, currentValue: any) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  };
  const data = groupBy(records, "date");

  const formatedDate = (date: string) => {
    const splits = date.split(".");
    return new Date(splits.reverse().join("-")).toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <GridList cols={1} className={classes.root}>
      {data ? (
        Object.keys(data).map((date: string) => (
          <Card className={classes.card} key={date}>
            <CardActionArea>
              <Typography variant="caption">90 m</Typography>

              <CardContent>
                <Typography component="p">
                  Lizards are a widespread group of squamate reptiles, with over
                  6,000 species, ranging across all continents except Antarctica
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions className={classes.actions}>
              <Icon>room</Icon>
              <Typography variant="caption">90 m</Typography>
              <IconButton
                aria-label="Add to favorites"
                className={classes.coin}
              >
                <Icon>attach_money</Icon>
                <Typography variant="caption">10 mozzarella coin</Typography>
              </IconButton>
            </CardActions>
          </Card>
        ))
      ) : (
        <>Loading...</>
      )}
    </GridList>
  );
};
export default Summary;
