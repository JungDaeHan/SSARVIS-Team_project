const mariadb = require("mariadb");
const jwt = require("jsonwebtoken");
const path = require("path");
var multer = require("multer");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const pool = mariadb.createPool({ // please input your DB's information
  host: "",
  port: "",
  user: "",
  password: "",
  connectionLimit: 50,
});

const databaseinfo = { 
  database: "ssarvis",
  table: "tb_user",
};

async function SetDangerList(body, cd) {
  let conn, rows;
  var sql = "UPDATE tb_user SET user_danger = 0 WHERE user_no = ?;";
  var params = [body.user_no];
  try {
    conn = await pool.getConnection();
    conn.query(`use ${databaseinfo.database}`);
    rows = await conn.query(sql, params);

    if (rows.length == 0) {
      cd(null, 0, rows);
    } else {
      cd(null, 1, rows);
    }
  } catch (err) {
    cd(err, 0, rows);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function changeDanger(body, cd) {
  let conn, rows;
  var sql =
    "UPDATE tb_user JOIN tb_attendance ON tb_user.user_no = tb_attendance.user_no SET user_danger = 1 where now_year = ? and now_month = ? and now_day = ? and ROUND( (user_c1 + user_c2)/2, 1) >= 37.5;";
  var params = [body.year, body.month, body.day];

  try {
    conn = await pool.getConnection();
    conn.query(`use ${databaseinfo.database}`);
    rows = await conn.query(sql, params);

    if (rows.length == 0) {
      cd(null, 0, rows);
    } else {
      cd(null, 1, rows);
    }
  } catch (err) {
    cd(err, 0, rows);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function GetDangerList(body, cd) {
  let conn, rows;
  var sql =
    "SELECT tb_user.user_no, user_name,user_city,user_stage,user_group,ROUND( (user_c1 + user_c2)/2, 1 ) AS avgTem, \
             user_danger FROM tb_user JOIN tb_attendance ON tb_user.user_no = tb_attendance.user_no \
             WHERE now_year = ? and now_month = ? and now_day = ? and user_danger = 1;";
  var params = [body.year, body.month, body.day];

  try {
    conn = await pool.getConnection();
    conn.query(`use ${databaseinfo.database}`);
    rows = await conn.query(sql, params);

    if (rows.length == 0) {
      cd(null, 0, rows);
    } else {
      cd(null, 1, rows);
    }
  } catch (err) {
    cd(err, 0, rows);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function GetCountPerMuch(body, cd) {
  let conn, rows;
  var sql =
    "SELECT user_group,COUNT(*) AS count FROM tb_user LEFT JOIN tb_attendance  \
             ON tb_user.user_no = tb_attendance.user_no WHERE now_year = ? AND now_month = ? \
             AND now_day = ? and ROUND( (user_c1+user_c2)/2 , 2 ) >= 37.5 GROUP BY user_group ORDER BY user_group ASC;";
  var params = [body.year, body.month, body.day];

  try {
    conn = await pool.getConnection();
    conn.query(`use ${databaseinfo.database}`);
    rows = await conn.query(sql, params);

    if (rows.length == 0) {
      cd(null, 0, rows);
    } else {
      cd(null, 1, rows);
    }
  } catch (err) {
    cd(err, 0, rows);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function GetCountPerStage(body, cd) {
  let conn, rows;
  var sql =
    "SELECT user_stage,COUNT(*) AS count FROM tb_user LEFT JOIN tb_attendance  \
             ON tb_user.user_no = tb_attendance.user_no WHERE now_year = ? AND now_month = ? \
             AND now_day = ? and ROUND( (user_c1+user_c2)/2 , 2 ) >= 37.5 GROUP BY user_stage ORDER BY FIELD(user_stage, 4,3) DESC;";
  var params = [body.year, body.month, body.day];

  try {
    conn = await pool.getConnection();
    conn.query(`use ${databaseinfo.database}`);
    rows = await conn.query(sql, params);

    if (rows.length == 0) {
      cd(null, 0, rows);
    } else {
      cd(null, 1, rows);
    }
  } catch (err) {
    cd(err, 0, rows);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function GetDangerCount(body, cd) {
  let conn, rows;
  var sql =
    'SELECT user_city,COUNT(*) as count FROM tb_user LEFT JOIN tb_attendance ON tb_user.user_no = tb_attendance.user_no \
            WHERE now_year = 2020 AND now_month = 8 AND now_day = 10 AND ( ROUND((user_c1 + user_c2)/2,2) >= 37.5 ) \
            GROUP BY user_city ORDER BY FIELD(user_city,"광주","구미","대전","서울") DESC;';
  var params = [body.year, body.month, body.day];

  try {
    conn = await pool.getConnection();
    conn.query(`use ${databaseinfo.database}`);
    rows = await conn.query(sql, params);

    if (rows.length == 0) {
      cd(null, 0, rows);
    } else {
      cd(null, 1, rows);
    }
  } catch (err) {
    cd(err, 0, rows);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function GetTemperature(body, cd) {
  let conn, rows;
  var sql =
    "SELECT user_c1,user_c2 FROM tb_attendance \
             LEFT JOIN tb_user ON tb_attendance.user_no = tb_user.user_no \
             WHERE tb_attendance.user_no = ? and now_month = ?;";
  var params = [body.user_no, body.month];

  try {
    conn = await pool.getConnection();
    conn.query(`use ${databaseinfo.database}`);
    rows = await conn.query(sql, params);

    if (rows.length == 0) {
      cd(null, 0, rows);
    } else {
      cd(null, 1, rows);
    }
  } catch (err) {
    cd(err, 0, rows);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function GetUserList(body, cd) {
  let conn, rows;
  var sql = "SELECT * FROM tb_user WHERE user_email = ? AND user_pwd = ?";
  var params = [body.user_email, body.user_pwd];

  try {
    conn = await pool.getConnection();
    conn.query(`USE ${databaseinfo.database}`);
    rows = await conn.query(sql, params);

    if (rows.length == 0) {
      cd(null, 0, rows);
    } else {
      cd(null, 1, rows);
    }
  } catch (err) {
    cd(err, 0, rows);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function SearchUser(body, cd) {
  console.log("SearchUser", body);
  let conn, rows;
  try {
    conn = await pool.getConnection();
    conn.query(`USE ${databaseinfo.database}`);
    rows = await conn.query(body.sql);
    cd(null, 1, rows.length);
  } catch (err) {
    cd(err, 0);
    throw err;
  } finally {
    if (conn) conn.end();
  }

  if (rows.length > 0) {
    cd(1, 0);
    return;
  }
}

async function SetUserList(body, cd) {
  console.log("SetUserList", body);
  let conn;
  var sql =
    "INSERT INTO tb_user (user_name, user_email, user_phone, user_mac, user_pwd) VALUES(?, ?, ?, ?, ?)";
  var params = [
    body.user_name,
    body.user_email,
    body.user_phone,
    body.user_mac,
    body.user_pwd,
  ];

  try {
    conn = await pool.getConnection();
    conn.query(`USE ${databaseinfo.database}`);
    await conn.query(sql, params);
    cd(null, 1);
  } catch (err) {
    cd(err, 0);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

function GenerateToken(id, cd) {
  var token = jwt.sign(id, "secretToken577");
  cd(token);
}

function findByToken(token, cd) {
  jwt.verify(token, "secretToken577", async function (err, decoded) {
    let conn, rows;
    var sql = `SELECT * FROM ${databaseinfo.table} WHERE user_id = ?`;

    try {
      conn = await pool.getConnection();
      conn.query(`USE ${databaseinfo.database}`);
      rows = await conn.query(sql, decoded);
      cd(null, rows);
    } catch (err) {
      cd(err, 0);
      throw err;
    } finally {
      if (conn) conn.end();
    }
  });
}

async function UpdateUserList(body, cd) {
  let conn;
  try {
    conn = await pool.getConnection();
    conn.query(`USE ${databaseinfo.database}`);
    rows = await conn.query(body.sql);

    console.log(rows);

    cd(0, 1, rows);
  } catch (err) {
    console.log(err);
    cd(err, 0);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function Getuserattendanceinfo(body, cd) {
  if (body.year === undefined) {
    body.year = true;
  }

  if (body.month === undefined) {
    body.month = true;
  }

  if (body.day === undefined) {
    body.day = true;
  }

  let conn, rows;
  var sql = `SELECT * FROM tb_attendance WHERE user_no = ${body.user_no} AND ${body.year} AND ${body.month} AND ${body.day}`;

  try {
    conn = await pool.getConnection();
    conn.query(`USE ${databaseinfo.database}`);
    rows = await conn.query(sql);
    cd(null, 1, rows);
  } catch (err) {
    cd(err, 0, rows);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function AddNoticeFunction(body,files, cd) {
  let conn, rows;
  var date = new Date();
  var data = JSON.parse(body.mainData);

  for (i = 0; i < files.length; i++) {
    data.files[i].uploadTargetPath = files[i].path;
  }
  var sql =
    "INSERT INTO tb_notice (notice_title,notice_content,join_dt,updt_dt,user_no, notice_category,notice_fileData) VALUES(?, ?, ?, ?, ?, ?, ?)";
  var params = [
    data.title,
    data.content,
    date,
    date,
    data.user_no,
    data.category,
    JSON.stringify(data.files),
  ];
  try {
    conn = await pool.getConnection();
    conn.query(`USE ${databaseinfo.database}`);
    rows = await conn.query(sql, params);
    cd(null, 1, rows);
  } catch (err) {
    cd(err, 0, rows);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}
async function updateAttendance(body, cd) {
  let conn, rows;
  var sql, params;

  if (body.user_in !== undefined) {
    sql =
      "INSERT INTO tb_attendance (user_no, user_in, user_in_time, now_year, now_month, now_day) VALUES(?, ?, ?, ?, ?, ?)";
    params = [
      body.user_no,
      body.user_in,
      body.user_in_time,
      body.now_year,
      body.now_month,
      body.now_day,
    ];
  } else {
    sql =
      "UPDATE tb_attendance SET user_out=?, user_out_time=? WHERE user_no=? AND now_year = ? AND now_month = ? AND now_day = ?";
    params = [
      body.user_out,
      body.user_out_time,
      body.user_no,
      body.now_year,
      body.now_month,
      body.now_day,
    ];
  }

  try {
    conn = await pool.getConnection();
    conn.query(`USE ${databaseinfo.database}`);
    rows = await conn.query(sql, params);
    cd(null, 1);
  } catch (err) {
    console.log(err);
    cd(err, 0);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function viewNoticeFunction(body, cd) {
  let conn, rows;
  var sql_all = "SELECT * FROM tb_notice ORDER BY join_dt desc";
  var sql_select =
    "SELECT * FROM tb_notice WHERE notice_category = ? ORDER BY join_dt desc";
  try {
    conn = await pool.getConnection();
    conn.query(`USE ${databaseinfo.database}`);
    if (body.category == 0) rows = await conn.query(sql_all);
    else rows = await conn.query(sql_select, body.category);

    cd(null, 1, rows);
  } catch (err) {
    cd(err, 0, rows);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function GetAdminAttendanceInfo(body, cb) {
  let conn,
    today_rows,
    warn_rows,
    weekly_rows,
    monthly_rows,
    weekly_group_rows,
    monthly_group_rows;

  var sql = `SELECT t.st_cnt, n.attendance
  FROM 
  (SELECT COUNT(u.user_no) as st_cnt FROM tb_user u WHERE u.user_admin IS NULL) t, 
  (SELECT COUNT(a.user_no) AS attendance FROM tb_attendance a 
  WHERE STR_TO_DATE(CONCAT(a.now_year,'-',CONCAT(a.now_month,'-',a.now_day)), '%Y-%m-%d')='${body.today}' 
  AND a.user_in_time IS NOT NULL) n;`;

  try {
    conn = await pool.getConnection();
    conn.query(`USE ${databaseinfo.database}`);
    today_rows = await conn.query(sql);
  } catch (err) {
    if (conn) conn.release();
    cb(err);
    throw err;
  }
  var sql = `UPDATE tb_user SET tb_user.user_absent=(select aa.absent FROM (SELECT user_no, user_name, SUM(((op_late+op_leave+op_out) DIV 3)+op_absent) AS absent
                  FROM (SELECT u.user_no, user_name, user_group, now_month, COUNT(case when user_in='임의지각' then 1 END) AS op_late, COUNT(case when user_in='사유지각' then 1 END) AS exc_late, 
                        COUNT(case when user_out='사유조퇴' then 1 END) AS exc_leave, COUNT(case when user_out='임의조퇴' then 1 END) AS op_leave, 
                        COUNT(case when user_out='사유외출' then 1 END) AS exc_out, COUNT(case when user_out='임의외출' then 1 END) AS op_out, COUNT(case when user_in='임의결석' then 1 END) AS op_absent
                        FROM tb_user u, tb_attendance a
                        WHERE u.user_no = a.user_no AND user_admin IS null
                        GROUP BY u.user_no, now_month) mid_res
                  GROUP BY user_name) AS aa WHERE tb_user.user_no = aa.user_no)`;

  try {
    await conn.query(sql);
  } catch (err) {
    if (conn) conn.release();
    cb(err);
    throw err;
  }

  sql = "SELECT * from tb_user";

  try {
    warn_rows = await conn.query(sql);
  } catch (err) {
    if (conn) conn.release();
    cb(err);
    throw err;
  }

  sql = `SELECT now_year, now_month, now_day, COUNT(case when user_in LIKE '%지각' then 1 END) AS late, 
        COUNT(case when user_in = '임의결석' then 1 END) AS absent, COUNT(case when user_in='입실' AND user_out='퇴실' then 1 END) AS present
        FROM tb_user u, tb_attendance a
        WHERE u.user_no=a.user_no AND u.user_admin IS NULL
        AND '${body.monday}' <= STR_TO_DATE(CONCAT(now_year,'-',CONCAT(now_month,'-',now_day)), '%Y-%m-%d') 
        AND STR_TO_DATE(CONCAT(now_year,'-',CONCAT(now_month,'-',now_day)), '%Y-%m-%d') <= '${body.friday}'
        GROUP BY now_year, now_month, now_day`;

  try {
    weekly_rows = await conn.query(sql);
  } catch (err) {
    if (conn) conn.release();
    cb(err);
    throw err;
  }

  sql = `SELECT now_year, now_month, COUNT(case when user_in LIKE '%지각' then 1 END) AS late, 
        COUNT(case when user_in = '임의결석' then 1 END) AS absent, COUNT(case when user_in='입실' AND user_out='퇴실' then 1 END) AS present
        FROM tb_user u, tb_attendance a
        WHERE u.user_no=a.user_no AND u.user_admin IS NULL
        AND '${body.first_day}' <= STR_TO_DATE(CONCAT(now_year,'-',CONCAT(now_month,'-',now_day)), '%Y-%m-%d') 
        AND STR_TO_DATE(CONCAT(now_year,'-',CONCAT(now_month,'-',now_day)), '%Y-%m-%d') <= '${body.today}'
        GROUP BY now_year, now_month`;

  try {
    monthly_rows = await conn.query(sql);
  } catch (err) {
    if (conn) conn.release();
    cb(err);
    throw err;
  }

  sql = `SELECT CONCAT(generation,'기 ', user_city,' ', user_group,'반') AS groups, COUNT(case when user_in LIKE '%지각' then 1 END) AS late, 
        COUNT(case when user_in = '임의결석' then 1 END) AS absent, COUNT(case when user_in='입실' AND user_out='퇴실' then 1 END) AS present
        FROM tb_user u, tb_attendance a
        WHERE u.user_no=a.user_no AND u.user_admin IS NULL AND user_city is not null
        AND '${body.monday}' <= STR_TO_DATE(CONCAT(now_year,'-',CONCAT(now_month,'-',now_day)), '%Y-%m-%d') 
        AND STR_TO_DATE(CONCAT(now_year,'-',CONCAT(now_month,'-',now_day)), '%Y-%m-%d') <= '${body.friday}'
        GROUP BY generation, user_city, user_group, now_year`;

  try {
    weekly_group_rows = await conn.query(sql);
  } catch (err) {
    if (conn) conn.release();
    cb(err);
    throw err;
  }

  sql = `SELECT CONCAT(generation,'기 ', user_city,' ', user_group,'반') AS groups, COUNT(case when user_in LIKE '%지각' then 1 END) AS late, 
        COUNT(case when user_in = '임의결석' then 1 END) AS absent, COUNT(case when user_in='입실' AND user_out='퇴실' then 1 END) AS present
        FROM tb_user u, tb_attendance a
        WHERE u.user_no=a.user_no AND u.user_admin IS NULL AND generation IS NOT null
        AND '${body.first_day}' <= STR_TO_DATE(CONCAT(now_year,'-',CONCAT(now_month,'-',now_day)), '%Y-%m-%d') 
        AND STR_TO_DATE(CONCAT(now_year,'-',CONCAT(now_month,'-',now_day)), '%Y-%m-%d') <= '${body.today}'
        GROUP BY generation, user_city, user_group, now_year`;

  try {
    monthly_group_rows = await conn.query(sql);
  } catch (err) {
    cb(err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
  cb(
    null,
    today_rows,
    warn_rows,
    weekly_rows,
    monthly_rows,
    weekly_group_rows,
    monthly_group_rows
  );
}

async function userSearch(body, cd) {
  let conn, rows, rows2;
  var sql, params;
  console.log(body);
  try {
    conn = await pool.getConnection();
    conn.query(`USE ${databaseinfo.database}`);
    rows = await conn.query(body.sql);

    if (body.sql1 !== undefined) {
      rows2 = await conn.query(body.sql1);
    }
    cd(null, 1, rows, rows2);
  } catch (err) {
    console.log(err);
    cd(err, 0);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function searchNoticeFunction(body, cd) {
  let conn, rows;
  var sql_all = "SELECT * FROM tb_notice ORDER BY join_dt desc";

  try {
    conn = await pool.getConnection();
    conn.query(`USE ${databaseinfo.database}`);
    if (body.input_value == "undefined" || body.input_value == "")
      rows = await conn.query(sql_all);
    else
      rows = await conn.query(
        "SELECT * FROM tb_notice WHERE notice_title LIKE " +
          conn.escape("%" + body.input_value + "%") +
          " ORDER BY join_dt desc"
      );

    cd(null, 1, rows);
  } catch (err) {
    cd(err, 0, rows);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function updateNoticeFunction(body, cd) {
  let conn, rows;
  var date = new Date();
  var sql = "UPDATE tb_notice SET notice_title = ?, notice_content = ?, notice_category = ?, updt_dt = ? WHERE notice_no = ?";
 
  var params = [
    body.title,
    body.content,
    body.category,
    date,
    body.notice_no,
  ]
  
  try {
    conn = await pool.getConnection();
    conn.query(`USE ${databaseinfo.database}`);
    rows = await conn.query(sql, params);
    cd(null, 1, rows);
  } catch (err) {
    cd(err, 0, rows);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function deleteNoticeFunction(body, cd) {
  let conn, rows;
  var date = new Date();
  var sql = "DELETE FROM tb_notice WHERE notice_no = ?";

  var params = [body.notice_no];

  try {
    conn = await pool.getConnection();
    conn.query(`USE ${databaseinfo.database}`);
    rows = await conn.query(sql, params);
    cd(null, 1, rows);
  } catch (err) {
    cd(err, 0, rows);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

async function SendSMS(body, cb) {
  let conn, rows;
  var sql = `SELECT user_no, user_phone FROM tb_user u WHERE user_no in (${body.user_no})`;

  try {
    conn = await pool.getConnection();
    conn.query(`USE ${databaseinfo.database}`);
    rows = await conn.query(sql);
  } catch (err) {
    cb(err, null);
    throw err;
  } finally {
    if (conn) conn.release();
  }
  cb(null, rows);
}

module.exports = {
  changeDanger,
  SetDangerList,
  GetDangerList,
  GetCountPerMuch,
  GetCountPerStage,
  GetDangerCount,
  GetTemperature,
  GetUserList,
  SearchUser,
  SetUserList,
  GenerateToken,
  findByToken,
  UpdateUserList,
  Getuserattendanceinfo,
  AddNoticeFunction,
  viewNoticeFunction,
  updateNoticeFunction,
  searchNoticeFunction,
  deleteNoticeFunction,
  updateAttendance,
  userSearch,
  GetAdminAttendanceInfo,
  SendSMS,
};
