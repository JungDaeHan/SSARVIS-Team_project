/*eslint-disable*/
import React, { useContext } from "react";
import clsx from "clsx";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";
import RTLNavbarLinks from "components/Navbars/RTLNavbarLinks.js";

import styles from "assets/jss/material-dashboard-react/components/sidebarStyle.js";
import { CommonContext } from "../../context/CommonContext";

const useStyles = makeStyles(styles);

export default function Sidebar(props) {
  const classes = useStyles();

  function activeRoute(routeName) {
    return window.location.href.indexOf(routeName) > -1 ? true : false;
  }
  const { color, logo, image, logoText, routes } = props;
  const { user, setUser, sideberOpen, setsideberOpen } = useContext(
    CommonContext
  );

  const handleDrawerClose = () => {
    if (sideberOpen) setsideberOpen(false);
    else setsideberOpen(true);
  };

  var links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        if (prop.path !== "/mainpage") {
          var activePro = " ";
          var listItemClasses;
          var fullPath = prop.layout + prop.path;
          if (prop.path === "/upgrade-to-pro") {
            activePro = classes.activePro + " ";
            listItemClasses = classNames({
              [" " + classes[color]]: true,
            });
          } else {
            listItemClasses = classNames({
              [" " + classes[color]]: activeRoute(prop.layout + prop.path),
            });
          }

          const whiteFontClasses = classNames({
            [" " + classes.whiteFont]: activeRoute(prop.layout + prop.path),
          });

          if (prop.path === "/user" && user.user_state === "Logout") {
            fullPath = "/profile/Login";
          }

          if (prop.path === "/notice-message" && user.user_admin !== "admin")
            return null;

          return (
            <div key={key}>
              {sideberOpen === true || props.open === true ? (
                <NavLink
                  to={fullPath}
                  className={activePro + classes.item}
                  activeClassName="active"
                  key={key}
                >
                  <ListItem
                    button
                    className={classes.itemLink + listItemClasses}
                  >
                    <prop.icon
                      className={classNames(
                        classes.itemIcon,
                        whiteFontClasses,
                        {
                          [classes.itemIconRTL]: props.rtlActive,
                        }
                      )}
                    />
                    <ListItemText
                      primary={props.rtlActive ? prop.rtlName : prop.name}
                      className={classNames(
                        classes.itemText,
                        whiteFontClasses,
                        {
                          [classes.itemTextRTL]: props.rtlActive,
                        }
                      )}
                      disableTypography={true}
                    />
                  </ListItem>
                </NavLink>
              ) : (
                <NavLink
                  to={fullPath}
                  className={activePro + classes.item}
                  activeClassName="active"
                  key={key}
                >
                  <ListItem button className={classes.itemLink}>
                    <prop.icon
                      className={classNames(
                        classes.itemIcon,
                        whiteFontClasses,
                        {
                          [classes.itemIconRTL]: props.rtlActive,
                        }
                      )}
                    />
                    <br></br>
                  </ListItem>
                </NavLink>
              )}
            </div>
          );
        }
      })}
      )
    </List>
  );
  var brand = (
    <div>
      {sideberOpen === true ? (
        <div className={classes.logo}>
          <a
            href="/mainpage"
            className={classNames(classes.logoLink, {
              [classes.logoLinkRTL]: props.rtlActive,
            })}
          >
            <div className={classes.logoImage}>
              <img src={logo} alt="logo" className={classes.img} />
            </div>
            {logoText}
          </a>
        </div>
      ) : (
        <div className={classes.logo}>
          <a
            href="/mainpage"
            className={classNames(classes.logoLink, {
              [classes.logoLinkRTL]: props.rtlActive,
            })}
          >
            <div className={classes.logoImage}>
              <img src={logo} alt="logo" className={classes.img} />
            </div>
          </a>
        </div>
      )}
    </div>
  );

  var sidebarTab = (
    <div className={classes.logo}>
      <div
        onClick={handleDrawerClose}
        style={{
          background: "transparent",
          cursor: "pointer",
          float: "right",
          marginRight: "12px",
        }}
      >
        {sideberOpen === true ? (
          <ArrowBackIosIcon
            className={classes.itemIcon_small}
          ></ArrowBackIosIcon>
        ) : (
          <ArrowForwardIosIcon
            className={classes.itemIcon_small}
          ></ArrowForwardIosIcon>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? "left" : "right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {props.rtlActive ? <RTLNavbarLinks /> : <AdminNavbarLinks />}
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          variant="permanent"
          className={clsx(classes.drawerPaper, {
            [classes.drawerOpen]: sideberOpen,
            [classes.drawerClose]: !sideberOpen,
          })}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
              [classes.drawerOpen]: sideberOpen,
              [classes.drawerClose]: !sideberOpen,
            }),
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>

          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}

          {sidebarTab}
        </Drawer>
        <Drawer
          open={!props.open}
          variant="permanent"
          className={clsx(classes.drawerSmallPaper, {})}
          classes={{
            paper: classNames(classes.drawerSmallPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper_small}>{links}</div>

          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}

          {sidebarTab}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};
