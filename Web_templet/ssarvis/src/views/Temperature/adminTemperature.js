import React, { useState, useContext, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ChartistGraph from "react-chartist";
import AccessTime from "@material-ui/icons/AccessTime";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import MaterialTable from "material-table";

//tab icon
import SearchIcon from "@material-ui/icons/Search";
import AssignmentLateIcon from "@material-ui/icons/AssignmentLate";
import ChromeReaderModeIcon from "@material-ui/icons/ChromeReaderMode";

import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { CommonContext } from "../../context/CommonContext";
import { Export } from "devextreme-react/chart";

// for Tab
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

// Filter on Tab
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

// Table in Tab
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import {
  tardy,
  absent,
  compareData,
  list_temperature,
  tardy_absent_tableColum,
} from "../../variables/data.js";

import { personCountChart } from "variables/charts.js";
import { Grid } from "@material-ui/core";
import { Line, Bar } from "react-chartjs-2";
import Axios from "axios";

import "assets/css/checkButton.css";
//import data from "views/Notifications/data";

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

const useStyles = makeStyles(styles);

function createData(name, country, class_no, team_no, generation, temperature) {
  return { name, country, class_no, team_no, generation, temperature };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

var today = new Date();
var year = today.getFullYear();
var month = today.getMonth() + 1;
var day = today.getDate();

var body = {
  year: year,
  month: month,
  day: day,
};

// 위험 온도 대상 getList
var personLabel = [];
var personData = [];

Axios.post("/api/attendance/danger", body).then((response) => {
  if (response.data.success) {
    for (let i = 0; i < response.data.data.length;  i++) {
      if (response.data.data[i].user_city === undefined) break;
      personLabel.push(response.data.data[i].user_city);
      personData.push(response.data.data[i].count);
    }
  }
});

//관리 대상 getList
var dangerList = [{}];
//user_name,user_city,user_stage,user_group,ROUND( (user_c1 + user_c2)/2, 1 ) AS avgTem, \
//             user_danger
Axios.post("/api/attendance/getdanger", body).then((response) => {
  if (response.data.success) {
    for (let i = 0; i < response.data.data.length; i++) {
      dangerList.push(response.data.data[i]);
    }
  }
});

export default function Temperature() {
  let history = useHistory();
  const classes = useStyles();
  const { user } = useContext(CommonContext);

  const [tableData, settableData] = useState(list_temperature[0]);

  const [value, setValue] = React.useState(0);

  // 그래프 관련 변수
  const [graphType, setGraphType] = useState(0);

  const [datas, setDatas] = useState({
    labels: personLabel,
    datasets: [
      {
        data: personData,
        backgroundColor: ["#FCB9A9", "#FFDBCB", "#EEE9E6", "#A3E1DC"],
        fill: false,
        pointRadius: 8,
        borderColor: "#888",
        tension: 0,
      },
    ],
  });

  const [chartData, setChartData] = useState({
    options: {
      title: {
        display: "true",
        padding: 20,
        text: "지역별 위험 온도 교육생 현황",
        fontSize: 23,
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              padding: 5,
              fontSize: 15,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "#000",
              lineWidth: 0.3,
              lineColor: "#FFF",
            },
            ticks: {
              beginAtZero: true,
              fontWeight: "bold",
              stepSize: 1,
              padding: 10,
              fontSize: 10,
            },
          },
        ],
      },
    },
  });

  const changeData = (type) => {
    if (type == 0) {
      setChartData({
        options: {
          title: {
            display: "true",
            padding: 20,
            text: "지역별 위험 온도 교육생 현황",
            fontSize: 23,
          },
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false,
                },
                ticks: {
                  padding: 5,
                  fontSize: 15,
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  drawBorder: false,
                  color: "#000",
                  lineWidth: 0.3,
                  lineColor: "#FFF",
                },
                ticks: {
                  beginAtZero: true,
                  fontWeight: "bold",
                  stepSize: 1,
                  padding: 10,
                  fontSize: 10,
                },
              },
            ],
          },
        },
      });

      Axios.post("/api/attendance/danger", body).then((response) => {
        if (response.data.success) {
          personLabel = [];
          personData = [];

          for (let i = 0; i < response.data.data.length; i++) {
            personLabel.push(response.data.data[i].user_city);
            personData.push(response.data.data[i].count);
          }

          setDatas({
            labels: personLabel,
            datasets: [
              {
                data: personData,
                backgroundColor: ["#FCB9A9", "#FFDBCB", "#EEE9E6", "#A3E1DC"],
                fill: false,
                pointRadius: 8,
                borderColor: "#888",
                tension: 0,
              },
            ],
          });
        }
      });
    } else if (type == 1) {
      setChartData({
        options: {
          title: {
            display: "true",
            padding: 20,
            text: "기수별 위험 온도 교육생 현황",
            fontSize: 23,
          },
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false,
                },
                ticks: {
                  padding: 5,
                  fontSize: 15,
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  drawBorder: false,
                  color: "#000",
                  lineWidth: 0.3,
                  lineColor: "#FFF",
                },
                ticks: {
                  beginAtZero: true,
                  fontWeight: "bold",
                  stepSize: 1,
                  padding: 10,
                  fontSize: 10,
                },
              },
            ],
          },
        },
      });

      Axios.post("/api/attendance/dangerstage", body).then((response) => {
        if (response.data.success) {
          personLabel = [];
          personData = [];

          for (let i = 0; i < response.data.data.length; i++) {
            personLabel.push(
              response.data.data[i].user_stage.toString() + "기"
            );
            personData.push(response.data.data[i].count);
          }

          setDatas({
            labels: personLabel,
            datasets: [
              {
                data: personData,
                backgroundColor: ["#EEE9E6", "#A3E1DC"],
                fill: false,
                pointRadius: 8,
                borderColor: "#888",
                tension: 0,
              },
            ],
          });
        }
      });
    } else if (type == 2) {
      setChartData({
        options: {
          title: {
            display: "true",
            padding: 20,
            text: "반별 위험 온도 교육생 현황",
            fontSize: 23,
          },
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false,
                },
                ticks: {
                  padding: 5,
                  fontSize: 15,
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  drawBorder: false,
                  color: "#000",
                  lineWidth: 0.3,
                  lineColor: "#FFF",
                },
                ticks: {
                  beginAtZero: true,
                  fontWeight: "bold",
                  stepSize: 1,
                  padding: 10,
                  fontSize: 10,
                },
              },
            ],
          },
        },
      });

      Axios.post("/api/attendance/dangermuch", body).then((response) => {
        if (response.data.success) {
          personLabel = [];
          personData = [];

          for(let i=0 ; i<response.data.data.length ; i++)
          {
            personLabel.push( (i+1) + "반" );
            personData.push(response.data.data[i].count);
          }

          setDatas({
            labels: personLabel,
            datasets: [
              {
                data: personData,
                backgroundColor: ["#FCB9A9", "#FFDBCB"],
                fill: false,
                pointRadius: 8,
                borderColor: "#888",
                tension: 0,
              },
            ],
          });
        }
      });
    }
  };

  const onChangeType = (type) => () => {
    setGraphType(type);
    changeData(type);
  };

  //관리 대상 관련 변수

  const [dangerList, setDangerList] = useState([]);

  var down_user = { user_no: 0 };

  const changeDangerList = () => {
    console.log("changeDanger go ");

    Axios.post("/api/attendance/changedanger", body).then((response) => {
      if (response.data.success === false) {
        console.log("-- change user_danger failed");
        return;
      }
    });

    Axios.post("/api/attendance/getdanger", body).then((response) => {
      if (response.data.success) {
        var tempDangerList = [];
        for (let i = 0; i < response.data.data.length; i++) {
          tempDangerList.push(response.data.data[i]);
        }
        console.log(tempDangerList);
        setDangerList(tempDangerList);
      }
    });
  };

  // 검색 대상
  const getDangerList = () => {
    let searchBody = {
      sql:
        'SELECT tb_user.user_no, tb_user.user_name, tb_user.user_stage, tb_user.user_city, tb_user.user_group, ROUND( (user_c1 + user_c2)/2 ,1) as temperature, \
             CASE WHEN user_danger = 1 THEN "O" WHEN user_danger = 0 THEN "X" END AS danger FROM tb_user JOIN tb_attendance ON tb_user.user_no = tb_attendance.user_no \
             WHERE now_year = ' +
        body.year +
        " and now_month = " +
        body.month +
        " and now_day = " +
        body.day +
        " ORDER BY tb_user.user_no ASC;",
    };

    Axios.post("/api/attendance/usersearch", searchBody).then((response) => {
      if (response.data.success === false) {
        console.log("load ERR - searchUser");
        return;
      }

      settableData({
        ...tableData,
        data: response.data.data,
      });

      console.log(tableData.data);
    });
  };

  // onChange 관리 대상
  const onDelete = (user_no) => () => {
    console.log("delete go " + user_no);
    for (let i = 0; i < dangerList.length; i++) {
      if (dangerList[i].user_no === user_no) {
        if (dangerList[i].avgTem >= 37.5) {
          alert("금일 평균 온도 37.5°C 이상인 교육생은 삭제할 수 없습니다.");
          return;
        } else break;
      }
    }

    down_user.user_no = user_no;
    Axios.post("/api/attendance/setdanger", down_user).then((response) => {
      console.log(down_user);
      if (response.data.success === false) {
        console.log("Delete Fail");
        return;
      }
    });
    TabhandleChange(this, 1);
  };

  if (user.user_state === "Logout") {
    history.push("/profile/Login");
  }

  const TabhandleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1) changeDangerList();
    else if (newValue === 2) getDangerList();
  };

  return (
    <div className={classes.root}>
      <Card>
        <CardHeader xs={12} sm={12} md={1} style={{ justifyContent: "center" }}>
          <AppBar position="static" style={{ background: "#8e24aa" }}>
            <Tabs
              value={value}
              onChange={TabhandleChange}
              aria-label="simple tabs example"
            >
              <Tab
                label="위험 온도 교육생 현황"
                icon={<AssignmentLateIcon />}
                {...a11yProps(0)}
              />

              <Tab
                label="관리 대상 교육생 현황"
                icon={<ChromeReaderModeIcon />}
                {...a11yProps(1)}
              />
              <Tab
                style={{ marginLeft: "auto" }}
                label="검색"
                icon={<SearchIcon />}
                {...a11yProps(2)}
              />
            </Tabs>
          </AppBar>

          <TabPanel
            value={value}
            index={0}
            style={{ textAlign: "end", marginRight: "30%" }}
          >
            <div className={classes.root}>
              <ButtonGroup
                value={value}
                size="small"
                aria-label="small outlined button group"
                style={{ justifyContent: "center" }}
              >
                <Button
                  style={{ fontWeight: "bold" }}
                  onClick={onChangeType(0)}
                >
                  지역별
                </Button>
                <Button
                  style={{ fontWeight: "bold" }}
                  onClick={onChangeType(1)}
                >
                  기수별
                </Button>
                <Button
                  style={{ fontWeight: "bold" }}
                  onClick={onChangeType(2)}
                >
                  반별
                </Button>
              </ButtonGroup>
            </div>

            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={10}
                style={{ marginTop: "3%", marginLeft: "25%" }}
              >
                <Bar data={datas} options={chartData.options} />
              </GridItem>
            </GridContainer>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <h5 style={{ fontWeight: "bold" }}>관리 대상 교육생 현황</h5>

            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      번호
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      이름
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      지역
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      반
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      기수
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      평균 온도
                    </TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      관리 대상 삭제
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dangerList.map((row, i) => (
                    <TableRow key={row.user_no}>
                      <TableCell align="right">{i + 1}</TableCell>
                      <TableCell align="right">{row.user_name}</TableCell>
                      <TableCell align="right">{row.user_city}</TableCell>
                      <TableCell align="right">{row.user_group}</TableCell>
                      <TableCell align="right">{row.user_stage}</TableCell>
                      <TableCell
                        align="right"
                        style={{ color: "#B22", fontWeight: "bold" }}
                      >
                        {row.avgTem}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          style={{ backgroundColor: "#ffa726" }}
                          onClick={onDelete(row.user_no)}
                        >
                          X
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={value} index={2}>
            <MaterialTable
              title="Data list related to attendance"
              columns={tableData.columns}
              data={tableData.data}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      if (oldData) {
                        settableData((prevState) => {
                          const data = [...prevState.data];
                          data[data.indexOf(oldData)] = newData;
                          return { ...prevState, data };
                        });
                      }
                    }, 100);
                  }),
              }}
              options={{
                sorting: true,
                //actionsColumnIndex: -1,
                rowStyle: {
                  //backgroundColor: "#EEE",
                },
                showTitle: false,
              }}
            />
          </TabPanel>
        </CardHeader>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
