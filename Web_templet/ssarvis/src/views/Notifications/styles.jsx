import styled from 'styled-components';



export const Close = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
`;


export const Wrapper = styled.div`
  
  & .edit-paper{
    margin-left: 35px;
    width : 800px;
  }
  & .edit-container {
    display: flex;
    flex-direction: row;
    font-family: 'Noto sans KR', sans-serif;
    height: 100px;
  }
  & .edit-dropzone {
    border-width: 2px;
    border-radius: 2px;
    border-color: #eeeeee;
    border-style: dashed;
    padding: 20px;
    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: border 0.24s ease-in-out;
    &:focus {
      border: #2196f3;
    }
    &.disabled {
      opacity: 0.6;
    }
  }
  & .edit-aside{
    padding: 0 0px;
    font-size: 10px;
  }
  .view-notice-subject-component-grid-item1{
    display: flex;
    padding: 48px 16px 16px 48px !important;
    float: left;
  }
  .view-notice-subject-component-grid-item1-dt{
    display: flex;
    flex-direction: row;
    float : right;
    font-size : 12px;
    margin-left : 100px;

  }
  .view-notice-subject-component-grid-item1-dt-join{
    display: flex;
    flex-direction: column;
    min-width:200px;

  }
  .view-notice-subject-component-grid-item1-dt-updt{
    display: flex;
    flex-direction: column;
  }
  .view-notice-subject-component-grid-item2 {

    padding: 16px 16px 16px 64px !important;
    min-height: 550px;
    border-top-color : gray;
    border-top-style: solid;
    border-top-width: 1.5px;

    border-bottom-color : lightgray;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    
  }
  .view-notice-subject-component-grid-item3 {
    padding-top: 50px;
  }
  .view-notice-subject-component-grid-item-typography1 {
    display:flex;
    flex-direction: row;
    font-weight: 600;
    font-size: 23px;
    min-width: 600px;
    
  }
  .view-notice-subject-component-grid-item-typography2 {
    font-weight: 300;
    height: 200%;
    font-size: 18px;
    
  }
  
  .view-notice-subject-component-upload{
    height:100px;
    border-bottom-color : lightgray;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    
  }
  .view-notice-subject-component-upload-box-title{
    font-size: 11px;
    font-weight:800;
    width:10%;
  }
  .view-notice-subject-component-grid-item-submitform{
    border-bottom-color : lightgray;

    border-bottom-style: solid;
    border-bottom-width: 1px;
    align-items: center;
  }
  .view-notice-subject-component-button-revise{
    margin-left: 340px;
  }
  .view-notice-subject-component-button-delete{
    margin-left: 30px;
  }
  .view-notice-subject-component-grid-button{
    margin-top:20px;
    height:40px;
  }
  .view-notice-subject-component-grid-bottom{
    margin-top: 50px;
    height: 30px;
  }
  .view-notice-upload-file-box1{
    font-size:10px;
    display:flex;
    float: left;
    flex-direction: row;
    margin-left : 40px;
    background-color : lightgray;
    cursor: pointer;
    margin-top: 5px;
    
  }
  .notice-upload-component-fab1{
    background: #ccc;
    align-itmes: center;
  }
  .edit-notice-subject-component-grid-item-typography1 {
    font-weight: 600;
    font-size: 23px;
  }
  .edit-notice-dropdown-list {
    width: 25%;
    height : 25%;
    font-size : 14px;
    display: inline-block; 
  }
  .edit-notice-button-upload {
    align-items: center;
    display: inline-block; 
    
  }
  .edit-notice-upload-file-box1{
    display:flex;
    float: left;
    flex-direction: row;
    margin-left : 40px;
  }
  .edit-notice-upload-file-box2{
    display:flex;
    float: left;
    flex-direction: row;
    alignItems:flex-start;
    margin-left : 40px;
  }
  .edit-notice-grid-suneditor{
    margin-left: 20px;
  }
  .edit-notice-grid-button-submit{
    margin-left: 180px;
  }
  .edit-notice-upload-file-icon-cancel{
    height: 10px;
    width: 10px;
    margin-top: 8px;
    margin-left: 5px;
    display: flex;
    cursor: pointer;
  }
  .modify-notice-grid-button-submit{
    margin-left: 100px;
  }
  .modify-notice-button-submit{
    margin-left: 320px;
  }
  .modify-notice-button-cancel{
    margin-left: 30px;
  }
  .table-notice-icon-clip{
    max-height:20;
    max-width:20;
  }
  .back-btn {
    border: 1px solid #fafafa;
    width: 16px;
    height: 16px;
  }
`;


