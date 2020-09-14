import React, { useState, useContext, useEffect } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

import PersonIcon from "@material-ui/icons/Person";
import ViewListIcon from "@material-ui/icons/ViewList";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import Alarm from "@material-ui/icons/Alarm";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ArrowDownward from "@material-ui/icons/ArrowDownward";

import AccountTree from "@material-ui/icons/AccountTree";

import CancelIcon from "@material-ui/icons/Cancel";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

import { BarChart, ShowChart } from "@material-ui/icons";

import Button from "components/CustomButtons/Button.js";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";

import CustomTabs from "components/CustomTabs/CustomTabs.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import moment from "moment";
import { CommonContext } from "../../context/CommonContext";
import { useHistory } from "react-router-dom";
import MaterialTable from "material-table";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Axios from "axios";

import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { weeklyChart, MonthlyChart } from "variables/charts.js";

import PieChart, {
  Series,
  Legend,
  Label,
  Connector,
  Size,
  Font,
} from "devextreme-react/pie-chart";

import Chart, {
  SeriesTemplate,
  Title,
  Subtitle,
  CommonSeriesSettings,
  Export,
} from "devextreme-react/chart";

import {
  list_attendance,
  tardy_absent_tableColum,
} from "../../variables/data.js";
import CenterTemplate from "../../variables/CenterTemplate.js";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

