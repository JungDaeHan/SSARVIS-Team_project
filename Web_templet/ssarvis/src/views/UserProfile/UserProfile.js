import React, {
  useContext,
  useState,
  useCallback,
  Fragment,
  useEffect,
} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { CommonContext } from "../../context/CommonContext";
import { useHistory } from "react-router-dom";

import Axios from "axios";
import crypto from "crypto";
import swal from "sweetalert";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import Autocomplete from "@material-ui/lab/Autocomplete";

import { useDropzone } from "react-dropzone";
import { isNull } from "util";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);
const defaultImg = "defaultImg.png";

export default function UserProfile() {
  let history = useHistory();
  const classes = useStyles();

  const {
    user,
    setUser,
    userImgUrl,
    thumbnailImageData,
    setThumbnailImageData,
  } = useContext(CommonContext);

  const [userinfo, setUserinfo] = useState(user);

  const [changePasswd, setChangePasswd] = useState({
    open: false,
    nowpasswd: "",
    newpasswd: "",
    repeat: "",
  });

  const onDrop = useCallback((acceptedFiles) => {
    console.log("Basic -> acceptedFiles", acceptedFiles);
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone(onDrop);

  if (user.user_state === "Logout") {
    history.push("/profile/Login");
  }

  const OnChangeHandler = (name) => (e) => {
    setUserinfo({ ...userinfo, [name]: e.target.value });
  };

  const OnclickHandler = async (props) => {
    const formData = new FormData();
    var imgsql = "";

    if (acceptedFiles.length) {
      formData.append("file", thumbnailImageData.file);
      const res = await Axios.post("/api/user/uploadImg", formData);
      imgsql = `, user_img_url='${res.data.url}'`;
      userinfo.user_img_url = res.data.url;
    }

    let body = {
      sql: `UPDATE tb_user SET user_name='${userinfo.user_name}', user_email='${userinfo.user_email}', user_phone='${userinfo.user_phone}', user_mac='${userinfo.user_mac}', user_home='${userinfo.user_home}', user_city='${userinfo.user_city}', user_stage=${userinfo.user_stage}, user_group=${userinfo.user_group}, user_info='${userinfo.user_info}' ${imgsql} WHERE user_no=${userinfo.user_no}`,
    };

    const request = Axios.post("/api/user/update", body).then((response) => {
      console.log(response.data);
      if (response.data.success === false) {
        alert("ERR");
        return;
      }

      swal({
        text: "회원정보를 수정하였습니다.",
        icon: "success",
        buttons: "확인",
      });
      setUser({
        ...user,
        user_name: userinfo.user_name,
        user_home: userinfo.user_home,
        user_phone: userinfo.user_phone,
        user_city: userinfo.user_city,
        user_group: userinfo.user_group,
        user_img_url: userinfo.user_img_url,
        user_info: userinfo.user_info,
        user_stage: userinfo.user_stage,
      });
    });
  };

  const onOpenPasswdDialog = () => {
    setChangePasswd({ ...changePasswd, open: !changePasswd.open });
  };

  const onChangepasswdHandler = (name) => (e) => {
    console.log(e.target.value);
    setChangePasswd({ ...changePasswd, [name]: e.target.value });
  };

  const ononClickPasswdChange = (name) => (e) => {
    if (name === "ok") {
      console.log(changePasswd);

      if (
        changePasswd.nowpasswd === "" ||
        changePasswd.newpasswd === "" ||
        changePasswd.repeat === ""
      ) {
        swal({
          text: "빈칸을 모두 입력해주세요",
          icon: "warning",
          buttons: "확인",
          dangerMode: true,
        });
        return;
      }

      let hashPassword = "";
      try {
        hashPassword = crypto
          .createHash("sha512")
          .update(changePasswd.nowpasswd)
          .digest("hex");
      } catch (error) {
        return;
      }

      let body = {
        sql: `select user_no from tb_user where user_no=${user.user_no} and user_pwd='${hashPassword}'`,
      };

      Axios.post("/api/user/SearchUser", body).then((response) => {
        if (response.data.success === false) {
          alert("ERR");
          return;
        }

        if (response.data.data === 0) {
          swal({
            text: "현재 비밀번호가 다릅니다.",
            icon: "warning",
            buttons: "확인",
            dangerMode: true,
          });
          return;
        }

        if (changePasswd.newpasswd !== changePasswd.repeat) {
          swal({
            text: "새로운 비밀번호가 다릅니다.",
            icon: "warning",
            buttons: "확인",
            dangerMode: true,
          });
          return;
        }

        try {
          hashPassword = crypto
            .createHash("sha512")
            .update(changePasswd.newpasswd)
            .digest("hex");
        } catch (error) {
          return;
        }

        body.sql = `update tb_user set user_pwd='${hashPassword}' where user_no=${user.user_no}`;

        Axios.post("/api/user/update", body).then((response) => {
          if (response.data.success === false) {
            alert("ERR");
            return;
          }

          swal({
            text: "회원정보를 수정하였습니다.",
            icon: "success",
            buttons: "확인",
          });

          setChangePasswd({
            nowpasswd: "",
            newpasswd: "",
            repeat: "",
            open: false,
          });
        });
      });
    } else {
      setChangePasswd({ ...changePasswd, open: false });
    }
  };

  const onChangeTextField = (name) => (e, v) => {
    setUserinfo({ ...userinfo, [name]: v });
  };

  useEffect(() => {
    for (const file of acceptedFiles) {
      console.log(file);
      setThumbnailImageData({
        img: URL.createObjectURL(file),
        file: file,
      });
    }
  }, [acceptedFiles]);

  return (
    <div>
      <Dialog
        open={changePasswd.open}
        onClose={onOpenPasswdDialog}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
      >
        <DialogTitle id="form-dialog-title">비밀번호 변경</DialogTitle>
        <DialogContent>
          <GridContainer>
            <Grid container spacing={2}>
              <Grid item xs={10} sm={10}>
                <TextField
                  autoFocus
                  margin="normal"
                  id="nowpasswd"
                  label="현재 비밀번호"
                  type="password"
                  fullWidth
                  onChange={onChangepasswdHandler("nowpasswd")}
                />
              </Grid>
              <Grid item xs={10} sm={10}>
                <TextField
                  margin="normal"
                  id="newpasswd"
                  label="새로운 비밀번호"
                  type="password"
                  fullWidth
                  onChange={onChangepasswdHandler("newpasswd")}
                />
              </Grid>
              <Grid item xs={10} sm={10}>
                <TextField
                  margin="normal"
                  id="repeat"
                  label="새로운 비밀번호 확인"
                  type="password"
                  fullWidth
                  onChange={onChangepasswdHandler("repeat")}
                />
              </Grid>
            </Grid>
          </GridContainer>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={ononClickPasswdChange("ok")}>
            변경
          </Button>
          <Button color="primary" onClick={ononClickPasswdChange()}>
            취소
          </Button>
        </DialogActions>
      </Dialog>

      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>회원정보 수정</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText={
                      user.user_admin === "admin" ? "SSAFY ADMIN" : "SSAFY"
                    }
                    id="company-disabled"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      disabled: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="이름"
                    id="name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    onChange={OnChangeHandler("user_name")}
                    value={userinfo.user_name}
                  />
                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                  <CustomInput
                    inputProps={{
                      disabled: true,
                    }}
                    labelText="이메일"
                    id="email"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    onChange={OnChangeHandler("user_email")}
                    value={userinfo.user_email}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={10}>
                  <CustomInput
                    labelText="주소"
                    id="home"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    onChange={OnChangeHandler("user_home")}
                    value={userinfo.user_home}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={5}>
                  <CustomInput
                    labelText="연락처"
                    id="phone"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    onChange={OnChangeHandler("user_phone")}
                    value={userinfo.user_phone}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={5}>
                  <CustomInput
                    inputProps={{
                      disabled: true,
                    }}
                    labelText="Mac 주소"
                    id="Mac"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    onChange={OnChangeHandler("user_mac")}
                    value={userinfo.user_mac}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <Autocomplete
                    options={[
                      { value: "서울" },
                      { value: "대전" },
                      { value: "구미" },
                      { value: "광주" },
                    ]}
                    getOptionLabel={(option) => option.value}
                    id="auto-complete"
                    autoComplete
                    includeInputInList
                    onInputChange={onChangeTextField("user_city")}
                    renderInput={(params) => (
                      <TextField {...params} label="지역" margin="normal" />
                    )}
                  />

                  {/* <CustomInput
                    labelText="지역"
                    id="city"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    onChange={OnChangeHandler("user_city")}
                    value={userinfo.user_city}
                  /> */}
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <Autocomplete
                    options={[
                      { value: "1" },
                      { value: "2" },
                      { value: "3" },
                      { value: "4" },
                    ]}
                    getOptionLabel={(option) => option.value}
                    id="auto-complete"
                    autoComplete
                    includeInputInList
                    onInputChange={onChangeTextField("user_stage")}
                    renderInput={(params) => (
                      <TextField {...params} label="기수" margin="normal" />
                    )}
                  />
                  {/* <CustomInput
                    labelText="기수"
                    id="Stage"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    onChange={OnChangeHandler("user_stage")}
                    value={userinfo.user_stage}
                  /> */}
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <Autocomplete
                    options={[
                      { value: "1" },
                      { value: "2" },
                      { value: "3" },
                      { value: "4" },
                      { value: "5" },
                      { value: "6" },
                    ]}
                    getOptionLabel={(option) => option.value}
                    id="auto-complete"
                    autoComplete
                    includeInputInList
                    onInputChange={onChangeTextField("user_group")}
                    renderInput={(params) => (
                      <TextField {...params} label="반" margin="normal" />
                    )}
                  />
                  {/* <CustomInput
                    labelText="반"
                    id="Group"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    onChange={OnChangeHandler("user_stage")}
                    value={userinfo.user_group}
                  /> */}
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  {/* <InputLabel style={{ color: "#AAAAAA" }}>About me</InputLabel> */}
                  <CustomInput
                    labelText="About me (500자)"
                    id="about-me"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 5,
                    }}
                    onChange={OnChangeHandler("user_info")}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={OnclickHandler}>
                회원정보 수정
              </Button>
              <Button color="rose" onClick={onOpenPasswdDialog}>
                비밀번호 변경
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <Grid item xs={12}>
              <section className="container">
                <div {...getRootProps({ className: "dropzone" })}>
                  <CardAvatar profile>
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        src={
                          acceptedFiles.length > 0
                            ? `${thumbnailImageData.img}`
                            : user.user_img_url === null
                            ? `${userImgUrl}${defaultImg}`
                            : `${userImgUrl}${user.user_img_url}`
                        }
                        alt="..."
                      />
                    </a>
                  </CardAvatar>
                  <input {...getInputProps()} />
                </div>
              </section>
            </Grid>
            <Grid item xs={12}>
              <Fragment>
                {/* <Typography> {user.nick_name} </Typography> */}
                <section className="container">
                  <div {...getRootProps({ className: "dropzone" })}>
                    <Button
                      size={"sm"}
                      className="my-info-upload-image-component-button"
                    >
                      EDIT PROFILE
                    </Button>
                    <input {...getInputProps()} />
                  </div>
                </section>
              </Fragment>
            </Grid>

            <CardBody profile>
              <h6 className={classes.cardCategory}>
                {`${user.user_city} / ${user.user_stage}기 / ${user.user_group}반`}
              </h6>
              <h4 className={classes.cardTitle}>{user.user_name}</h4>
              <p className={classes.description}>{user.userinfo}</p>

              {/*               
              <Button color="primary" round>
                Follow
              </Button> */}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
