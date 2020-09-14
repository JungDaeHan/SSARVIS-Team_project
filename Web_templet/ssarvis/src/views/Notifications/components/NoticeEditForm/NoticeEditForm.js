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
    Fab,
    Input,
    Paper,
    Avatar,
  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear'
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import SunEditor, {buttonList} from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import DropdownList  from 'react-widgets/lib/DropdownList'
import 'react-widgets/dist/css/react-widgets.css';
import { useDropzone } from 'react-dropzone';
import xIcon from '../../image/x_icon.jpg';

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



const NoticeAddActionComponent = () => {
  const { user, NoticeEditFormData, setNoticeEditFormOpen} = useContext(CommonContext);
  const {noticeEditorContentData} = useContext(CommonContext);
  const { uploadFileData, setUploadFileData } = useContext(CommonContext);
  const {setNotices} = useContext(CommonContext);

  
  const addNoticeHandler = async () => {
    var result = window.confirm('내용을 업로드하시겠습니까?');
    if(result){
      if(NoticeEditFormData.title ==='' || NoticeEditFormData.title === undefined ){
        
        alert('제목을 입력해주세요')
        return;
      }
      if(noticeEditorContentData ==='' || noticeEditorContentData === undefined ){
        
        alert('내용을 입력해주세요')
        return;
      }
  
      if(NoticeEditFormData.category ==='' || NoticeEditFormData.category === undefined || NoticeEditFormData.category === null ){
        
        alert('카테고리를 선택해주세요')
        return;
      }
      const formData = new FormData();

      for (const fileData of uploadFileData) {
        formData.append('files', fileData.file);
      }
      
      var body={
        title: NoticeEditFormData.title,
        content: noticeEditorContentData,
        category : NoticeEditFormData.category,
        user_no: user.user_no,
        files: uploadFileData
      }
      formData.append('mainData',JSON.stringify(body));
      
      Axios.post('/api/notice/create', formData)
      .then(response => {
        
        alert('내용이 업로드되었습니다!!');
        setUploadFileData([]);
        
        let body={
          category: 0,
        }
        let notice_data = {};
        Axios.post('/api/notice/view', body)
        .then(response => {
          notice_data = response.data.data;
          setNotices(notice_data);
          setNoticeEditFormOpen(false);
        })
        .catch(error => {
          alert('컨텐츠를 불러오는데 실패하였습니다.');
          setNoticeEditFormOpen(false);
        });
  
      })
      .catch(error => {
        alert('업로드에 실패하였습니다. 다시 시도하여주십시오.');
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
        float = "right"
        className="edit-notice-grid-button-submit"
      >
        
        <Button
          className = "edit-notice-button-upload"
          color="primary"
          variant="contained"
          onClick = {addNoticeHandler}
          margin-left="100"
          > 글쓰기
        </Button>
       
      
      </Grid>
    </Wrapper>
  );
}


const NoticeEditFormComponent = () => {
    const { NoticeEditFormData, setNoticeEditFormData } = useContext(CommonContext);
    const {noticeEditorContentData,setNoticeEditorContentData} = useContext(CommonContext);
    const {NoticeData} = useContext(CommonContext);
    const {isModifyNotice, setIsModifyNotice} = useContext(CommonContext);
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
                    onChange={onChangeTitleHandler} 
                    >
                    </Input>
                    </div>
                    <div margin-top="10">
                    {cate_comp}
                    <DropdownList className ="edit-notice-dropdown-list" data={categorys}
                      onSelect={onSelectCategoryHandler} >

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
                  onChange={onChangeContentHandler} showToolbar={true}
                  setOptions={{ buttonList: buttonList.complex}}>
                </SunEditor>
              </div>
            </Grid>
            </Grid>
            <NoticeFileUploadComponent></NoticeFileUploadComponent>
            <Grid item xs={12} container display="flex" alignItems= 'center' margin-left="100px">
            <NoticeAddActionComponent></NoticeAddActionComponent>
            </Grid>
        </Grid>
        </Wrapper>
    );
    
}

const NoticeFileUploadComponent = () => {
  const { uploadFileData, setUploadFileData } = useContext(CommonContext);
  const [fileNo, setFileNo] = useState(0);
  const onDrop = useCallback(acceptedFiles => {
    
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone(onDrop);

  useEffect(() => {
    if(uploadFileData.length > 4 )
      alert('더 이상 업로드할 수 없습니다!');
    else{
      for (const file of acceptedFiles) {
        
        const uploadFile = {
          img: URL.createObjectURL(file),
          file: file,
          name: file.path,
          size: file.size,
          fileNo: fileNo,
        }
        
        setFileNo(fileNo+1);
        setUploadFileData(uploadFileData.concat(uploadFile));
      }
    }
  }, [acceptedFiles]);
  const removeUploadFile = fileNo =>{
    setUploadFileData(uploadFileData.filter(uploadfile => uploadfile.fileNo !== fileNo));

  }
  const files = uploadFileData.map((file,index) => {
    return (
      <div className = "edit-notice-upload-file-box1" key={index}>
        <li key={index}>
          {file.name}({file.size}bytes)
        </li>
        <img src={xIcon} alt="cancel icon" className="edit-notice-upload-file-icon-cancel" onClick={() => removeUploadFile(file.fileNo)}></img>
      </div>
    )
      
  });

  return (
    <Wrapper>
      <Paper className="edit-paper">
        <section className="edit-container">
          <div {...getRootProps({ className: 'edit-dropzone' })}>
            <div>
            Upload File
            </div>
            <input {...getInputProps()} />
          </div>
          <aside className="edit-aside">
            <ul>{files}</ul>
          </aside>
        </section>
      </Paper>
    </Wrapper>
  );

}
const NoticeEditForm = () => {
    
    const { NoticeEditFormOpen, setNoticeEditFormOpen } = useContext(CommonContext);
    const { setUploadFileData } = useContext(CommonContext);
  
    const handleClose = () => {
      setNoticeEditFormOpen(false);
      setUploadFileData([]);
    };
    
    return (
      <Wrapper>
        <Dialog
          open={NoticeEditFormOpen}
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
        <NoticeEditFormComponent>
        
        </NoticeEditFormComponent>
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
  export default NoticeEditForm;