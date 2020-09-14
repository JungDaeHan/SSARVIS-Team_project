const express = require("express");
const mdbConn = require("./server/model/mariaDBConn");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { auth } = require("./server/middleware/auth");
const config = require("./server/config/key");
require("typescript-require");
const { NCPClient } = require("./server/util/node-sens.ts");

const app = express();
const port = 5000;

app.get("/", (req, res) => res.send("Hello World!!!!~~ "));
app.listen(port, () => console.log(`app listening on port ${port}!`));

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static("public"));

app.use(cookieParser());

const ncp = new NCPClient({
  phoneNumber: config.phoneNumber,
  serviceId: config.serviceID,
  secretKey: config.secretKey,
  accessKey: config.accessKey,
});

app.post("/api/attendance/changedanger", (req, res) => {
  mdbConn.changeDanger(req.body, function (err, ismatch, rows) {
    if (err || ismatch == 0) {
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        data: rows,
      });
    }
  });
});

app.post("/api/attendance/setdanger", (req, res) => {
  mdbConn.SetDangerList(req.body, function (err, ismatch, rows) {
    if (err || ismatch == 0) {
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        data: rows,
      });
    }
  });
});

app.post("/api/attendance/getdanger", (req, res) => {
  mdbConn.GetDangerList(req.body, function (err, ismatch, rows) {
    if (err || ismatch == 0) {
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        data: rows,
      });
    }
  });
});

app.post("/api/attendance/dangermuch", (req, res) => {
  mdbConn.GetCountPerMuch(req.body, function (err, ismatch, rows) {
    if (err || ismatch == 0) {
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        data: rows,
      });
    }
  });
});

app.post("/api/attendance/dangerstage", (req, res) => {
  mdbConn.GetCountPerStage(req.body, function (err, ismatch, rows) {
    if (err || ismatch == 0) {
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        data: rows,
      });
    }
  });
});

app.post("/api/attendance/danger", (req, res) => {
  mdbConn.GetDangerCount(req.body, function (err, ismatch, rows) {
    if (err || ismatch == 0) {
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        data: rows,
      });
    }
  });
});

app.post("/api/attendance/temperature", (req, res) => {
  mdbConn.GetTemperature(req.body, function (err, ismatch, rows) {
    if (err || ismatch == 0) {
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        data: rows,
      });
    }
  });
});

fs.readdir("public/uploads", (error) => {
  // uploads 폴더 없으면 생성
  if (error) {
    fs.mkdirSync("public/uploads");
  }
});

const notice_storage = multer.diskStorage({
  destination: "public/uploads",
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
  },
});

const notice_upload = multer({
  storage: notice_storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.post("/api/notice/create", notice_upload.any(), (req, res) => {
  console.log(req.files);
  mdbConn.AddNoticeFunction(req.body, req.files, function (err, ismatch) {
    if (!ismatch) {
      console.log(err);
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
      });
    }
  });
});

app.post("/api/notice/view", (req, res) => {
  mdbConn.viewNoticeFunction(req.body, function (err, ismatch, data) {
    if (!ismatch) {
      console.log(err);
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        data: data,
      });
    }
  });
});
app.post("/api/notice/search", (req, res) => {
  mdbConn.searchNoticeFunction(req.body, function (err, ismatch, data) {
    if (!ismatch) {
      console.log(err);
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        data: data,
      });
    }
  });
});

app.post("/api/notice/update", (req, res) => {
  mdbConn.updateNoticeFunction(req.body, function (err, ismatch) {
    if (!ismatch) {
      console.log(err);
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
      });
    }
  });
});

app.post("/api/notice/delete", (req, res) => {
  mdbConn.deleteNoticeFunction(req.body, function (err, ismatch) {
    if (!ismatch) {
      console.log(err);
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
      });
    }
  });
});

app.post("/api/user/register", (req, res) => {
  mdbConn.SetUserList(req.body, function (err, ismatch) {
    if (!ismatch) {
      console.log(err);
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
      });
    }
  });
});

app.post("/api/user/SearchUser", (req, res) => {
  mdbConn.SearchUser(req.body, function (err, ismatch, result) {
    if (!ismatch) {
      console.log(err);
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        data: result,
      });
    }
  });
});

