import React, { useState, useContext, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Axios from "axios";
import { CommonContext } from "../../context/CommonContext";
import { useHistory, NavLink } from "react-router-dom";
import crypto from "crypto";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ArrowLeftTwoTone } from "@material-ui/icons";
import swal from "sweetalert";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://edu.ssafy.com">
        A109 SSAVIS @ SSAFY 3rd
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  let history = useHistory();

  const classes = useStyles();
  const { user, setUser } = useContext(CommonContext);
  const [signupOption, setSignupOption] = useState({
    open: false,
    agree: false,
    select: false,
  });

  const regExp_email = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  const resExp_num = /^[0-9]+$/g;
  const resExp_mac = /^[0-9a-zA-Z]{2}\:[0-9a-zA-Z]{2}\:[0-9a-zA-Z]{2}\:[0-9a-zA-Z]{2}:[0-9a-zA-Z]{2}\:[0-9a-zA-Z]{2}?$/gi;

  const [signUser, setSignUser] = useState({
    name: "",
    email: "",
    phone: "",
    mac: "",
    password: "",
    confirm: "",
  });

  const OnChangeHandler = (name) => (e) => {
    setSignUser({ ...signUser, [name]: e.target.value });
    setSignupOption({ ...signupOption, select: false });
  };

  const onSubmitHandler = () => {
    //e.prevpreventdefaultant();
    console.log(signUser);

    var { name, email, phone, mac, password, confirm } = signUser;

    if (
      name === "" ||
      email === "" ||
      phone === "" ||
      mac === "" ||
      password === "" ||
      confirm === ""
    ) {
      swal({
        text: "빈칸을 모두 입력해주세요.",
        icon: "warning",
        buttons: "확인",
        dangerMode: true,
      });
      return;
    }

    if (signupOption.agree === false) {
      swal({
        text: "개인정보 수집, 이용에 동의해주세요.",
        icon: "warning",
        buttons: "확인",
        dangerMode: true,
      });
      return;
    }

    if (signupOption.select === false) {
      swal({
        text: "회원정보 중복조회 해주세요.",
        icon: "warning",
        buttons: "확인",
        dangerMode: true,
      });
      return;
    }

    if (!regExp_email.test(email)) {
      swal({
        text: "이메일 형식이 잘못되었습니다.",
        icon: "warning",
        buttons: "확인",
        dangerMode: true,
      });
      return;
    }

    if (password !== confirm) {
      swal({
        text: "비밀번호가 다릅니다.",
        icon: "warning",
        buttons: "확인",
        dangerMode: true,
      });
      return;
    }

    if (!resExp_num.test(phone)) {
      swal({
        text: "Phone number 형식이 잘못되었습니다.",
        icon: "warning",
        buttons: "확인",
        dangerMode: true,
      });
      return;
    }

    if (!resExp_mac.test(mac)) {
      swal({
        text: "MAC Address 형식이 잘못되었습니다.",
        icon: "warning",
        buttons: "확인",
        dangerMode: true,
      });
      return;
    }

    let hashPassword = "";
    try {
      hashPassword = crypto.createHash("sha512").update(password).digest("hex");
    } catch (error) {
      return;
    }

    let body = {
      user_name: name,
      user_email: email,
      user_phone: phone,
      user_mac: mac,
      user_pwd: hashPassword,
    };

    console.log(body);

    const request = Axios.post("/api/user/register", body).then((response) => {
      console.log(response.data);
      if (response.data.success === false) {
        alert("회원가입에 실패하였습니다.");
        return;
      }

      swal({
        title: "회원가입에 성공하였습니다.",
        icon: "success",
        buttons: "확인",
      });
      history.push("/");
    });
  };

  const onClickoption = () => {
    setSignupOption({ ...signupOption, open: true });
  };

  const onCloseHandler = (name) => (e) => {
    console.log(name);

    if (name === "Y") {
      signupOption.agree = true;
    } else if (name === "N") {
      signupOption.agree = false;
    }

    signupOption.open = false;
    setSignupOption({ open: signupOption.open, agree: signupOption.agree });
  };

  const searchUserinfo = () => {
    var { email, phone, mac } = signUser;
    var warning = ["", ""];

    if (
      email === undefined ||
      mac === undefined ||
      email === "" ||
      mac === ""
    ) {
      swal({
        text: "빈칸을 모두 입력해주세요",
        icon: "warning",
        buttons: "확인",
        dangerMode: true,
      });
      return;
    }

    let body = {
      sql: `SELECT user_email, user_mac FROM tb_user WHERE user_email='${email}' OR user_mac='${mac}'`,
    };

    Axios.post("/api/user/SearchUser", body).then((res) => {
      if (res.data.success === false) {
        alert("중복조회에 실패하였습니다.");
        return;
      }

      if (res.data.data > 0) {
        swal({
          text: "동일한 이메일 또는 Mac주소가 등록되었습니다.",
          icon: "warning",
          buttons: "확인",
          dangerMode: true,
        });

        setSignupOption({ ...signupOption, select: false });
      } else {
        swal({
          text: "회원가입 가능한 정보입니다.",
          icon: "success",
          buttons: "확인",
        });

        setSignupOption({ ...signupOption, select: true });
      }
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Dialog
        open={signupOption.open}
        onClose={onCloseHandler}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">개인 정보 이용 동의서</DialogTitle>
        <DialogContent>
          <DialogContentText>
            SSARVIS는 스마트폰을 활용한 자동출석 기능을 제공하고 있습니다.
            <br></br>
            이를 위해 교육생의 신원확인에 필요한 전화번호와 스마트폰 블루투스
            MAC주소를 수집하고 있습니다. 내용을 이해하신 후 동의 여부를 결정해
            주시기 바랍니다.
            <br></br>
            <br></br>
            Ⅰ. 수집 항목 및 수집 목적
            <br></br>
            가) 수집 항목
            <br></br>- 성명, 전화번호, 스마트폰 블루스트 MAC Address
            <br></br>
            <br></br>
            나) 이용 목적
            <br></br>- 자동 출석 시스템 신원정보 연동
            <br></br>
            <br></br>
            Ⅱ. 개인정보 보유 및 이용기간
            <br></br>- 동의일로부터 회원탈퇴전까지
            <br></br>
            <br></br>
            Ⅲ. 동의거부관리
            <br></br>- 서비스 특성상 정보 수집, 이용 거부 시 해당 서비스를
            이용하실수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseHandler("Y")} color="primary">
            동의
          </Button>
          <Button onClick={onCloseHandler("N")} color="primary">
            취소
          </Button>
        </DialogActions>
      </Dialog>

      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
          회원가입
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={4} sm={4}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="Name"
                label="Name"
                name="Name"
                autoComplete="lname"
                autoFocus
                onChange={OnChangeHandler("name")}
              />
            </Grid>
            <Grid item xs={8} sm={8}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={OnChangeHandler("email")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="phone"
                label="Phone Number (only numbers)"
                name="Phone"
                autoComplete="phone"
                onChange={OnChangeHandler("phone")}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="Mac Address"
                label="Mac Address (XX:XX:XX:XX:XX:XX)"
                id="Mac Address"
                onChange={OnChangeHandler("mac")}
              />
            </Grid>
            {/*<Grid item xs={2} md={2}>
               <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  className={classes.margin}
                  onClick={onClickoption}
                >
                  Small
                </Button>
              </div> 
            </Grid>*/}
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={OnChangeHandler("password")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="Confirm Password"
                label="Confirm Password"
                type="password"
                id="Confirm Password"
                autoComplete="current-password"
                onChange={OnChangeHandler("confirm")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    //value="allowExtraEmails"
                    color="primary"
                    checked={signupOption.agree}
                    onClick={onClickoption}
                  />
                }
                label="개인정보 수집, 이용에 동의합니다."
              />
              <FormControlLabel
                control={
                  <Checkbox
                    //value="allowExtraEmails"
                    color="primary"
                    checked={signupOption.select}
                    onClick={searchUserinfo}
                  />
                }
                label="회원정보가 중복 조회 되었습니다."
              />
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
          <Button
            //type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onSubmitHandler}
          >
            가입 신청
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <NavLink to={"/profile/Login"}>이미 계정이 있으신가요?</NavLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
