import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/core/styles';
import { CommonContext } from '../../../../context/CommonContext';

import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
  },
  content: {
    padding: 0,
  },
  inner: {
    minWidth: 1050,
    
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'  
  },
  actions: {
    justifyContent: 'flex-end'
  },
  table:{
    minwidth: 350,
  },
  titleCell_attr:{
    textAlign: "center",
    width: 800,
    fontWeight:"bold",
    fontSize:"13px",
  },
  titleCell:{
    width: 800,
    fontFamily:"helvetica",
  },
  regiCell_attr:{
    textAlign: "center",
    fontWeight:"bold",
    fontSize:"13px",
  },
  regiCell:{
    textAlign: "center",
    fontSize:"13px",
  },
  tableRow:{
    border: 100,
    color: '#999',
  },
  tableHead:{
    backgroundColor: "lightblue",
  },
  noCell_attr:{
    textAlign: "center",
    width: 60,
    fontSize:"13px",
    fontWeight:"bold",
  },
  noCell:{
    textAlign: "center",
    width: 60,
  }
}));

const NoticeTable = props => {
  const { className,...rest } = props;
  const classes = useStyles();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {page, setPage} = useContext(CommonContext);
  const {setNoticeDialogOpen} = useContext(CommonContext);
  const {setNoticeDetailData} = useContext(CommonContext);
  const {notices} = useContext(CommonContext);
  
  const NoticeOpenHandler = async (notice) => {
   
    setNoticeDetailData({...notice});
    setNoticeDialogOpen(true);
    
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };
  function categoryType(category_no,notice_title){
    let category_array = ['학습','평가','운영','사이트','기타'];
    
    return "["+category_array[category_no-1]+"] "+notice_title;
  }
  
  let notices_length = notices.length;
  let notice_no = notices_length-(page*rowsPerPage);
  
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table className={classes.table}>
              <TableHead className= {classes.tableHead}>
                <TableRow>
                  
                  <TableCell className={classes.noCell_attr}>번호</TableCell>
                  <TableCell className={classes.titleCell_attr}>제목</TableCell>
                  <TableCell className={classes.regiCell_attr}>등록일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {notices.slice(page*rowsPerPage, page*rowsPerPage+rowsPerPage).map((notice,index) => (
                  
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={index}
                    onClick = {() => NoticeOpenHandler(notice)}> 
                    
                    <TableCell className = {classes.noCell}>{ notice_no-- }</TableCell>
                    <TableCell className={classes.titleCell}>
                      {categoryType(notice.notice_category,notice.notice_title)}
                    </TableCell>
                    <TableCell className ={classes.regiCell}>
                      { moment(notice.join_dt).format('YYYY/MM/DD')}
                    </TableCell>
                   
                  </TableRow>
                  
                  
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={notices.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

NoticeTable.propTypes = {
  className: PropTypes.string,
};

export default NoticeTable;
