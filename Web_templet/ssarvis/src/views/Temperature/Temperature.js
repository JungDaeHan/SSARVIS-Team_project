import React, { useState, useContext } from "react";
import "date-fns";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ChartistGraph from "react-chartist";
import AccessTime from "@material-ui/icons/AccessTime";
import Button from "components/CustomButtons/Button.js";
import TextField from "@material-ui/core/TextField";
import { CommonContext } from "../../context/CommonContext";
import DateFnsUtils from "@date-io/date-fns";

// for filter button
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Axios from "axios";

import { useHistory } from "react-router-dom";

import { temp_temperature } from "variables/data.js";
import { temperatureLineChart, temperatureChart } from "variables/charts.js";
import { Grid } from "@material-ui/core";
import { Line, Bar } from "react-chartjs-2";

import "assets/css/checkButton.css";
//import { response } from "express";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

var today = new Date();
const useStyles = makeStyles(styles);

var temperDay = temp_temperature.labels;
var temperList = temp_temperature.datas;
var temperColor = []
var temDangerList = "";

for(let i=0; i<temperDay.length; i++) {
  if( temperList[i] >= 37.5 ) {
    temperColor.push("#ff5566");
    temDangerList += temperDay[i] + " 에 위험 온도로 측정되었습니다.\n";
  }
  else if( temperList[i] >= 37.0){
    temperColor.push("#ffff66")
  }
  else{
    temperColor.push("#AFA");
  }
}

