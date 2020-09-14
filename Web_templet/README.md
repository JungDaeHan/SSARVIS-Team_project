![image](/uploads/5f6e969a7248c8564257e77cb1293c7e/image.png)


# SSARVIS

> React Web-IOT 프로젝트 [싸비스](http://i3a109.p.ssafy.io/)

## 프로젝트 소개

 edu ssafy를 대체할 플랫폼이 나타났다?  
 출석 체크를 늦거나 깜빡하는 싸피인들을 위한 자동 출석 시스템과  
 간단하게 온도체크와 등록을 같이 할 수 있는 코로나 시대의 스마트한 온도 관리 시스템부터  
 싸피의 든든한 조력자 운영프로님들을 위해 준비한 온도 및 출석 관리 시스템과   
 싸피인들에게 손쉽게 메시지를 전송할 수 있는 기능까지!  
 모든 걸 갖춘 이 시대의 마에스트로 만능 플랫폼 '싸비스'를 소개합니다.  
 
   
## Prerequisites
npm>=6.14.6  
node>=12.18.3  
  
  
## Support Browser

|<img src="/uploads/501d78fab52c4570c9c00d3d1a6126bd/googlechrome.png" height="48" width="48" >|
|---|
|Latest|

    
## HOW TO INSTALL
    
    
### frontend
```
    cd ssarvis
    npm install
    npm start
```

  
### backend
```
    npm install
    npm start
```

  
  
## Function

  
#### auto attendence check
    자동 출석 기능. 안드로이드 앱에서 정해진 시간에 블루투스 기능을 켠 후 임베디드 장비에서 mac 주소를 캡쳐 후 데이터베이스에 질의한 뒤에 출석 정보를 저장. 
    
#### temparature measure and attendence check
    온도 측정 기능. RFID를 스캔하여 출석체크를 하고 자체 제작한 온도 측정 장비를 이용하여 온도를 측정한 후 데이터베이스에 저장
    
#### Notification message send to ssafy trainee
    네이버 api를 이용하여 웹 메시지를 학생들에게 발신

#### trainee management for manager
    관리자들을 위한 출석 및 온도 체크 관리 시스템
    
#### attendence board for trainee
    교육생들이 출석 관련 정보를 확인할 수 있는 페이지 구현
    
#### notification board
    공지사항을 게시할 수 있는 페이지 구현
    
      
      
## Contributor
  
정대한(PM, Fullstack)  - [ddrboy77](https://lab.ssafy.com/ddrboy77)  
최인욱(Developer, Fullstack and Android) - [iu.choi3817](https://lab.ssafy.com/iu.choi3197)    
김기훈(Developer, Fullstack)  - [vosdldii](https://lab.ssafy.com/vosdldii)  
최현우(Developer, Fullstack)  - [jilp1598](https://lab.ssafy.com/jilp1598)  
방소윤(Developer, Backend and Embedded)  - [bbangso0322](https://lab.ssafy.com/bbangso0322)  

  
  
## Licsence

This project is licensed under the MIT License - see the LICENSE.md file for details  

