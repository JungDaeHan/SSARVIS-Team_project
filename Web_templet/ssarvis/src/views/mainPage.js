import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { CommonContext } from "../context/CommonContext";
import main8 from "assets/img/main8.png";
import Sidebar from "components/Sidebar/Sidebar.js";
import routes from "routes.js";
import logo from "assets/img/logo.png";
import main7 from "assets/img/main7.png";

import { NavLink } from "react-router-dom";

export default function Mainpage() {
  const { user } = useContext(CommonContext);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [color, setColor] = React.useState("blue");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const switchRoutes = (
    <Switch>
      {routes.dashboardRoutes.map((prop, key) => {
        if (prop.layout === "/admin") {
          if (prop.path === "/notice-message" && user.user_admin !== "admin")
            return null;
          return (
            <Route
              path={prop.layout + prop.path}
              component={
                user.user_admin === "admin"
                  ? prop.component_admin
                  : prop.component_user
              }
              key={key}
            />
          );
        }
        return null;
      })}
      <Redirect from="/admin" to="/admin/dashboard" />
    </Switch>
  );

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        backgroundImage: "url(" + main8 + ")",
        backgroundPosition: "center center",
      }}
    >
      <Sidebar
        routes={routes.dashboardRoutes}
        logoText={"SSARVIS"}
        logo={logo}
        image={main7}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
      />
      <div style={{ textAlign: "center", width: "100%", height: "100%" }}>
        {user.user_state === "Logout" ? (
          <NavLink to={"/profile/Login"}>
            <button
              style={{
                backgroundColor: "transparent",
                width: "40%",
                height: "60%",
                position: "relative",
                top: "20%",
                border: 0,
                cursor: "pointer",
              }}
            ></button>
          </NavLink>
        ) : (
          <NavLink to={"/admin/dashboard"}>
            <button
              style={{
                backgroundColor: "transparent",
                width: "40%",
                height: "60%",
                position: "relative",
                top: "20%",
                border: 0,
                cursor: "pointer",
              }}
            >
              {switchRoutes}
            </button>
          </NavLink>
        )}
      </div>
    </div>
  );
}