export default function Temperature() {
  let history = useHistory();
  const classes = useStyles();

  const { user } = useContext(CommonContext);

  if (user.user_state === "Logout") {
    history.push("/profile/Login");
  }

  const [selectMonth, setselectMonth] = useState({
    month: "",
  });

  const [temperData, setTemperData] = useState({
    temperDay: temperDay,
    temperList: temperList,
    temperColor: temperColor,
    temDangerList: "",
    datas: {
      labels: temperDay,
      datasets: [
        {
          data: temperList, //temperList,
          backgroundColor: temperColor,
          fill: false,
          pointRadius: 8,
          borderColor: "#888",
          tension: 0,
        },
      ],
    },
  });

  const temperDataChange = (month) => {
    var body = {
      user_no: user.user_no,
      month: month,
    };

    Axios.post("/api/attendance/temperature", body).then((response) => {
      temperDay = [];
      temperList = [];
      temperColor = [];
      temDangerList = "";

      if (response.data.success) {
        for (var i = 1; i <= response.data.data.length; i++) {
          if (month === 2 && i === 30) break;
          else if (
            (month === 2 ||
              month === 4 ||
              month === 6 ||
              month === 9 ||
              month === 11) &&
            i === 31
          )
            break;

          if (response.data.data[i - 1].user_c1 != null)
            temperDay.push(month + "/" + i);
        }

        for (i = 0; i < response.data.data.length; i++) {
          if (response.data.data[i].user_c1 != null)
            temperList.push(
              parseFloat(
                (
                  (response.data.data[i].user_c1 +
                    response.data.data[i].user_c2) /
                  2
                ).toFixed(1)
              )
            );
        }

        for (i = 0; i < temperList.length; i++) {
          if (temperList[i] >= 37.5) {
            temperColor.push("#ff5566");
            temDangerList += temperDay[i] + " 에 위험 온도로 측정되었습니다.\n";
          } else if (temperList[i] >= 37.0) {
            temperColor.push("#ffff66");
          } else {
            temperColor.push("#AFA");
          }
        }
      }

      setTemperData({
        temperDay: temperDay,
        temperList: temperList,
        temperColor: temperColor,
        temDangerList: temDangerList,
        datas: {
          labels: temperDay,
          datasets: [
            {
              data: temperList,
              backgroundColor: temperColor,
              fill: false,
              pointRadius: 8,
              pointBorderWidth: 0,
              tension: 0,
              borderColor: "black",
            },
          ],
        },
      });
    });
  };

  const handleChange = (event) => {
    setselectMonth({
      month: event.target.value,
    });
    temperDataChange(event.target.value);
  };

  const [contentStyle, setcontentStyle] = useState({
    chartType: "bar",
    button_line: "white",
    button_bar: "danger",
  });

  const buttonChange = (type) => () => {
    // 괄호를 하나 더 넣으면 infinite loop 이 안나는 이유
    if (type === "bar") {
      setcontentStyle({
        chartType: "bar",
        button_line: "white",
        button_bar: "danger",
      });
    } else if (type === "line") {
      setcontentStyle({
        chartType: "line",
        button_line: "danger",
        button_bar: "white",
      });
    }
  };

  return (
    <div>
      <GridContainer>
        <Button
          style={{ width: "50px", height: "50px" }}
          color={contentStyle.button_bar}
          onClick={buttonChange("bar")}
        >
          Bar
        </Button>
        <Button
          style={{ width: "50px", height: "50px", marginLeft: "5px" }}
          color={contentStyle.button_line}
          onClick={buttonChange("line")}
        >
          Line
        </Button>

        <FormControl
          className={classes.formControl}
          style={{ marginLeft: "39%", marginTop: "auto" }}
        >
          <Select
            defaultValue={8}
            value={8}
            onChange={handleChange}
            className={classes.selectEmpty}
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value={0} disabled>
              필터
            </MenuItem>
            <MenuItem value={1}>1월</MenuItem>
            <MenuItem value={2}>2월</MenuItem>
            <MenuItem value={3}>3월</MenuItem>
            <MenuItem value={4}>4월</MenuItem>
            <MenuItem value={5}>5월</MenuItem>
            <MenuItem value={6}>6월</MenuItem>
            <MenuItem value={7}>7월</MenuItem>
            <MenuItem value={8}>8월</MenuItem>
            <MenuItem value={9}>9월</MenuItem>
            <MenuItem value={10}>10월</MenuItem>
            <MenuItem value={11}>11월</MenuItem>
            <MenuItem value={12}>12월</MenuItem>
          </Select>
          <FormHelperText>온도를 표시할 기간(월)을 선택하세요</FormHelperText>
        </FormControl>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card chart>
            <CardHeader color="primary">
              <CardIcon style={{ textAlign: "center" }}>
                <h3 style={{ color: "white" }}>
                  {" "}
                  {user.user_name} 학생 {selectMonth.month}월 온도 추이
                </h3>
              </CardIcon>
            </CardHeader>
            <span>
              <br />
            </span>
            <CardBody>
              {contentStyle.chartType === "bar" ? (
                <Bar
                  data={temperData.datas}
                  options={temperatureChart.options}
                />
              ) : (
                <Line
                  data={temperData.datas}
                  options={temperatureLineChart.options}
                />
              )}
            </CardBody>
            <CardFooter>
              <span style={{ marginLeft: "auto" }}>
                차트에 마우스 커서를 올리면 온도 정보를 알 수 있습니다
              </span>
            </CardFooter>
          </Card>
        </GridItem>
        <b>
          <CardHeader
            color="warning"
            style={{
              backgroundColor: "white",
              marginTop: "10px",
              marginLeft: "50px",
              width: "300px",
              height: "67px",
            }}
          >
            <h3 style={{ textAlign: "center" }}>위험 온도</h3>
          </CardHeader>
          <CardBody style={{ marginLeft: "32px" }}>
            {temperData.temDangerList === ""
              ? null
              : temperData.temDangerList.split("\n").map((line, i) => {
                  return i ===
                    temperData.temDangerList.split("\n").length - 1 ? null : (
                    <span style={{ fontWeight: "normal" }}>
                      {line}
                      <br />
                    </span>
                  );
                })}
            {temperData.temDangerList === "" ? (
              <span>위험 온도 없음 !</span>
            ) : (
              <span>
                <br />
                위험 온도 등록 완료 !
              </span>
            )}
          </CardBody>
        </b>
      </GridContainer>
    </div>
  );
}
