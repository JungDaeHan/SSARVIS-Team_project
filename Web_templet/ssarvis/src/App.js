/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState } from "react";
//import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import {
  BrowserRouter,
  Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";
//import User from "layouts/User.js";
//import RTL from "layouts/RTL.js";
import LoginPage from "views/UserProfile/LoginPage.js";
import RegisterPage from "views/UserProfile/RegisterPage.js";
import mainPage from "views/mainPage.js";
import testPage from "./test.js";

import { useLocalStorageSetState } from "./common/CommonHook.js";
import "assets/css/material-dashboard-react.css?v=1.9.0";
import { CommonContext } from "./context/CommonContext";
import userInitialValue from "views/UserProfile/dump.json";

const userImgUrl = "http://localhost:5000/imgs/";
const noticeUploadUrl = "http://localhost:5000/";

const App = () => {
  //const hist = createBrowserHistory();
  const [user, setUser] = useLocalStorageSetState(userInitialValue, "user");
  const [sideberOpen, setsideberOpen] = useState(false);
  const [NoticeDialogOpen, setNoticeDialogOpen] = useState(false);
  const [NoticeData, setNoticeDetailData] = useState([]);
  const [NoticeEditFormOpen, setNoticeEditFormOpen] = useState(false);
  const [NoticeEditFormData, setNoticeEditFormData] = useState({
    title: "",
    category: null,
  });
  const [noticeEditorContentData, setNoticeEditorContentData] = useState("");
  const [notices, setNotices] = useState([{}]);
  const [noticeUpdate, setNoticeUpdate] = useState(0);
  const [isModifyNotice, setIsModifyNotice] = useState(false);
  const [page, setPage] = useState(0);
  const [thumbnailImageData, setThumbnailImageData] = useState({
    file: "",
    img: "",
  });
  const [uploadFileData, setUploadFileData] = useState([]);

  return (
    //context 적용 및 sign in,up 페이지 적용 0803 - kihun
    <CommonContext.Provider
      value={{
        user,
        setUser,
        sideberOpen,
        setsideberOpen,
        NoticeDialogOpen,
        setNoticeDialogOpen,
        NoticeData,
        setNoticeDetailData,
        NoticeEditFormOpen,
        setNoticeEditFormOpen,
        NoticeEditFormData,
        setNoticeEditFormData,
        notices,
        setNotices,
        noticeUpdate,
        noticeEditorContentData,
        setNoticeEditorContentData,
        isModifyNotice,
        setIsModifyNotice,
        page,
        setPage,
        uploadFileData,
        setUploadFileData,
        thumbnailImageData,
        setThumbnailImageData,
        userImgUrl,
        noticeUploadUrl,
      }}
    >
      {/* <Router history={hist}> */}
      <BrowserRouter>
        <Switch>
          <Route path="/admin" component={Admin} />
          {/* <Route path="/user" component={User} /> */}
          {/* <Route path="/rtl" component={RTL} /> */}
          <Route path="/profile/Login" component={LoginPage} />
          <Route path="/profile/Register" component={RegisterPage} />
          <Route path="/mainpage" component={mainPage} />
          <Redirect from="/" to="/mainpage" />
        </Switch>
      </BrowserRouter>
      {/* </Router> */}
    </CommonContext.Provider>
  );
};

export default App;