app.post("/api/user/login", (req, res) => {
  console.log("login->", req.body);
  mdbConn.GetUserList(req.body, function (err, ismatch, rows) {
    if (err || ismatch == 0) {
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        user_info: rows[0],
        login: ismatch,
      });
    }
  });
});

app.get("/api/user/auth", auth, (req, res) => {
  res.status(200).json({
    id: req.user_id,
    isAdmin: req.isAdmin,
    isLogin: req.isLogin,
    token: req.token,
  });
});

app.get("/api/user/logout", auth, (req, res) => {
  if (req.isLogin) {
    mdbConn.SetLogout(req.user_id, (err, isresult) => {
      if (isresult) {
        res.status(200).json({
          login: "login -> logout",
          success: true,
        });
      } else {
        res.status(200).json({
          success: false,
        });
      }
    });
  } else {
    res.status(200).json({
      login: "logout",
      success: true,
    });
  }
});

app.post("/api/user/update", (req, res) => {
  mdbConn.UpdateUserList(req.body, function (err, ismatch, rows) {
    if (err || ismatch == 0) {
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        data: rows,
      });
    }
  });
});

//날짜별 검색
app.post("/api/attendance/userinfo", (req, res) => {
  //console.log("attendance/userinfo->", req.body);
  mdbConn.Getuserattendanceinfo(req.body, function (err, ismatch, rows) {
    if (err || ismatch == 0) {
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        data: rows,
      });
    }
  });
});

app.post("/api/attendance/update", (req, res) => {
  console.log("attendance/update->", req.body);
  mdbConn.updateAttendance(req.body, function (err, ismatch) {
    if (err || ismatch == 0) {
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
      });
    }
  });
});

app.post("/api/attendance/adminInfo", (req, res) => {
  mdbConn.GetAdminAttendanceInfo(req.body, function (
    err,
    today_rows,
    warn_rows,
    weekly_rows,
    monthly_rows,
    weekly_group_rows,
    monthly_group_rows
  ) {
    if (err) {
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        today_info: today_rows[0],
        warn_info: warn_rows,
        weekly_info: weekly_rows,
        monthly_info: monthly_rows,
        weekly_group_info: weekly_group_rows,
        monthly_group_info: monthly_group_rows,
      });
    }
  });
});

app.post("/api/attendance/usersearch", (req, res) => {
  //console.log("attendance/usersearch->", req.body);
  mdbConn.userSearch(req.body, function (err, ismatch, rows, row2) {
    if (err || ismatch == 0) {
      res.status(200).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        data: rows,
        data2: row2,
      });
    }
  });
});

app.post("/api/admin/sendsms", (req, res) => {
  mdbConn.SendSMS(req.body, function (err, rows) {
    if (err) {
      res.status(200).json({
        success: false,
      });
    } else {
      console.log(rows[0]);
      console.log(
        config.accessKey,
        config.phoneNumber,
        config.secretKey,
        config.serviceID
      );
      sendSMS(rows, req.body.content, req.body.reserveTime, res);
    }
  });
});

const sendSMS = async (toList, content1, reserveTimeVal, res) => {
  let successList = [];
  // console.log(toList[0].user_phone)
  // console.log(toList.length)
  if (reserveTimeVal === undefined) reserveTimeVal = null;
  for (let i = 0; i < toList.length; i++) {
    const { success, msg, status } = await ncp.sendSMS({
      // const resqu = await ncp.sendSMS({
      to: toList[i].user_phone,
      content: content1.content,
      reserveTimeVal: reserveTimeVal,
    });
    console.log(success, msg, status);
    console.log("result : " + success);
    successList.push({ user_no: toList[i].user_no, result: success });
    // console.log(resqu)
  }

  res.status(200).json({
    success: successList,
    // success: true,
  });
};

fs.readdir("public/imgs", (error) => {
  // uploads 폴더 없으면 생성
  if (error) {
    fs.mkdirSync("public/imgs");
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "public/imgs");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.post("/api/user/uploadImg", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.json({ url: `${req.file.filename}` });
});
