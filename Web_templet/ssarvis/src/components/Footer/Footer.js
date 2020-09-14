/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
// core components
import styles from "assets/jss/material-dashboard-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="/admin/mainpage" className={classes.block}>
                Home
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://edu.ssafy.com/" className={classes.block}>
                SSAFY
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://lab.ssafy.com/s03-webmobile3-sub3/s03p13a109"
                className={classes.block}
              >
                GITLAB
              </a>
            </ListItem>            
          </List>
        </div>
        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            <a
              href="/admin/dashboard"
              className={classes.a}
            >
              SSARVIS
            </a>
            , made with love for a better web
          </span>
        </p>
      </div>
    </footer>
  );
}
