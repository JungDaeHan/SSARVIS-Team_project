import React, { useContext, useState, useEffect, useCallback } from 'react';
import { CommonContext } from '../../../../context/CommonContext';
import { Wrapper, Close } from '../../styles'
import {
    Button,
    Dialog,
    DialogActions,
    Grid,
    Typography,
    useMediaQuery,
    Input,
  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear'
import Axios from 'axios';
import SunEditor, {buttonList} from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import DropdownList  from 'react-widgets/lib/DropdownList'
import 'react-widgets/dist/css/react-widgets.css';


const useStyles = makeStyles(theme => ({
  titleForm:{
    width : 400,
    height : 18
  },
  contentForm:{
    width : 700,
    height : 650
  },
  

}));


const NoticeModifyActionComponent = () => {
  const { user, NoticeEditFormData} = useContext(CommonContext);
  const {noticeEditorContentData} = useContext(CommonContext);
  const {setIsModifyNotice} = useContext(CommonContext);
  const {setNotices} = useContext(CommonContext);

  
  const handleClose = async () => {
    var result = window.confirm('창을 빠져나가시겠습니까? 수정 중인 내용은 사라집니다.');
    if(result){
        setIsModifyNotice(false);
    }
    
  }

  const modifyNoticeHandler = async (event) => {
    var result = window.confirm('수정하시겠습니까?');
    if(result){
        
        if(NoticeEditFormData.title ==='' || NoticeEditFormData.title === undefined ){
            
            alert('제목을 입력해주세요')
            return;
        }
        if(noticeEditorContentData ==='' || noticeEditorContentData === undefined ){
            
            alert('내용을 입력해주세요')
            return;
        }

        if(NoticeEditFormData.category ==='' || NoticeEditFormData.category === undefined || NoticeEditFormData.category === null){
            
            alert('카테고리를 선택해주세요')
            return;
        }

        let body={
            title: NoticeEditFormData.title,
            content: noticeEditorContentData,
            category : NoticeEditFormData.category,
            user_no: user.user_no,
            notice_no : NoticeEditFormData.notice_no,
        }


        Axios.post('/api/notice/update', body)
        .then(response => {
            
            alert('내용이 수정되었습니다!');
            
            let body={
            category: 0,
            }
            let notice_data = {};
            Axios.post('/api/notice/view', body)
            .then(response => {
            notice_data = response.data.data;
            setNotices(notice_data);
            setIsModifyNotice(false);
            
            })
            .catch(error => {
            alert('내용을 불러오는데 실패하였습니다.');
            });
            
            
        })
        .catch(error => {
            alert('수정에 실패하였습니다. 다시 시도하여주십시오.');
        });

    }
    
    
    
  }
  
  
  return (
    <Wrapper>
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
        position="relative"
      >
      <Button
      color="primary"
      variant="contained"
      onClick = {modifyNoticeHandler}
      className="modify-notice-button-submit"
      > 수정완료
      </Button>
      <Button
      color="primary"
      variant="outlined"
      onClick = {handleClose}
      className="modify-notice-button-cancel"
      > 취소
      </Button>
      </Grid>
    </Wrapper>
  );
}

const NoticeModifyFormComponent = () => {
    const {NoticeEditFormData,setNoticeEditFormData} = useContext(CommonContext);
    const {noticeEditorContentData,setNoticeEditorContentData} = useContext(CommonContext);
    const {NoticeData} = useContext(CommonContext);
    const mobileFont = useMediaQuery('(max-width:600px)');
    let titleTypography = mobileFont ? 'h5' : 'h2';
    const title_comp = "제목 : ";
    const cate_comp =  "분류 : ";
    const classes = useStyles();
    
    let categorys = ['학습','평가','운영','사이트','기타'];
    
    const onChangeTitleHandler = async event =>{
      setNoticeEditFormData({...NoticeEditFormData, title: event.target.value});
      
    }

    const onChangeContentHandler = async content =>{
      setNoticeEditorContentData(content);
     
    }

    const onSelectCategoryHandler = async event =>{
      
      let category = 0;
      switch(event){
        case '학습' :
          category =1;
          break;
        case '평가' :
          category =2;
          break;
        case '운영' :
          category =3;
          break;
        case '사이트' :
          category =4;
          break;
        case '기타' :
          category =5;
          break;
        default:
          break; 
      }
      
      setNoticeEditFormData({...NoticeEditFormData, category: category})
      
    }
    
    const value_title = NoticeData.notice_title;
    const value_dropdown =categorys[NoticeData.notice_category-1];
    const value_editor = noticeEditorContentData;

   
    
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
                className="edit-notice-subject-component-grid-item-typography1"
                >
                
                  <form>
                    <div>
                    {title_comp}
                    <Input className = {classes.titleForm} placeholder= "제목을 입력해주세요"
                    onChange={onChangeTitleHandler} defaultValue={value_title}
                    >
                    </Input>
                    </div>
                    <div margin-top="10">
                    {cate_comp}
                    <DropdownList className ="edit-notice-dropdown-list" data={categorys}
                      onSelect={onSelectCategoryHandler} defaultValue={value_dropdown}>

                    </DropdownList>
                    </div>
                  </form>
                </Typography>
            </Grid>
            </Grid>
            <Grid item xs={12} container className="edit-notice-grid-suneditor">
            <Grid>
              <div>
                <SunEditor id="sunEditor" lang="ko" name= "editor" width = "800" height = "500" 
                  setContents={value_editor}
                  onChange={onChangeContentHandler} 
                  showToolbar={true}
                  setOptions={{ buttonList: buttonList.complex}}>
                </SunEditor>
              </div>
            </Grid>
            </Grid>
            <Grid item xs={12} container display="flex" alignItems= 'center' margin-left="100px">
            <NoticeModifyActionComponent></NoticeModifyActionComponent>
            </Grid>
        </Grid>
        </Wrapper>
    );
    
}
const NoticeModifyForm = () => {
    
    const {isModifyNotice, setIsModifyNotice} = useContext(CommonContext);
  
    const handleClose = () => {
        var result = window.confirm('창을 빠져나가시겠습니까? 수정 중인 내용은 사라집니다.');
        if(result){
            setIsModifyNotice(false);
        }
    };
    
    return (
      <Wrapper>
        <Dialog
          open={isModifyNotice}
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
        <NoticeModifyFormComponent>
        
        </NoticeModifyFormComponent>
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
        </Dialog>
      </Wrapper>
    );
  };
  export default NoticeModifyForm;