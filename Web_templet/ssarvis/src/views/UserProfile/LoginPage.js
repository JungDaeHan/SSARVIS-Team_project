// 0803 kihun

import React, { useState, useContext } from "react";
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
import swal from "sweetalert";
import emailjs from "emailjs-com";

import { emailkey } from "config/config.js";

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
    backgroundImage: "url(assets/img/sidebar-2.jpg)",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  let history = useHistory();

  const classes = useStyles();
  const { user, setUser } = useContext(CommonContext);

  const regExp_email = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  const [LoginRemember, SetloginRemember] = useState(false);
  const [signUser, setSignUser] = useState({
    email: "",
    passwd: "",
  });

  const [openPasswdInitDialog, setOpenPasswdInitDialog] = useState(false);
  const [initpasswdinputEmail, setInitpasswdinputEmail] = useState("");

  const onPasswdInitDialogHandler = (name) => () => {
    if (name === "init") {
      if (!regExp_email.test(initpasswdinputEmail)) {
        swal({
          title: "이메일 형식이 잘못되었습니다.",
          text: "입력한 이메일을 다시 한번 확인해 주세요.",
          icon: "warning",
          buttons: "확인",
          dangerMode: true,
        });
        return;
      }

      var chars =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
      var string_length = 15;
      var randomstring = "";
      for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
      }

      console.log(randomstring);

      let hashPassword = "";
      try {
        hashPassword = crypto
          .createHash("sha512")
          .update(randomstring)
          .digest("hex");
      } catch (error) {
        return;
      }

      let body = {
        sql: `UPDATE tb_user SET user_pwd='${hashPassword}'WHERE user_email='${initpasswdinputEmail}'`,
      };

      const request = Axios.post("/api/user/update", body).then((response) => {
        if (response.data.data.affectedRows === 0) {
          swal({
            text: "등록되지 않은 이메일입니다.",
            icon: "warning",
            buttons: "확인",
            dangerMode: true,
          });
          return;
        }

        if (response.data.success === false) {
          swal({
            text: "비밀번호 초기화에 실패하였습니다.",
            icon: "warning",
            buttons: "확인",
            dangerMode: true,
          });
          return;
        }

        var templateParams = {
          to_name: initpasswdinputEmail,
          message_html: randomstring,
        };

        console.log(initpasswdinputEmail);

        emailjs
          .send(
            emailkey.serverID,
            emailkey.templeteId,
            templateParams,
            emailkey.userId
          )
          .then(
            function (response) {
              console.log("SUCCESS!", response.status, response.text);
              swal({
                text: `${initpasswdinputEmail} 으로 임시 비밀번호를 전송하였습니다.`,
                icon: "success",
                buttons: "확인",
              });
              setOpenPasswdInitDialog(false);
              history.push("/");
            },
            function (error) {
              alert("ERR");
              history.push("/");
            }
          );
      });
    } else {
      setOpenPasswdInitDialog(name);
    }
  };

  const onChangeinitpasswdinputEmail = (e) => {
    setInitpasswdinputEmail(e.target.value);
  };

  const OnChangeRememberHandler = () => {
    SetloginRemember(!LoginRemember);
  };

  const OnChangeLoginHandler = (name) => (e) => {
    setSignUser({ ...signUser, [name]: e.target.value });
  };

  const onSubmitHandler = () => {
    var { email, passwd } = signUser;
    if (email === "" || passwd === "") {
      swal({
        text: "빈칸을 모두 입력해주세요",
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

    let hashPassword = "";
    try {
      hashPassword = crypto.createHash("sha512").update(passwd).digest("hex");
    } catch (error) {
      return;
    }

    let body = {
      user_email: email,
      user_pwd: hashPassword,
    };

    Axios.post("/api/user/login", body).then((response) => {
      if (response.data.success === false) {
        swal({
          text: "회원정보가 틀립니다.",
          icon: "warning",
          buttons: "확인",
          dangerMode: true,
        });
        return;
      }

      setUser({
        ...user,
        user_no: response.data.user_info.user_no,
        user_name: response.data.user_info.user_name,
        user_email: response.data.user_info.user_email,
        user_phone: response.data.user_info.user_phone,
        user_mac: response.data.user_info.user_mac,
        user_home: response.data.user_info.user_home,
        user_city: response.data.user_info.user_city,
        user_group: response.data.user_info.user_group,
        user_state: "Login",
        user_admin: response.data.user_info.user_admin,
        user_stage: response.data.user_info.user_stage,
        user_info: response.data.user_info.user_info,
        user_img_url: response.data.user_info.user_img_url,
      });

      history.push("/admin/dashboard");
    }); 
  };

  const handleKeyPress = (e) => {
    console.log(e);
    if (e.key === "Enter") {
      onSubmitHandler();
    }
  };

  return (
    <Container component="main" maxWidth="xs" onKeyPress={handleKeyPress}>
      <Dialog
        open={openPasswdInitDialog}
        onClose={onPasswdInitDialogHandler(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">비밀번호 초기화</DialogTitle>
        <DialogContent>
          <DialogContentText>
            아래 입력한 이메일 주소로 초기화 된 비밀번호를 전송합니다.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            onChange={onChangeinitpasswdinputEmail}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onPasswdInitDialogHandler("init")} color="primary">
            초기화
          </Button>
          <Button onClick={onPasswdInitDialogHandler(false)} color="primary">
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
          로그인
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={OnChangeLoginHandler("email")}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={OnChangeLoginHandler("passwd")}
          />
          {/* <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Remember me"
            onChange={OnChangeRememberHandler}
          /> */}
          <Button
            //type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onSubmitHandler}
          >
            로그인
          </Button>
          <Grid container>
            <Grid item xs>
              <Button onClick={onPasswdInitDialogHandler(true)} color="inherit">
                비밀번호 찾기
              </Button>
            </Grid>
            <Grid item>
              <NavLink to={"/profile/Register"}>
                <Button color="inherit">{"아직 계정이 없으신가요?"}</Button>
              </NavLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