const ArrowPoint = (props) => {
  const { point } = props;
  const classes = useStyles();

  return (
    <span className={point >= 0 ? classes.successText : classes.dangerText}>
      {point >= 0 ? (
        <ArrowUpward className={classes.upArrowCardCategory} />
      ) : (
        <ArrowDownward className={classes.upArrowCardCategory} />
      )}
      {point}%
    </span>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {/* <Typography>{children}</Typography> */}
          {children}
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
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

export default function Dashboard() {
  let history = useHistory();
  const classes = useStyles();
  const { user } = useContext(CommonContext);

  if (user.user_state === "Logout") {
    history.push("/profile/Login");
  }

  var now = new Date();

  const [compareData, setCompareData] = useState({
    absent: [],
    tardy: [],
  });

  const [tmp, setTmp] = useState(-1);
  const [tableData, settableData] = useState(list_attendance[0]);
  const [value, setValue] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [stagevalue, setStagevalue] = useState(3);
  const [todayCnt, setTodayCnt] = useState();
  const [todayAtt, setTodayAtt] = useState();
  const [warnCnt, setWarnCnt] = useState();
  const [banCnt, setBanCnt] = useState();

  const [warnBanCnt, setWarnBanCnt] = useState({
    warn: [],
    ban: [],
  });

  const [incDayPoint, setIncDayPoint] = useState();
  const [incMonPoint, setIncMonPoint] = useState();
  const [weekGroupTardy, setWeekGroupTardy] = useState([
    { attendance: "지각", class: "전원", total: 0 },
  ]);
  const [weekGroupAbsent, setWeekGroupAbsent] = useState([
    { attendance: "결석", class: "전원", total: 0 },
  ]);
  const [monthGroupTardy, setMonthGroupTardy] = useState([
    { attendance: "지각", class: "전원", total: 0 },
  ]);
  const [monthGroupAbsent, setMonthGroupAbsent] = useState([
    { attendance: "결석", class: "전원", total: 0 },
  ]);

  const [selectchart, setselectchart] = useState({
    color_week: "danger",
    color_month: "white",
    data: "week",
    name: "주간 출석 현황",
    chart: "Line",
    color_line_btn: "rose",
    color_bar_btn: "white",
  });

  const [filterValue, setfilterValue] = useState({
    startDate: moment(new Date(now.getFullYear(), now.getMonth(), 1)).format(
      "YYYY-MM-DD"
    ),
    endDate: moment(now).format("YYYY-MM-DD"),
    stage: 0,
    area: "",
    group: 0,
    isall: true,
  });

  const [searchResultbygroup, setSearchResultbygroup] = useState({
    data1: [["", "", "", ""]],
    data2: [["", "", "", ""]],
    data3: [["", "", "", ""]],
    data4: [["", "", "", ""]],
    data5: [["", "", "", ""]],
    data6: [["", "", "", ""]],
  });

  const customizeLabel = (e) => {
    return `${e.argumentText}\n${e.valueText}명`;
  };

  const OnclickWeekMonthHandler = (name) => (e) => {
    if (name === "week") {
      setselectchart({
        ...selectchart,
        color_week: "danger",
        color_month: "white",
        data: "week",
        name: "주간 출석 현황",
      });
    } else if (name === "month") {
      setselectchart({
        ...selectchart,
        color_week: "white",
        color_month: "danger",
        data: "month",
        name: "월간 출석 현황",
      });
    }
  };

  const handleClickselectchart = (name) => () => {
    if (name === "Bar") {
      setselectchart({
        ...selectchart,
        chart: "Bar",
        color_line_btn: "white",
        color_bar_btn: "rose",
      });
    } else if (name === "Line") {
      setselectchart({
        ...selectchart,
        chart: "Line",
        color_line_btn: "rose",
        color_bar_btn: "white",
      });
    }
  };

  const handleDateChange = (type) => (date) => {
    if (type === "start") {
      date = moment(date).format("YYYY-MM-DD");
      setfilterValue({
        ...filterValue,
        startDate: date,
      });
    } else {
      date = moment(date).format("YYYY-MM-DD");
      setfilterValue({
        ...filterValue,
        endDate: date,
      });
    }
  };

  const onChangeTextField = (name) => (e, v) => {
    if (name === "stage") {
      setfilterValue({
        ...filterValue,
        stage: parseInt(v.slice(0, -1)),
      });
    } else if (name === "area") {
      setfilterValue({
        ...filterValue,
        area: v,
      });
    } else if (name === "group") {
      setfilterValue({
        ...filterValue,
        group: parseInt(v.slice(0, -1)),
      });
    }
  };

  const customizeSeries = (valueFromNameField) => () => {
    return valueFromNameField === 2009
      ? { type: "line", label: { visible: true }, color: "#ff3f7a" }
      : {};
  };

  let getAttendanceInfo = async (e) => {
    let body = {
      monday: moment().day(1).format("YYYY-MM-DD"),
      friday: moment().day(5).format("YYYY-MM-DD"),
      first_day: moment().dayOfYear(1).format("YYYY-MM-DD"),
      today: moment().format("YYYY-MM-DD"),
    };

    const request = Axios.post("/api/attendance/adminInfo", body).then(
      (response) => {
        let new_incDayPoint = 0,
          new_incMonPoint = 0,
          new_weekGroupTardy = [],
          new_monthGroupTardy = [],
          new_weekGroupAbsent = [],
          new_monthGroupAbsent = [];

        let weekly_length = response.data.weekly_info.length;
        let monthly_length = response.data.monthly_info.length;
        for (let i = 0; i < weekly_length; i++)
          weeklyChart.data.series[0][i] = response.data.weekly_info[i].present;
        if (weekly_length > 1) {
          new_incDayPoint =
            (100 *
              (response.data.weekly_info[weekly_length - 1].present -
                response.data.weekly_info[weekly_length - 2].present)) /
            response.data.weekly_info[weekly_length - 2].present;
          new_incDayPoint = parseInt(new_incDayPoint);
        }
        for (let i = 0; i < monthly_length; i++)
          MonthlyChart.data.series[0][
            response.data.monthly_info[i].now_month - 1
          ] = response.data.monthly_info[i].present;
        if (monthly_length > 1) {
          new_incMonPoint =
            (100 *
              (response.data.monthly_info[monthly_length - 1].present -
                response.data.monthly_info[monthly_length - 2].present)) /
            response.data.monthly_info[monthly_length - 2].present;
          new_incMonPoint = parseInt(new_incMonPoint);
        }
        let temp = {};
        for (let i = 0; i < response.data.weekly_group_info.length; i++) {
          if (response.data.weekly_group_info[i].late != 0) {
            temp = {
              attendance: "지각",
              class: response.data.weekly_group_info[i].groups,
              total: response.data.weekly_group_info[i].late,
            };
            new_weekGroupTardy.push(temp);
          }
        }
        for (let i = 0; i < response.data.weekly_group_info.length; i++) {
          if (response.data.weekly_group_info[i].absent != 0) {
            temp = {
              attendance: "결석",
              class: response.data.weekly_group_info[i].groups,
              total: response.data.weekly_group_info[i].absent,
            };
            new_weekGroupAbsent.push(temp);
          }
        }
        for (let i = 0; i < response.data.monthly_group_info.length; i++) {
          if (response.data.monthly_group_info[i].late != 0) {
            temp = {
              attendance: "지각",
              class: response.data.monthly_group_info[i].groups,
              total: response.data.monthly_group_info[i].late,
            };
            new_monthGroupTardy.push(temp);
          }
        }
        for (let i = 0; i < response.data.monthly_group_info.length; i++) {
          if (response.data.monthly_group_info[i].absent != 0) {
            temp = {
              attendance: "결석",
              class: response.data.monthly_group_info[i].groups,
              total: response.data.monthly_group_info[i].absent,
            };
            new_monthGroupAbsent.push(temp);
          }
        }
        if (new_weekGroupTardy.length < 1)
          new_weekGroupTardy = [
            { attendance: "지각", class: "전원", total: 0 },
          ];
        if (new_weekGroupAbsent.length < 1)
          new_weekGroupAbsent = [
            { attendance: "결석", class: "전원", total: 0 },
          ];
        if (new_monthGroupTardy.length < 1)
          new_monthGroupTardy = [
            { attendance: "지각", class: "전원", total: 0 },
          ];
        if (new_monthGroupAbsent.length < 1)
          new_monthGroupAbsent = [
            { attendance: "결석", class: "전원", total: 0 },
          ];

        // weekGroupTardy = new_weekGroupTardy;

        var warn1 = [];
        var ban1 = [];

        response.data.warn_info.map((v, i) => {
          if (v.user_absent >= 2) {
            if (v.user_absent <= 3) {
              warn1.push({
                name: v.user_name,
                stage: v.user_stage + "기",
                city: v.user_city,
                group: v.user_group + "반",
                address: v.user_home,
                email: v.user_email,
                phone: v.user_phone,
                attendance: "",
                record1: "",
                record2: v.user_absent,
              });
            } else {
              ban1.push({
                name: v.user_name,
                stage: v.user_stage + "기",
                city: v.user_city,
                group: v.user_group + "반",
                address: v.user_home,
                email: v.user_email,
                phone: v.user_phone,
                attendance: "",
                record1: "",
                record2: v.user_absent,
              });
            }
          }
        });

        setWarnBanCnt({ ...warnBanCnt, warn: warn1, ban: ban1 });

        setTodayAtt(response.data.today_info.attendance);
        setTodayCnt(response.data.today_info.st_cnt);
        //setWarnCnt(response.data.warn_info.warn);
        //setBanCnt(response.data.warn_info.ban);
        setIncDayPoint(new_incDayPoint);
        setIncMonPoint(new_incMonPoint);
        setWeekGroupTardy(new_weekGroupTardy);
        setWeekGroupAbsent(new_weekGroupAbsent);
        setMonthGroupTardy(new_monthGroupTardy);
        setMonthGroupAbsent(new_monthGroupAbsent);
        // setData(new_comments ? new_comments : []);
        // setDataCount(new_total_count ? new_total_count : 0);
      }
    );
  };

  const handleChange = (event, newValue) => {
    setfilterValue({
      ...filterValue,
      stage: "",
      area: "",
      group: newValue === 1 ? 3 : 0,
      isall: newValue === 1 ? false : true,
    });
    setValue(newValue);
  };

  const onTabChangeHandler = (e, v) => {
    setTabIndex(v);
  };

  const onChangeStage = (e) => {
    searchUser(1, e.target.value, 0);
    setStagevalue(e.target.value);
  };

  const searchUser = (tab, stage, flag) => {
    //if (tab === tmp && flag) return;
    let body;

    if (tab === 1) {
      body = {
        sql: `SELECT tb_user.* FROM tb_user WHERE tb_user.user_stage=${stage} AND tb_user.user_group>=1 AND tb_user.user_group<=6 
        AND tb_user.user_no NOT IN (SELECT tb_attendance.user_no FROM tb_attendance WHERE tb_attendance.now_year=${now.getFullYear()} and tb_attendance.now_month=${
          now.getMonth() + 1
        } and tb_attendance.now_day=${now.getDate()})`,

        sql1: `SELECT tb_attendance.user_no, tb_attendance.user_in, tb_user.user_group, tb_user.user_name, tb_user.user_phone FROM tb_attendance JOIN tb_user ON tb_attendance.user_no = tb_user.user_no 
        WHERE tb_attendance.now_year=${now.getFullYear()} AND tb_attendance.now_month=${
          now.getMonth() + 1
        } AND tb_attendance.now_day=${now.getDate()} AND tb_attendance.user_in != "입실" AND tb_user.user_stage=${stage};
        `,
      };
    } else if (tab === 2) {
      var enddate = moment(now).format("YYYY-MM-DD");
      var startdate = moment(
        new Date(now.getFullYear(), now.getMonth() - 2, 1)
      ).format("YYYY-MM-DD");

      body = {
        sql: `SELECT a.user_in, a.user_in_time, u.user_city 
        FROM tb_attendance a JOIN tb_user u ON a.user_no = u.user_no 
        WHERE STR_TO_DATE(CONCAT(a.now_year,'-',CONCAT(a.now_month,'-',a.now_day)), '%Y-%m-%d') >= '${startdate}' 
        AND STR_TO_DATE(CONCAT(a.now_year,'-',CONCAT(a.now_month,'-',a.now_day)), '%Y-%m-%d') <= '${enddate}'
        AND (a.user_in="임의결석" OR a.user_in="임의지각" OR a.user_in="사유지각") AND (u.user_city='서울' OR u.user_city='광주' OR u.user_city='대전' OR u.user_city='구미')`,
      };
    } else if (tab === 3) {
      if (filterValue.group > 0 && filterValue.group <= 20) {
        filterValue.group = `tb_user.user_group=${filterValue.group}`;
      } else {
        filterValue.group = "true";
      }
      if (filterValue.stage > 0 && filterValue.stage <= 20) {
        filterValue.stage = `tb_user.user_stage=${filterValue.stage}`;
      } else {
        filterValue.stage = "true";
      }
      if (
        filterValue.area === "서울" ||
        filterValue.area === "대전" ||
        filterValue.area === "광주" ||
        filterValue.area === "구미"
      ) {
        filterValue.area = `tb_user.user_city='${filterValue.area}'`;
      } else {
        filterValue.area = "true";
      }

      body = {
        sql: `SELECT tb_attendance.user_in, tb_attendance.user_out, tb_user.* 
        FROM tb_attendance JOIN tb_user ON tb_attendance.user_no = tb_user.user_no 
        WHERE STR_TO_DATE(CONCAT(tb_attendance.now_year,'-',CONCAT(tb_attendance.now_month,'-',tb_attendance.now_day)), '%Y-%m-%d') >= '${filterValue.startDate}' AND STR_TO_DATE(CONCAT(tb_attendance.now_year,'-',CONCAT(tb_attendance.now_month,'-',tb_attendance.now_day)), '%Y-%m-%d') <= '${filterValue.endDate}' AND ${filterValue.stage} AND ${filterValue.area} AND ${filterValue.group};`,
      };
    }

    Axios.post("/api/attendance/usersearch", body).then((response) => {
      if (response.data.success === false) {
        console.log("load ERR - searchUser");
        return;
      }

      if (tab === 1) {
        var userbygroup = [[], [], [], [], [], [], []];
        response.data.data.map((v, i) => {
          userbygroup[v.user_group].push([
            [v.user_name],
            [v.user_phone],
            [""],
            ["미출석"],
          ]);
        });

        response.data.data2.map((v, i) => {
          userbygroup[v.user_group].push([
            [v.user_name],
            [v.user_phone],
            [v.user_in],
            [""],
          ]);
        });

        setSearchResultbygroup({
          data1: userbygroup[1],
          data2: userbygroup[2],
          data3: userbygroup[3],
          data4: userbygroup[4],
          data5: userbygroup[5],
          data6: userbygroup[6],
        });
      }

      if (tab === 2) {
        var now_month = now.getMonth() + 1;

        var absent = {
          서울: 0,
          구미: 0,
          대전: 0,
          광주: 0,
        };
        var tardy = {
          서울: [0, 0, 0],
          구미: [0, 0, 0],
          대전: [0, 0, 0],
          광주: [0, 0, 0],
        };

        response.data.data.map((v, i) => {
          if (v.user_in === "임의결석") {
            absent[v.user_city]++;
          } else {
            var tmp_month = new Date(v.user_in_time).getMonth() + 1;
            tardy[v.user_city][now_month - tmp_month]++;
          }
        });

        var list = ["서울", "구미", "대전", "광주"];
        var arr_absent = [];
        var arr_tardy = [];

        for (var a of list) {
          arr_absent.push({
            area: a,
            total: absent[a],
          });

          for (var v = 0; v < 3; v++) {
            arr_tardy.push({
              area: a,
              month: String(now_month - v) + "월",
              total: tardy[a][v],
            });
          }
        }

        setCompareData({
          absent: arr_absent,
          tardy: arr_tardy,
        });
      }

      if (tab === 3) {
        var arr = {};
        var m = [];

        response.data.data.map((v, i) => {
          if (arr[v.user_no] === undefined) {
            m.push(v.user_no);

            arr[v.user_no] = {
              name: v.user_name,
              stage: v.user_stage + "기",
              city: v.user_city,
              group: v.user_group + "반",
              address: v.user_home,
              email: v.user_email,
              phone: v.user_phone,
              attendance: v.user_in === "입실" ? 1 : 0,
              record1:
                v.user_in === "임의지각" || v.user_in === "사유지각" ? 1 : 0,
              record2: v.user_in === "임의결석" ? 1 : 0,
            };
          } else {
            if (v.user_in === "입실") arr[v.user_no].attendance++;
            else if (v.user_in === "임의지각" || v.user_in === "사유지각")
              arr[v.user_no].record1++;
            else if (v.user_in === "임의결석") arr[v.user_no].record2++;
          }
        });

        var res = [];
        for (var a of m) {
          res.push(arr[a]);
        }

        settableData({
          ...tableData,
          data: res,
        });
      }
    });
  };

  const OnclickfilterHandler = () => {
    searchUser(3);
  };

  const onClickCardHandler = (name) => (e) => {
    setValue(3);
    if (name === "ban") {
      settableData({
        ...tableData,
        data: warnBanCnt.ban,
      });
    } else {
      settableData({
        ...tableData,
        data: warnBanCnt.warn,
      });
    }
  };

  useEffect(() => {
    console.log("Effect");
    if (value === 0) {
      getAttendanceInfo();
    } else if (value === 1) {
      searchUser(1, stagevalue, 1);
    } else if (value === 2) {
      searchUser(2, stagevalue, 1);
    } else if (value === 3) {
    }
    //setTmp(value);
    return () => {};
  }, [value]);

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          <Tab label="데쉬보드" icon={<AccountTree />} {...a11yProps(0)} />
          <Tab label="지각목록" icon={<Alarm />} {...a11yProps(1)} />
          <Tab
            label="비교 데이터"
            icon={<CompareArrowsIcon />}
            {...a11yProps(2)}
          />
          <Tab
            label="교육생 리스트"
            icon={<ViewListIcon />}
            {...a11yProps(3)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <PersonIcon />
                </CardIcon>
                <p className={classes.cardCategory}>출석 인원</p>
                <h3 className={classes.cardTitle}>
                  {todayAtt}/{todayCnt} <small>명</small>
                </h3>
              </CardHeader>
              <CardBody></CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={3}>
            <Card
              onClick={onClickCardHandler("warn")}
              style={{
                cursor: "pointer",
              }}
            >
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <ErrorOutlineIcon />
                </CardIcon>
                <p className={classes.cardCategory}>경고 주의</p>
                <h3 className={classes.cardTitle}>
                  {warnBanCnt.warn.length} <small>명</small>
                </h3>
              </CardHeader>
              <CardBody></CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card
              onClick={onClickCardHandler("ban")}
              style={{
                cursor: "pointer",
              }}
            >
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <CancelIcon />
                </CardIcon>
                <p className={classes.cardCategory}>퇴소 확정</p>
                <h3 className={classes.cardTitle}>
                  {warnBanCnt.ban.length}
                  <small>명</small>
                </h3>
              </CardHeader>
              <CardBody></CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <div style={{ float: "left" }}>
              <h3 className={classes.cardTitle}>{selectchart.name}</h3>
            </div>
            <div style={{ float: "right" }}>
              <Button
                variant="contained"
                color={selectchart.color_week}
                onClick={OnclickWeekMonthHandler("week")}
              >
                Week
              </Button>
              <Button
                variant="contained"
                color={selectchart.color_month}
                onClick={OnclickWeekMonthHandler("month")}
              >
                Month
              </Button>
              <Button
                color={selectchart.color_line_btn}
                justIcon={window.innerWidth > 959}
                simple={!(window.innerWidth > 959)}
                aria-haspopup="true"
                onClick={handleClickselectchart("Line")}
                className={classes.buttonLink}
              >
                <ShowChart className={classes.icons} />
              </Button>
              <Button
                color={selectchart.color_bar_btn}
                justIcon={window.innerWidth > 959}
                simple={!(window.innerWidth > 959)}
                aria-haspopup="true"
                onClick={handleClickselectchart("Bar")}
                className={classes.buttonLink}
              >
                <BarChart className={classes.icons} />
              </Button>
            </div>
            <br></br>
            <br></br>
            <div>
              <Card chart>
                <CardHeader color="success">
                  <div>
                    {selectchart.chart === "Line" ? (
                      <ChartistGraph
                        className="ct-chart"
                        data={
                          selectchart.data === "week"
                            ? weeklyChart.data
                            : MonthlyChart.data
                        }
                        type="Line"
                        options={
                          selectchart.data === "week"
                            ? weeklyChart.options
                            : MonthlyChart.options
                        }
                        listener={
                          selectchart.data === "week"
                            ? weeklyChart.animation
                            : MonthlyChart.animation
                        }
                      />
                    ) : null}
                  </div>
                  <div>
                    {selectchart.chart === "Bar" ? (
                      <ChartistGraph
                        className="ct-chart"
                        data={
                          selectchart.data === "week"
                            ? weeklyChart.data
                            : MonthlyChart.data
                        }
                        type="Bar"
                        options={
                          selectchart.data === "week"
                            ? weeklyChart.options
                            : MonthlyChart.options
                        }
                        listener={
                          selectchart.data === "week"
                            ? weeklyChart.animation
                            : MonthlyChart.animation
                        }
                      />
                    ) : null}
                  </div>
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>
                    {moment().month() + 1}월{" "}
                    {selectchart.data === "week"
                      ? moment().week() -
                        moment().startOf("month").week() +
                        1 +
                        "주차"
                      : ""}
                  </h4>
                  <p className={classes.cardCategory}>
                    <ArrowPoint
                      point={
                        selectchart.data === "week" ? incDayPoint : incMonPoint
                      }
                    ></ArrowPoint>{" "}
                    increase in{" "}
                    {selectchart.data === "week" ? "today" : "this month"}{" "}
                    point.
                  </p>
                </CardBody>
                <CardFooter chart>
                  <div className={classes.stats}></div>
                </CardFooter>
              </Card>
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <PieChart
              id="pie"
              //key={tardy}
              dataSource={
                selectchart.data === "week" ? weekGroupTardy : monthGroupTardy
              }
              resolveLabelOverlapping="shift"
              sizeGroup="piesGroup"
              innerRadius={0.65}
              centerRender={CenterTemplate}
              type="doughnut"
              height={"35%"}
            >
              <Size height={250} width={300} />
              <Series argumentField="class" valueField="total">
                <Label
                  visible={true}
                  format="fixedPoint"
                  customizeText={customizeLabel}
                  backgroundColor="none"
                >
                  <Connector visible={true}></Connector>
                </Label>
              </Series>
              <Legend visible={false}></Legend>
            </PieChart>
            <PieChart
              id="pie"
              //key={absent}
              dataSource={
                selectchart.data === "week" ? weekGroupAbsent : monthGroupAbsent
              }
              resolveLabelOverlapping="shift"
              sizeGroup="piesGroup"
              innerRadius={0.65}
              centerRender={CenterTemplate}
              type="doughnut"
            >
              <Size height={220} width={300} />
              <Series argumentField="class" valueField="total">
                <Label
                  visible={true}
                  format="fixedPoint"
                  customizeText={customizeLabel}
                  backgroundColor="none"
                >
                  <Connector visible={true}></Connector>
                </Label>
              </Series>
              <Legend visible={false}></Legend>
            </PieChart>
          </GridItem>
        </GridContainer>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={10}>
            <Card>
              <CardHeader color="warning">
                <div style={{ float: "right" }}>
                  <Select
                    value={stagevalue}
                    onChange={onChangeStage}
                    displayEmpty
                    className={classes.selectEmpty}
                  >
                    <MenuItem value={1}>1기</MenuItem>
                    <MenuItem value={2}>2기</MenuItem>
                    <MenuItem value={3}>3기</MenuItem>
                    <MenuItem value={4}>4기</MenuItem>
                  </Select>
                </div>
                <h4 className={classes.cardTitleWhite}>지각 및 결석 조회</h4>
                <p className={classes.cardCategoryWhite}>
                  {`List of trainees, ${now.getDate()}. ${now.getMonth()}. ${now.getFullYear()}`}
                </p>

                <CustomTabs
                  headerColor="danger"
                  onChange={onTabChangeHandler}
                  value={tabIndex}
                  tabs={[
                    {
                      tabName: "1반",
                      //tabIcon: BugReport,
                      tabContent: (
                        <Table
                          tableHeaderColor="warning"
                          tableHead={tardy_absent_tableColum}
                          tableData={searchResultbygroup.data1}
                        />
                      ),
                    },
                    {
                      tabName: "2반",
                      //tabIcon: Code,
                      tabContent: (
                        <Table
                          tableHeaderColor="warning"
                          tableHead={tardy_absent_tableColum}
                          tableData={searchResultbygroup.data2}
                        />
                      ),
                    },
                    {
                      tabName: "3반",
                      // tabIcon: Cloud,
                      tabContent: (
                        <Table
                          tableHeaderColor="warning"
                          tableHead={tardy_absent_tableColum}
                          tableData={searchResultbygroup.data3}
                        />
                      ),
                    },
                    {
                      tabName: "4반",
                      // tabIcon: Cloud,
                      tabContent: (
                        <Table
                          tableHeaderColor="warning"
                          tableHead={tardy_absent_tableColum}
                          tableData={searchResultbygroup.data4}
                        />
                      ),
                    },
                    {
                      tabName: "5반",
                      // tabIcon: Cloud,
                      tabContent: (
                        <Table
                          tableHeaderColor="warning"
                          tableHead={tardy_absent_tableColum}
                          tableData={searchResultbygroup.data5}
                        />
                      ),
                    },
                    {
                      tabName: "6반",
                      // tabIcon: Cloud,
                      tabContent: (
                        <Table
                          tableHeaderColor="warning"
                          tableHead={tardy_absent_tableColum}
                          tableData={searchResultbygroup.data6}
                        />
                      ),
                    },
                  ]}
                />
              </CardHeader>
            </Card>
          </GridItem>
        </GridContainer>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={3}>
            <PieChart
              id="pie"
              dataSource={compareData.absent}
              // resolveLabelOverlapping="shift"
              // sizeGroup="piesGroup"
              palette="Bright"
              title="지역별 결석 현황"
            >
              <Series argumentField="area" valueField="total">
                <Label
                  visible={true}
                  format="fixedPoint"
                  customizeText={customizeLabel}
                  backgroundColor="none"
                >
                  <Font size={16} />
                  <Connector visible={true}></Connector>
                </Label>
              </Series>{" "}
              <Legend visible={false}></Legend>
            </PieChart>
          </GridItem>
          <GridItem xs={12} sm={12} md={7}>
            <Chart id="chart" palette="Violet" dataSource={compareData.tardy}>
              <SeriesTemplate
                nameField="area"
                customizeSeries={customizeSeries}
              />
              <CommonSeriesSettings
                argumentField="month"
                valueField="total"
                type="bar"
              />
              <Title text="지역별 비교 데이터">
                <Subtitle text="(지각 차트)" />
              </Title>
              <Legend verticalAlignment="bottom" horizontalAlignment="center" />
              <Export enabled={true} />
            </Chart>
          </GridItem>
        </GridContainer>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around">
                <KeyboardDatePicker
                  disableFuture
                  autoOk
                  disableToolbar
                  maxDate={filterValue.endDate}
                  variant="inline"
                  format="yyyy-MM-dd"
                  margin="normal"
                  id="startdate"
                  label="start date"
                  value={filterValue.startDate}
                  onChange={handleDateChange("start")}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </GridItem>
          <GridItem xs={12} sm={12} md={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around">
                <KeyboardDatePicker
                  disableFuture
                  autoOk
                  disableToolbar
                  variant="inline"
                  format="yyyy-MM-dd"
                  margin="normal"
                  id="enddate"
                  label="end date"
                  value={filterValue.endDate}
                  onChange={handleDateChange("end")}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </GridItem>
          <GridItem xs={12} sm={12} md={2}>
            <Autocomplete
              options={[
                { value: "1기" },
                { value: "2기" },
                { value: "3기" },
                { value: "4기" },
              ]}
              getOptionLabel={(option) => option.value}
              id="auto-complete1"
              autoComplete
              includeInputInList
              onInputChange={onChangeTextField("stage")}
              renderInput={(params) => (
                <TextField {...params} label="기수" margin="normal" />
              )}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={2}>
            <Autocomplete
              options={[
                { value: "서울" },
                { value: "대전" },
                { value: "광주" },
                { value: "구미" },
              ]}
              getOptionLabel={(option) => option.value}
              id="auto-complete"
              autoComplete
              includeInputInList
              onInputChange={onChangeTextField("area")}
              renderInput={(params) => (
                <TextField {...params} label="지역" margin="normal" />
              )}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={2}>
            <Autocomplete
              options={[
                { value: "1반" },
                { value: "2반" },
                { value: "3반" },
                { value: "4반" },
                { value: "5반" },
                { value: "6반" },
                { value: "7반" },
                { value: "8반" },
                { value: "9반" },
                { value: "10반" },
                { value: "11반" },
                { value: "12반" },
                { value: "13반" },
                { value: "14반" },
                { value: "15반" },
                { value: "16반" },
                { value: "17반" },
                { value: "18반" },
                { value: "19반" },
                { value: "20반" },
              ]}
              getOptionLabel={(option) => option.value}
              id="auto-complete"
              autoComplete
              includeInputInList
              onInputChange={onChangeTextField("group")}
              renderInput={(params) => (
                <TextField {...params} label="반" margin="normal" />
              )}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={2}>
            <Button
              variant="contained"
              color={"danger"}
              onClick={OnclickfilterHandler}
            >
              filter
            </Button>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <MaterialTable
              title="Data list related to attendance"
              columns={tableData.columns}
              data={tableData.data}
              // editable={{
              //   onRowUpdate: (newData, oldData) => {
              //     new Promise((resolve) => {
              //       setTimeout(() => {
              //         resolve();
              //         settableData({ ...tableData });
              //       }, 1000);
              //     });
              //   },
              // }}
              options={{
                sorting: true,
                showTitle: false,
              }}
            />
          </GridItem>
        </GridContainer>
      </TabPanel>
    </div>
  );
}
