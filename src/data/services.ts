// 台科大學生專區（https://i.ntust.edu.tw/student）的系統捷徑。
// 登入都在學校網站進行，app 不經手帳號密碼。
export type Service = { id: string; name: string; url: string; login: boolean };
export type ServiceGroup = { title: string; items: Service[] };

export const PORTAL_URL = "https://i.ntust.edu.tw/student";

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    title: "課程",
    items: [
      { id: "select", name: "選課系統", url: "https://courseselection.ntust.edu.tw/", login: true },
      { id: "query", name: "課程查詢", url: "https://querycourse.ntust.edu.tw/QueryCourse/", login: false },
      { id: "score", name: "成績查詢", url: "https://StuInfoSys.ntust.edu.tw/StuScoreQueryServ/StuScoreQuery", login: true },
      { id: "judge", name: "課程評量", url: "https://StuInfoSys.ntust.edu.tw/JudgeCourseServ/JudgeCourse", login: true },
      { id: "required", name: "學生必修課程", url: "https://stu.ntust.edu.tw/stueduneed/stu_login.aspx", login: true },
      { id: "drop2", name: "二次退選申請", url: "https://courseselection.ntust.edu.tw/", login: true },
      { id: "double", name: "輔系雙主修申請", url: "https://cour01.ntust.edu.tw/StudentDoubleMajor/", login: true },
      { id: "program", name: "學分學程申請", url: "https://cour01.ntust.edu.tw/DMP_student/", login: true },
      { id: "inter", name: "校際選課系統（外校生）", url: "https://interuniversity.ntust.edu.tw/", login: true },
      { id: "ethics", name: "學術研究倫理報名", url: "https://ae.ntust.edu.tw", login: true },
      { id: "sp", name: "社會實踐課程系統", url: "https://sp.cge.ntust.edu.tw", login: true },
    ],
  },
  {
    title: "個人資訊",
    items: [
      { id: "info", name: "學籍管理系統", url: "https://stuinfosys.ntust.edu.tw/StudentInformation", login: true },
      { id: "conduct", name: "操行成績列印", url: "https://stu.ntust.edu.tw/Behavior/account/login", login: true },
      { id: "card", name: "學生證掛失暨補發", url: "https://cardsystem.ntust.edu.tw/std/index.php/user/login", login: true },
      { id: "portfolio", name: "學習歷程資訊網", url: "https://eportfolio.ntust.edu.tw/", login: true },
      { id: "thesis", name: "論文、指導教授資料", url: "https://stuinfosys.ntust.edu.tw/ThesisAdvisor", login: true },
      { id: "leave", name: "畢業生離校手續單", url: "https://StuInfoSys.ntust.edu.tw/SAGraduatesServ/SAGraduates", login: true },
    ],
  },
  {
    title: "生活",
    items: [
      { id: "dorm", name: "宿舍系統", url: "https://sa.ntust.edu.tw/Dorm/", login: true },
      { id: "room", name: "教室借用", url: "https://sa02.ntust.edu.tw/classroom_user/SSO_login.aspx", login: true },
      { id: "counsel", name: "諮商輔導預約", url: "https://sa02.ntust.edu.tw/WebCounseling/", login: true },
      { id: "suggest", name: "學生建言討論平台", url: "https://suggestionbox.ntust.edu.tw/login", login: true },
    ],
  },
  {
    title: "助學",
    items: [
      { id: "scholar", name: "獎學金系統", url: "https://sa.ntust.edu.tw/Scholarship/", login: true },
      { id: "work", name: "工讀助學金（學習型）", url: "https://studentpay.ntust.edu.tw/", login: true },
      { id: "waiver", name: "學雜費減免申請", url: "https://student.ntust.edu.tw/p/405-1053-79878,c8400.php?Lang=zh-tw", login: false },
      { id: "aid", name: "弱勢助學金申請", url: "https://student.ntust.edu.tw/p/405-1053-82565,c8425.php?Lang=zh-tw", login: false },
    ],
  },
  {
    title: "校園資源與帳號",
    items: [
      { id: "software", name: "校園授權軟體下載", url: "https://www.cc.ntust.edu.tw/p/412-1050-8352.php?Lang=zh-tw", login: false },
      { id: "docs", name: "校內文件系統", url: "https://ccdoc.ntust.edu.tw/docmgsystem/login.aspx", login: true },
      { id: "exchange", name: "交換生選課系統", url: "https://stu.ntust.edu.tw/exchange_stu/login.aspx", login: true },
      { id: "pw", name: "修改密碼", url: "https://i.ntust.edu.tw/AccountManagement/ChangePassword", login: true },
      { id: "forgot", name: "忘記密碼", url: "https://i.ntust.edu.tw/AccountManagement/ForgetPassword", login: false },
    ],
  },
];

export const ALL_SERVICES = SERVICE_GROUPS.flatMap((g) => g.items);
export const DEFAULT_FAVORITES = ["select", "score", "query", "dorm"];
