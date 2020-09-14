/*!

=========================================================
*  React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import BubbleChart from "@material-ui/icons/BubbleChart";
import Notifications from "@material-ui/icons/Notifications";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import HomeIcon from "@material-ui/icons/Home";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
//import TableList from "views/TableList/TableList.js";
import Temperature from "views/Temperature/Temperature.js";
import adminTemperature from "views/Temperature/adminTemperature.js";
import Icons from "views/Icons/Icons.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import MainPage from "views/mainPage.js";

// core components/views for RTL layout
import RTLPage from "views/RTLPage/RTLPage.js";

import AdminDashboard from "views/Dashboard/AdminDashboard.js";

const dashboardRoutes = [
  {
    path: "/mainpage",
    name: "",
    rtlName: "لوحة القيادة",
    icon: HomeIcon,
    component_admin: MainPage,
    component_user: MainPage,
    layout: "/admin",
  },
  {
    path: "/dashboard",
    name: "출석현황",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component_admin: AdminDashboard,
    component_user: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "마이페이지",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component_admin: UserProfile,
    component_user: UserProfile,
    layout: "/admin",
  },
  {
    path: "/temperature",
    name: "온도 체크",
    rtlName: "قائمة الجدول",
    icon: LocalHospitalIcon,
    component_admin: adminTemperature,
    component_user: Temperature,
    layout: "/admin",
  },
  // {
  //   path: "/typography",
  //   name: "커뮤니티",
  //   rtlName: "طباعة",
  //   icon: LibraryBooks,
  //   component_admin: Typography,
  //   component_user: Typography,
  //   layout: "/admin",
  // },
  {
    path: "/notice-message",
    name: "알림 메세지",
    rtlName: "الرموز",
    icon: BubbleChart,
    component_admin: Icons,
    component_user: Icons,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "공지사항",
    rtlName: "إخطارات",
    icon: Notifications,
    component_admin: NotificationsPage,
    component_user: NotificationsPage,
    layout: "/admin",
  },
  /*
  {
    path: "/rtl-page",
    name: "RTL Support",
    rtlName: "پشتیبانی از راست به چپ",
    icon: Language,
    component: RTLPage,
    layout: "/rtl"
  },
  
  {
    path: "/upgrade-to-pro",
    name: "Upgrade To PRO",
    rtlName: "التطور للاحترافية",
    icon: Unarchive,
    component: UpgradeToPro,
    layout: "/admin"
  }
  */
];

const userRouter = [
  {
    path: "/dashboard",
    name: "출석현황",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/user",
  },
  {
    path: "/user",
    name: "마이페이지",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UserProfile,
    layout: "/user",
  },
  {
    path: "/temperature",
    name: "온도 체크",
    rtlName: "قائمة الجدول",
    icon: LocalHospitalIcon,
    component: Temperature,
    layout: "/user",
  },
  // {
  //   path: "/typography",
  //   name: "커뮤니티",
  //   rtlName: "طباعة",
  //   icon: LibraryBooks,
  //   component: Typography,
  //   layout: "/user",
  // },
  // {
  //   path: "/icons",
  //   name: "알림 메세지",
  //   rtlName: "الرموز",
  //   icon: BubbleChart,
  //   component: Icons,
  //   layout: "/user",
  // },
  {
    path: "/notifications",
    name: "공지사항",
    rtlName: "إخطارات",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/user",
  },
  /*
  {
    path: "/rtl-page",
    name: "RTL Support",
    rtlName: "پشتیبانی از راست به چپ",
    icon: Language,
    component: RTLPage,
    layout: "/rtl"
  },
  
  {
    path: "/upgrade-to-pro",
    name: "Upgrade To PRO",
    rtlName: "التطور للاحترافية",
    icon: Unarchive,
    component: UpgradeToPro,
    layout: "/admin"
  }
  */
];

export default { dashboardRoutes, userRouter };
