import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
// core components
import TextField from "@material-ui/core/TextField";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import ListCardHeader from "@material-ui/core/CardHeader";
import ListCard from "@material-ui/core/Card";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";

import MaterialTable from "material-table";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { list_user } from "../../variables/data.js";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Axios from "axios";
import moment from "moment";

import styles from "assets/jss/material-dashboard-react/views/iconsStyle.js";

const useStyles = makeStyles(styles);

export default function Icons() {
  const classes = useStyles();
  const [content, setContent] = useState();
  const [tableData, settableData] = useState(list_user[0]);
  const [filterValue, setfilterValue] = useState({
    stage: 0,
    area: "",
    group: 0,
    isall: true,
  });
  const [reserveTime, setReserveTime] = useState(
    moment().format("YYYY-MM-DDTHH:mm")
  );

  const OnChangeHandler = (name) => (e) => {
    setContent({ ...content, [name]: e.target.value });
  };

  const handleDateChange = (name) => (e) => {
    setReserveTime(e.target.value);
  };

  const OnclickHandler = () => {
    let body = {
      user_no: right.map((v) => v.no),
      content: content,
      reserveTime: moment(reserveTime, "YYYY-MM-DDTHH:mm").format(
        "YYYY-MM-DD HH:mm"
      ),
    };
    if (!isReserv) body.reserveTime = null;

    if (right.length == 0) {
      alert("선택된 학생이 없습니다.");
      return;
    }
    const request = Axios.post("/api/admin/sendsms", body).then((response) => {
      if (response.data.success === false) {
        alert("전송실패");
        return;
      }

      alert("전송완료");
    });
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

  const searchUser = (tab, stage, flag) => {
    let body;
    let queryFilterValue = {};

    if (tab === 3) {
      if (filterValue.group > 0 && filterValue.group <= 20) {
        queryFilterValue.group = `tb_user.user_group=${filterValue.group}`;
      } else {
        queryFilterValue.group = "true";
      }
      if (filterValue.stage > 0 && filterValue.stage <= 20) {
        queryFilterValue.stage = `tb_user.user_stage=${filterValue.stage}`;
      } else {
        queryFilterValue.stage = "true";
      }
      if (
        filterValue.area === "서울" ||
        filterValue.area === "대전" ||
        filterValue.area === "광주" ||
        filterValue.area === "구미"
      ) {
        queryFilterValue.area = `tb_user.user_city='${filterValue.area}'`;
      } else {
        queryFilterValue.area = "true";
      }

      body = {
        // sql: `SELECT tb_attendance.user_in, tb_attendance.user_out, tb_user.* FROM tb_attendance JOIN tb_user ON tb_attendance.user_no = tb_user.user_no WHERE (tb_attendance.user_in_time BETWEEN '${filterValue.startDate}' AND '${enddate}') AND ${filterValue.stage} AND ${filterValue.area} AND ${filterValue.group};`,
        sql: `SELECT tb_user.* FROM tb_user WHERE user_stage is not null AND user_admin is null AND ${queryFilterValue.stage} AND ${queryFilterValue.area} AND ${queryFilterValue.group};`,
      };
    }

    Axios.post("/api/attendance/usersearch", body).then((response) => {
      if (response.data.success === false) {
        console.log("load ERR - searchUser");
        return;
      }
      // console.log(response.data)
      if (tab === 3) {
        var arr = {};
        var m = [];

        response.data.data.map((v, i) => {
          if (arr[v.user_name] === undefined) {
            m.push(v.user_name);

            arr[v.user_name] = {
              name: v.user_name,
              stage: v.user_stage + "기",
              city: v.user_city,
              group: v.user_group + "반",
              address: v.user_home,
              email: v.user_email,
              phone: v.user_phone,
              no: v.user_no,
            };
          } else {
            if (v.user_in === "입실") arr[v.user_name].attendance++;
            else if (v.user_in === "임의지각" || v.user_in === "사유지각")
              arr[v.user_name].record1++;
            else if (v.user_in === "임의결석") arr[v.user_name].record2++;
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

  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }

  function union(a, b) {
    return [...a, ...not(b, a)];
  }

  const OnclickfilterHandler = () => {
    searchUser(3);
  };

  const [isReserv, setIsReserv] = useState(false);
  const [checked, setChecked] = useState([]);
  const [right, setRight] = useState([]);

  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedLeft = () => {
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <ListCard>
      <ListCardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{ "aria-label": "all items selected" }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value.info}-label`;

          return (
            <ListItem
              key={value.no}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.info}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </ListCard>
  );

  const onCheckReservBox = (name) => (e) => {
    setIsReserv(e.target.checked);
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>알림 받을 학생 선택</h4>
              <p className={classes.cardCategoryWhite}></p>
            </CardHeader>
            <CardBody>
              <GridContainer>
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
                <GridItem xs={12} sm={12} md={9}>
                  <Card>
                    <MaterialTable
                      title="Data list related to attendance"
                      columns={tableData.columns}
                      data={tableData.data}
                      actions={[
                        {
                          tooltip: "Add All Selected Users",
                          icon: "add",
                          onClick: (evt, data) => {
                            // alert('You want to add ' + data.length + ' rows')
                            var newRight = right.concat(
                              data.map((v) => ({
                                info: [v.stage, v.city, v.group, v.name].join(
                                  " "
                                ),
                                no: v.no,
                              }))
                            );
                            // console.log(newRight)
                            newRight = newRight.filter((item, i) => {
                              return (
                                newRight.findIndex((item2, j) => {
                                  return item.no === item2.no;
                                }) === i
                              );
                            });
                            setRight(newRight);
                            // console.log(newRight)
                          },
                        },
                      ]}
                      options={{
                        sorting: true,
                        //actionsColumnIndex: -1,
                        rowStyle: {
                          //backgroundColor: "#EEE",
                        },
                        showTitle: false,
                        selection: true,
                      }}
                    />
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <Card>
                    {/* <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>               */}
                    <Grid item>{customList("선택된 학생", right)}</Grid>
                    <Button
                      variant="outlined"
                      className={classes.button}
                      color="info"
                      onClick={handleCheckedLeft}
                      disabled={right.length === 0}
                      aria-label="move selected left"
                    >
                      삭제
                    </Button>
                  </Card>
                  {/* </Grid> */}
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>메세지 전송</h4>
              <p className={classes.cardCategoryWhite}></p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <Card>
                    <TextField
                      disabled={!isReserv}
                      id="datetime-local"
                      label="예약 시간"
                      type="datetime-local"
                      defaultValue={moment().format("YYYY-MM-DDThh:mm")}
                      onChange={handleDateChange()}
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <FormControlLabel
                      value="start"
                      control={
                        <Checkbox
                          color="default"
                          onChange={onCheckReservBox()}
                        />
                      }
                      label="예약 발송"
                      labelPlacement="start"
                    />
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <Card>
                    <TextField
                      id="outlined-multiline-static"
                      label="메세지 작성"
                      multiline
                      rows={4}
                      placeholder="내용을 입력해주세요"
                      onChange={OnChangeHandler("content")}
                      variant="outlined"
                    />
                    <Button
                      style={{ height: "auto" }}
                      color="info"
                      onClick={OnclickHandler}
                    >
                      전송
                    </Button>
                  </Card>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
    // <GridContainer>
    //   <GridItem xs={12} sm={12} md={12}>
    //     <Card plain>
    //       <CardHeader plain color="primary">
    //         <h4 className={classes.cardTitleWhite}>알람 메세지</h4>
    //         <p className={classes.cardCategoryWhite}>
    //           Message from our friends{" "}
    //           <a
    //             href="https://design.google.com/icons/?ref=creativetime"
    //             target="_blank"
    //           ></a>
    //         </p>
    //       </CardHeader>
    //       <CardBody>
    //         <Hidden only={["sm", "xs"]}>
    //           <iframe
    //             className={classes.iframe}
    //             src="https://material.io/icons/"
    //             title="Icons iframe"
    //           >
    //             <p>Your browser does not support iframes.</p>
    //           </iframe>
    //         </Hidden>
    //         <Hidden only={["lg", "md"]}>
    //           <GridItem xs={12} sm={12} md={6}>
    //             <h5>
    //               The icons are visible on Desktop mode inside an iframe. Since
    //               the iframe is not working on Mobile and Tablets please visit
    //               the icons on their original page on Google. Check the
    //               <a
    //                 href="https://design.google.com/icons/?ref=creativetime"
    //                 target="_blank"
    //               >
    //                 Material Icons
    //               </a>
    //             </h5>
    //           </GridItem>
    //         </Hidden>
    //       </CardBody>
    //     </Card>
    //   </GridItem>
    // </GridContainer>
  );
}
