import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NoticeToolbar, NoticeTable } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

const NoticeList = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NoticeToolbar />
      <div className={classes.content}>
        <NoticeTable> 

        </NoticeTable>
      </div>
    </div>
  );
};

export default NoticeList;
