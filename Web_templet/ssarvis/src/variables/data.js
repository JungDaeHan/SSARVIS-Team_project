export const tardy = [
  { attendance: "지각", class: "1반", total: 5 },
  { attendance: "지각", class: "2반", total: 27 },
  { attendance: "지각", class: "3반", total: 1 },
  { attendance: "지각", class: "4반", total: 1 },
  { attendance: "지각", class: "5반", total: 0 },
  { attendance: "지각", class: "6반", total: 8 },
  { attendance: "지각", class: "7반", total: 7 },
];

export const absent = [
  { attendance: "결석", class: "1반", total: 45 },
  { attendance: "결석", class: "2반", total: 4 },
  { attendance: "결석", class: "3반", total: 51 },
  { attendance: "결석", class: "4반", total: 91 },
  { attendance: "결석", class: "5반", total: 21 },
  { attendance: "결석", class: "6반", total: 8 },
  { attendance: "결석", class: "7반", total: 10 },
];

export const compareData = [
  { area: "서울", month: "8월", total: "15" },
  { area: "구미", month: "8월", total: "5" },
  { area: "대전", month: "8월", total: "2" },
  { area: "광주", month: "8월", total: "3" },

  { area: "서울", month: "7월", total: "14" },
  { area: "구미", month: "7월", total: "18" },
  { area: "대전", month: "7월", total: "26" },
  { area: "광주", month: "7월", total: "5" },

  { area: "서울", month: "6월", total: "1" },
  { area: "구미", month: "6월", total: "11" },
  { area: "대전", month: "6월", total: "40" },
  { area: "광주", month: "6월", total: "22" },
];

export const tardy_absent_tableColum = ["이름", "전화", "지각", "결석"];

export const temp_temperature = {
  labels : ["8/1","8/2","8/3","8/4","8/5","8/6","8/7","8/8","8/9","8/10","8/11","8/12","8/13","8/14","8/15","8/16","8/17","8/18","8/19","8/20"],
  datas : [37.5,36.8,36.9,37.1,37.4, 36.5,35.8,36.3,37.0,36.8, 36.4,37.5,37.3,36.5,35.8, 36.7,36.8,36.9,37.4,37.1],
};

export const list_attendance = [
  {
    columns: [
      {
        title: "이름",
        field: "name",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "기수",
        field: "stage",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "지역",
        field: "city",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "반",
        field: "group",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "주소",
        field: "address",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "메일",
        field: "email",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "전화",
        field: "phone",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "출석",
        field: "attendance",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "지각",
        field: "record1",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "결석",
        field: "record2",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      // {
      //   title: "",
      //   field: "tmp",
      //   headerStyle: {
      //     backgroundColor: "#FFF",
      //   },
      // },
    ],
    data: [
      {
        name: "정대한",
        stage: "3기",
        city: "서울",
        group: "1반",
        address: "잠실",
        email: "korea@ssafy.com",
        phone: "1577-1577",
        attendance: "지각",
        record1: "1회",
        record2: "2회",
      },
    ],
  },
];

export const list_user = [
  {
    columns: [
      {
        title: "이름",
        field: "name",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "기수",
        field: "stage",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "지역",
        field: "city",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "반",
        field: "group",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "주소",
        field: "address",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "메일",
        field: "email",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "전화",
        field: "phone",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "",
        field: "tmp",
        headerStyle: {
          backgroundColor: "#FFF",
        },
      },
    ],
    data: [],
  },
];

export const list_temperature = [
  {
    columns: [
      {
        title: "번호",
        field: "user_no",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "이름",
        field: "user_name",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "지역",
        field: "user_city",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "반",
        field: "user_group",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "기수",
        field: "user_stage",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "금일 평균 온도",
        field: "temperature",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
      {
        title: "관리 대상 여부",
        field: "danger",
        headerStyle: {
          backgroundColor: "#2E9AFE",
          color: "#FFF",
        },
      },
    ],
    data: [],
  },
];
