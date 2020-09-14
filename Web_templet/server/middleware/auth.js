const mdbConn = require("../model/mariaDBConn.js");

let auth = (req, res, next) => {
  let token = req.cookies.ssarvis_auth;

  if (token == undefined) {
    req.token = token;
    req.isAdmin = 0;
    req.isLogin = 0;
    next();
  } else {
    mdbConn.findByToken(token, (err, rows) => {
      if (err) throw err;
      if (rows == 0)
        return res.json({
          isAuth: false,
          error: true,
        });

      req.token = token;
      req.user_id = rows[0].user_id;
      req.isAdmin = rows[0].user_admin;
      req.isLogin = rows[0].user_login;
      next();
    });
  }
};

module.exports = { auth };
