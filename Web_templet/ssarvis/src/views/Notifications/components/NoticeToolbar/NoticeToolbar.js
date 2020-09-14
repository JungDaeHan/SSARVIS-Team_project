import React,{useContext} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button} from '@material-ui/core';
import { SearchInput } from 'components/SearchInput';
import { CommonContext } from '../../../../context/CommonContext';
import Axios from 'axios';
const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const NoticeToolbar = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const {setNoticeEditFormOpen}  = useContext(CommonContext);
  const {setNotices} = useContext(CommonContext);
  const {user} = useContext(CommonContext);
  const {setPage} = useContext(CommonContext);
  const handleNoticeFormOpen = () =>{
    setNoticeEditFormOpen(true);

  }
  const handleNoticeCategory = (category) =>{
      
      let body={
        category: category,
      }
      let notice_data=[];
      Axios.post('/api/notice/view', body)
      .then(response => {
        notice_data = response.data.data;
        setNotices(notice_data);
        setPage(0);
      })
      .catch(error => {
        alert('내용을 불러오는데 실패하였습니다.');
      });
  }
  const isAdmin = user.user_admin;
  let addForm_button;
  if(isAdmin === 'admin'){
    addForm_button = <Button
    color="primary"
    variant="contained"
    onClick = {handleNoticeFormOpen}
  >
    공지 추가
  </Button>;
  } else{
    addForm_button ='';
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}> 
        <span className={classes.spacer} />
        <Button className={classes.exportButton} onClick={() => handleNoticeCategory(0)}>전체</Button>
        <Button className={classes.exportButton} onClick={() => handleNoticeCategory(1)}>학습</Button>
        <Button className={classes.exportButton} onClick={() => handleNoticeCategory(2)}>평가</Button>
        <Button className={classes.exportButton} onClick={() => handleNoticeCategory(3)}>운영</Button>
        <Button className={classes.exportButton} onClick={() => handleNoticeCategory(4)}>사이트</Button>
        <Button className={classes.exportButton} onClick={() => handleNoticeCategory(5)}>기타</Button>
        {addForm_button}
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="제목, 내용"
        />
      </div>
    </div>
  );
};

NoticeToolbar.propTypes = {
  className: PropTypes.string
};

export default NoticeToolbar;
