
import React, {useContext, useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import NoticeList from "./NoticeList.js";
import ResponsiveNoticeDialog from "./NoticeDialog.js";
import { NoticeEditForm, NoticeModifyForm } from "./components";
import { CommonContext } from "../../context/CommonContext";
import Axios from "axios";

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

export default function Notifications() {
  const classes = useStyles();
  const {setNotices } = useContext(CommonContext);

  useEffect(()=>{
    let body={
      category: 0,
    };
    let notice_data = {};
    Axios.post("/api/notice/view", body)
      .then((response) => {
        notice_data = response.data.data;
        setNotices(notice_data);
      })
      .catch((error) => {
        alert("내용을 불러오는데 실패하였습니다.");
      });
  }, []);

  return (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>공지사항</h4>
        <p className={classes.cardCategoryWhite}></p>
      </CardHeader>
      <CardBody>
        <GridContainer>
          <NoticeList></NoticeList>
        </GridContainer>
      </CardBody>
      <ResponsiveNoticeDialog></ResponsiveNoticeDialog>
      <NoticeEditForm></NoticeEditForm>
      <NoticeModifyForm></NoticeModifyForm>
    </Card>
  );
}
