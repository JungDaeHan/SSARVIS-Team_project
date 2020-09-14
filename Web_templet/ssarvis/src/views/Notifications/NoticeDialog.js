import React, { useContext, useState } from 'react';
import { CommonContext } from '../../context/CommonContext';
import { Wrapper, Close } from './styles'
import {
    Button,
    Dialog,
    DialogActions,
    Grid,
    Typography,
    useMediaQuery,
  } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear'
import Axios from 'axios';
import FileSaver from 'file-saver';
import moment from 'moment';

const ViewNoticeDialogSubjectComponent = () => {
    const { NoticeData, user, setIsModifyNotice} = useContext(CommonContext);
    const {NoticeEditFormData,setNoticeEditFormData,setNoticeEditorContentData} = useContext(CommonContext);
    const {setNoticeDialogOpen } = useContext(CommonContext);
    const { setNotices , noticeUploadUrl } = useContext(CommonContext);
    const mobileFont = useMediaQuery('(max-width:600px)');
    let descTypography = mobileFont ? 'body1' : 'h5';
    let titleTypography = mobileFont ? 'h5' : 'h2';
    function categoryTitle(category_no,notice_title){
      let category_array = ['학습','평가','운영','사이트','기타'];
      
      return "["+category_array[category_no-1]+"] "+notice_title;
    }

    const onClickModifyButtonHandler = () =>{
      setNoticeEditFormData({...NoticeEditFormData, title: NoticeData.notice_title, category: NoticeData.notice_category, notice_no: NoticeData.notice_no});
      setNoticeEditorContentData(NoticeData.notice_content);
      setNoticeDialogOpen(false);
      setIsModifyNotice(true);
    }
    
    const onClickDeleteButtonHandler = () =>{
      let result = window.confirm('이 게시글을 삭제하시겠습니까?');
      if(result){
        let body={
          notice_no : NoticeData.notice_no,
        }

        Axios.post('/api/notice/delete', body)
        .then(response => {
          
          alert('게시글이 삭제되었습니다!');
          
          let body={
            category: 0,
          }
          let notice_data = {};
          Axios.post('/api/notice/view', body)
          .then(response => {
            notice_data = response.data.data;
            setNotices(notice_data);
            setNoticeDialogOpen(false);
            
          })
          .catch(error => {
            alert('내용을 불러오는데 실패하였습니다.');
          });
        })
        .catch(error => {
          alert('삭제에 실패하였습니다. 다시 시도하여주십시오.');
        });
      }
    }
    const fileDownload = (name,uploadTargetPath) =>{
      FileSaver.saveAs(`${noticeUploadUrl}`+uploadTargetPath.substring(7), name);
    }
    
    function uploadGrid(){
      if(NoticeData.notice_filedata !== "[]"){
        

        return (
            <Grid item xs={12} className="view-notice-subject-component-upload">
              <section className="edit-container">
                <div className="view-notice-subject-component-upload-box-title">
                  첨부파일
                </div>
                <aside>
                  {JSON.parse(NoticeData.notice_filedata).map((file,index) => (
                    <div className = "view-notice-upload-file-box1" key={index}>
                      <div key={index} onClick={() => fileDownload(file.name, file.uploadTargetPath)}>
                        {file.name}({file.size}bytes)
                      </div>
                      
                    </div>
                  ))}
                </aside>
              </section>
            </Grid>
        )
      }
        
    }

    return (
        <Wrapper>
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            spacing={4}
        >
            <Grid item xs={12} container>
            
            <Grid item xs={11} className="view-notice-subject-component-grid-item1">
              <Typography
              variant={titleTypography}
              className="view-notice-subject-component-grid-item-typography1"
              >
              {categoryTitle(NoticeData.notice_category,NoticeData.notice_title)}
              </Typography>
              <Grid item xs ={12} className="view-notice-subject-component-grid-item1-dt"> 
                <div className="view-notice-subject-component-grid-item1-dt-join">
                  {moment(NoticeData.join_dt).format('YYYY/MM/DD hh:mm:ss')}
                </div>
              </Grid>
            </Grid>
            </Grid>

            <Grid item xs={12} className="view-notice-subject-component-grid-item2">
              <Typography
                  variant={descTypography}
                  className="view-notice-subject-component-grid-item-typography2"
              >
                <div contentEditable='true' dangerouslySetInnerHTML={{ __html: NoticeData.notice_content }}></div>
                  
              </Typography>
            </Grid>
            {uploadGrid()}
            <Grid className="view-notice-subject-component-grid-button">
            {
              user.user_admin ==='admin' && <>
              <Button color="primary" variant="contained" className = "view-notice-subject-component-button-revise" onClick={onClickModifyButtonHandler}> 수정하기 </Button>
              <Button color="secondary" variant="contained" className = "view-notice-subject-component-button-delete" onClick={onClickDeleteButtonHandler}> 삭제하기 </Button> </>
            }
            </Grid>
            <Grid className = "view-notice-subject-component-grid-bottom">

            </Grid>
        </Grid>
        </Wrapper>
    );
};
  const ResponsiveNoticeDialog = () => {
    
    const { NoticeDialogOpen, setNoticeDialogOpen } = useContext(CommonContext);
    const { notices, setNotices } = useContext(CommonContext);
    const handleClose = () => {
      setNoticeDialogOpen(false);
    };
    
    return (
      <Wrapper>
        <Dialog
          open={NoticeDialogOpen}
          onClose={handleClose}
          aria-labelledby="max-width-dialog-title"
          PaperProps={{
            style: {
              height: '90vh',
              padding: '10px',
              width: '900px',
              maxWidth: 'none',
              overflowX: 'hidden',
              overflowY: 'auto',
              position: 'inherit',
            },
          }}
          BackdropProps={{
            style: {
              backgroundColor: 'rgba(0,0,0,0.85)',
            },
          }}
        >
        <ViewNoticeDialogSubjectComponent>

        </ViewNoticeDialogSubjectComponent>
        <Grid className="view-notice-subject-component-grid-item-submitform">
            <Close className="btn-close">
              <DialogActions style={{ padding: 0 }}>
                <Grid className="back-btn" onClick={handleClose}>
                  <ClearIcon
                    size="medium"
                    style={{ color: '#fff', cursor: 'pointer' }}
                  />
                </Grid>
              </DialogActions>
            </Close>
        </Grid>
          
        </Dialog>
      </Wrapper>
    );
  };
  
  export default ResponsiveNoticeDialog;