import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import {
  Toolbar,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    background : '#364f6b',
  },
}));

export default function PrimarySearchAppBar() {

  const classes = useStyles();

  return (
    <div>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            ASSIGNMENT
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
