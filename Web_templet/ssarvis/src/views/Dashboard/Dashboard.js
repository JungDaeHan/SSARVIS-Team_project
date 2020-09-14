import React, { useState, useContext, useEffect } from "react";
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import Accessibility from "@material-ui/icons/Accessibility";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { Calendar, momentLocalizer } from "react-big-calendar"; // inuk choi - 2020/08/03
import "react-big-calendar/lib/css/react-big-calendar.css";

import moment from "moment";
import { CommonContext } from "../../context/CommonContext";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import "assets/css/checkButton.css";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

// const ColoredDateCellWrapper = ({ children }) =>
//   React.cloneElement(React.Children.only(children), {
//     style: {
//       backgroundColor: "lightblue",
//     },
//   });

const localizer = momentLocalizer(moment);

const selecttitleColor = (name) => {
  if (name[0] === "임") {
    if (name === "임의결석") return "#DF0101";
    return "#FE642E";
  } else if (name[0] === "사" || name[0] === "공") {
    return "#A5DF00";
  } else {
    return "#2E64FE";
  }
};

var tablevalue = [
  [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  [0, 0, 0],
  [0, 0],
];

export default function Dashboard() {
  let history = useHistory();
  const classes = useStyles();
  const { user, setUser } = useContext(CommonContext);

  if (user.user_state === "Logout") {
    history.push("/profile/Login");
  }

  var now_day = new Date();

  const [attendanceinfo, setAttendanceinfo] = useState([]);
  const [viewMonth, setViewMonth] = useState(now_day.getMonth() + 1);
  const [tmp, setTmp] = useState(0);

  const [userinout, setUserinout] = useState({
    is_in: false,
    user_in: "입실",
    user_in_time: "미클릭",
    is_out: false,
    user_out: "퇴실",
    user_out_time: "미클릭",
  });

  const printTable = (info) => {
    tablevalue = [
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      [0, 0, 0],
      [0, 0],
    ];

    info.map((data, index) => {
      if (data.title === "공가") {
        tablevalue[1][0]++;
      } else if (data.title === "사유결석") {
        tablevalue[1][1]++;
      } else if (data.title === "임의결석") {
        tablevalue[1][2]++;
      } else if (data.title === "사유지각") {
        tablevalue[0][0][0]++;
      } else if (data.title === "임의지각") {
        tablevalue[0][0][1]++;
      } else if (data.title === "사유조퇴") {
        tablevalue[0][1][0]++;
      } else if (data.title === "임의조퇴") {
        tablevalue[0][1][1]++;
      } else if (data.title === "사유외출") {
        tablevalue[0][2][0]++;
      } else if (data.title === "임의외출") {
        tablevalue[0][2][1]++;
      } else if (data.title === "입실") {
        tablevalue[2][0]++;
      }
    });

    tablevalue[1][2] += parseInt(
      (tablevalue[0][0][0] +
        tablevalue[0][0][1] +
        tablevalue[0][1][1] +
        tablevalue[0][2][1]) /
        3
    );

    tablevalue[0][3][0] =
      tablevalue[0][0][0] + tablevalue[0][1][0] + tablevalue[0][2][0];
    tablevalue[0][3][1] =
      tablevalue[0][0][1] + tablevalue[0][1][1] + tablevalue[0][2][1];

    tablevalue[2][1] = tablevalue[1][0] + tablevalue[1][1] + tablevalue[1][2];
    tablevalue[2][0] += tablevalue[0][0][0] + tablevalue[0][0][1];
    tablevalue[2][0] -= parseInt(
      (tablevalue[0][0][0] +
        tablevalue[0][0][1] +
        tablevalue[0][1][1] +
        tablevalue[0][2][1]) /
        3
    );
  };

  const printAttendanceinfo = (month) => {
    var att_data = [];
    let body = {
      user_no: user.user_no,
      year: `now_year=${now_day.getFullYear()}`,
      month: `now_month=${month}`,
      day:
        month === now_day.getMonth() + 1
          ? `now_day <= ${now_day.getDate()}`
          : true,
    };

    Axios.post("/api/attendance/userinfo", body).then((response) => {
      if (response.data.success === false) {
        console.log("load ERR - printAttendanceinfo");
        return;
      }

      let tmp_today_in_out = {
        is_in: false,
        user_in: "입실",
        user_in_time: "미클릭",
        is_out: false,
        user_out: "퇴실",
        user_out_time: "미클릭",
      };

      var tmp_now_year = now_day.getFullYear();
      var tmp_now_month = now_day.getMonth() + 1;
      var tmp_now_day = now_day.getDate();

      att_data.push(
        response.data.data.map((arg, index) => {
          if (
            arg.now_year === tmp_now_year &&
            arg.now_month === tmp_now_month &&
            arg.now_day === tmp_now_day
          ) {
            if (arg.user_out_time !== null) {
              tmp_today_in_out.is_out = true;
              tmp_today_in_out.user_out = arg.user_out;
              tmp_today_in_out.user_out_time = arg.user_out_time;
            }
            tmp_today_in_out.is_in = true;
            tmp_today_in_out.user_in = arg.user_in;
            tmp_today_in_out.user_in_time = arg.user_in_time;
          }

          if (arg.user_in !== null) {
            return {
              id: index * 2,
              title: arg.user_in,
              start: new Date(arg.now_year, arg.now_month - 1, arg.now_day),
              end: new Date(arg.now_year, arg.now_month - 1, arg.now_day),
              color: selecttitleColor(arg.user_in),
            };
          }
        })
      );

      response.data.data.map((arg, index) => {
        if (arg.user_out !== null) {
          att_data[0].push({
            id: index * 2 + 1,
            title: arg.user_out,
            start: new Date(arg.now_year, arg.now_month - 1, arg.now_day),
            end: new Date(arg.now_year, arg.now_month - 1, arg.now_day),
            color: selecttitleColor(arg.user_out),
          });
        }
      });

      if (month === now_day.getMonth() + 1) {
        setUserinout({
          ...userinout,
          is_in: tmp_today_in_out.is_in,
          user_in: tmp_today_in_out.user_in,
          user_in_time: tmp_today_in_out.user_in_time,
          is_out: tmp_today_in_out.is_out,
          user_out: tmp_today_in_out.user_out,
          user_out_time: tmp_today_in_out.user_out_time,
        });
      }

      printTable(att_data[0]);
      setAttendanceinfo(att_data[0]);
    });
  };

  const onClickCalendar = (date) => {
    setViewMonth(date.getMonth() + 1);
  };

  const onClickuserinoutbtn = (name) => (e) => {
    var now_time = new Date();
    var str_time = moment(now_time).format("HH:mm");

    if (name === "in" && userinout.is_in === false) {
      setUserinout({
        ...userinout,
        is_in: true,
        user_in: str_time > "09:00" ? "임의지각" : "입실",
        user_in_time: now_time,
      });
      updateinoutinfo("in", now_time);
    } else if (name === "out") {
      setUserinout({
        ...userinout,
        is_out: true,
        user_out: str_time < "18:00" ? "임의조퇴" : "퇴실",
        user_out_time: now_time,
      });
      updateinoutinfo("out", now_time);
    }
  };

  const updateinoutinfo = (inout, time) => {
    let body;
    let time_alter = new Date(new Date().setHours(new Date().getHours() + 9));
    if (inout === "in") {
      body = {
        user_no: user.user_no,
        user_in: moment(time).format("HH:mm") > "09:00" ? "임의지각" : "입실",
        user_in_time: time_alter,
        now_year: time.getFullYear(),
        now_month: time.getMonth() + 1,
        now_day: time.getDate(),
      };
    } else {
      body = {
        user_no: user.user_no,
        user_out: moment(time).format("HH:mm") < "18:00" ? "임의조퇴" : "퇴실",
        user_out_time: time_alter,
        now_year: time.getFullYear(),
        now_month: time.getMonth() + 1,
        now_day: time.getDate(),
      };
    }

    Axios.post("/api/attendance/update", body).then((response) => {
      if (response.data.success === false) {
        console.log("load ERR - printInout");
        return;
      }

      printAttendanceinfo(body.now_month);
    });
  };

  useEffect(() => {
    console.log("effect");
    printAttendanceinfo(viewMonth);
  }, [viewMonth]);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon
                style={{
                  cursor: userinout.is_in === true ? "default" : "pointer",
                  width: "56px",
                  height: "57px",
                  textAlign: "center",
                }}
                color={userinout.is_in === true ? "success" : "warning"}
                onClick={onClickuserinoutbtn("in")}
              >
                {userinout.user_in !== "입실" ? (
                  <h4
                    className={classes.cardTitlegray}
                    style={{
                      padding: "0 0 3px 3px",
                      color: userinout.is_in === true ? "white" : null,
                    }}
                  >
                    {userinout.user_in}
                  </h4>
                ) : (
                  <h3
                    className={classes.cardTitlegray}
                    style={{
                      color: userinout.is_in === true ? "white" : null,
                    }}
                  >
                    {userinout.is_in === true ? (
                      <small style={{ color: "white" }}>
                        {userinout.user_in}
                      </small>
                    ) : (
                      "입실"
                    )}
                  </h3>
                )}
              </CardIcon>
              <CardIcon
                style={{
                  cursor: "pointer",
                  width: "56px",
                  height: "57px",
                  textAlign: "center",
                }}
                color={userinout.is_out === true ? "success" : "warning"}
                onClick={onClickuserinoutbtn("out")}
              >
                {userinout.user_out !== "퇴실" ? (
                  <h4
                    className={classes.cardTitlegray}
                    style={{
                      padding: "0 0 3px 3px",
                      color: userinout.is_out === true ? "white" : null,
                    }}
                  >
                    {userinout.user_out}
                  </h4>
                ) : (
                  <h3
                    className={classes.cardTitlegray}
                    style={{
                      color: userinout.is_out === true ? "white" : null,
                    }}
                  >
                    {userinout.is_out === true ? (
                      <small style={{ color: "white" }}>
                        {userinout.user_out}
                      </small>
                    ) : (
                      "퇴실"
                    )}
                  </h3>
                )}
              </CardIcon>

              <h3 className={classes.cardTitle}>
                <small>
                  입실:{" "}
                  {userinout.is_in
                    ? moment(userinout.user_in_time).format("HH:mm")
                    : "미클릭"}
                </small>
              </h3>
              <h3 className={classes.cardTitle}>
                <small>
                  퇴실:{" "}
                  {userinout.is_out
                    ? moment(userinout.user_out_time).format("HH:mm")
                    : "미클릭"}
                </small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                {`${moment(now_day).format("yyyy-MM-DD")}`}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <h3 className={classes.cardTitle}>
                <small>강의실</small>
              </h3>
              <h3 className={classes.cardTitle}>1005호</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                강사 : 서영진
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="primary" stats icon>
              <CardIcon color="primary">
                <Accessibility />
              </CardIcon>
              <h3 className={classes.cardTitle}>
                <small>출석 점수</small>
              </h3>
              <h3 className={classes.cardTitle}>+1245</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={9}>
          <Card>
            <Calendar
              views={("month", "", "", "")}
              localizer={localizer}
              defaultDate={new Date()}
              defaultView="month"
              events={attendanceinfo}
              style={{ height: "100vh" }}
              eventPropGetter={(event) => {
                const backgroundColor = event.color;
                return { style: { backgroundColor } };
              }}
              //onSelectEvent={onClickCalendar}
              onNavigate={onClickCalendar}
            />
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info">
              <h3
                className={classes.cardTitle + classes.cardTitleWhite}
                style={{ textAlign: "center" }}
              >
                {`출석 ${tablevalue[2][0]}`}
              </h3>
            </CardHeader>

            <CardBody>
              <Table
                tableHeaderColor="info"
                tableHead={[`${viewMonth}월`, "사유", "임의"]}
                tableData={[
                  [
                    "지각",
                    `${tablevalue[0][0][0]}회`,
                    `${tablevalue[0][0][1]}회`,
                  ],
                  [
                    "조퇴",
                    `${tablevalue[0][1][0]}회`,
                    `${tablevalue[0][1][1]}회`,
                  ],
                  [
                    "외출",
                    `${tablevalue[0][2][0]}회`,
                    `${tablevalue[0][2][1]}회`,
                  ],
                  [
                    "합계",
                    `${tablevalue[0][3][0]}회`,
                    `${tablevalue[0][3][1]}회`,
                  ],
                ]}
              />
            </CardBody>
            <br></br>
            <CardHeader color="danger">
              <h3
                className={classes.cardTitle + classes.cardTitleWhite}
                style={{ textAlign: "center" }}
              >
                {`결석 ${tablevalue[2][1]}일`}
              </h3>
            </CardHeader>
            <CardBody>
              <Table
                tableData={[
                  ["공가", `${tablevalue[1][0]}일`],
                  ["사유", `${tablevalue[1][1]}일`],
                  ["임의", `${tablevalue[1][2]}일`],
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
