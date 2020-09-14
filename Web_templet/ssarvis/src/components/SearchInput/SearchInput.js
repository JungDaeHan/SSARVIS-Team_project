import React, { useContext } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Input } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { CommonContext } from "../../context/CommonContext";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "4px",
    alignItems: "center",
    padding: theme.spacing(1),
    display: "flex",
    flexBasis: 420,
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  input: {
    flexGrow: 1,
    fontSize: "14px",
    lineHeight: "16px",
    letterSpacing: "-0.05px",
  },
}));

const SearchInput = (props) => {
  const { className, style, ...rest } = props;
  const { notices, setNotices } = useContext(CommonContext);
  const classes = useStyles();
  const onChange = (event) => {
    let body = {
      input_value: event.target.value,
    };
    let notice_data = {};
    Axios.post("/api/notice/search", body)
      .then((response) => {
        notice_data = response.data.data;

        if (notice_data != "undefined") setNotices(notice_data);
      })
      .catch((error) => {
        alert("내용을 불러오는데 실패하였습니다.");
      });
  };
  return (
    <Paper {...rest} className={clsx(classes.root, className)} style={style}>
      <SearchIcon className={classes.icon} />
      <Input
        {...rest}
        className={classes.input}
        disableUnderline
        onChange={onChange}
      />
    </Paper>
  );
};

SearchInput.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object,
};

export default SearchInput;
